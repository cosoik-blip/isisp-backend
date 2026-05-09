"""Helpers for deleting uploaded file blobs that are no longer referenced
by any news article or project. Used by admin endpoints that update or
delete content with file attachments.
"""
import re
import logging
from typing import Iterable, List, Optional, Set

from database import (
    uploaded_files_collection,
    news_collection,
    projects_collection,
)

logger = logging.getLogger(__name__)

# Matches the internal upload URLs we emit, with or without a backend host prefix:
#   /api/upload/documents/{filename}
#   /api/upload/images/{filename}
_UPLOAD_URL_RE = re.compile(r"/api/upload/(?:documents|images)/([^/?#]+)$")


def extract_internal_filenames(urls: Iterable[Optional[str]]) -> Set[str]:
    """Return the set of internal upload filenames referenced by the given URLs.
    URLs that don't match our upload pattern (e.g. external https URLs) are ignored.
    """
    out: Set[str] = set()
    for url in urls or []:
        if not url or not isinstance(url, str):
            continue
        m = _UPLOAD_URL_RE.search(url)
        if m:
            out.add(m.group(1))
    return out


def collect_news_file_urls(article: Optional[dict]) -> List[str]:
    """Collect every file URL referenced by a news article document."""
    if not article:
        return []
    urls: List[str] = []
    if article.get("image"):
        urls.append(article["image"])
    if article.get("document"):
        urls.append(article["document"])
    for d in (article.get("documents") or []):
        if isinstance(d, dict) and d.get("url"):
            urls.append(d["url"])
    return urls


def collect_project_file_urls(project: Optional[dict]) -> List[str]:
    """Collect every file URL referenced by a project document."""
    if not project:
        return []
    return [project["image"]] if project.get("image") else []


async def _is_referenced_elsewhere(
    filename: str,
    exclude_news_id: Optional[str] = None,
    exclude_project_id: Optional[str] = None,
) -> bool:
    """Return True if any news article or project (other than the excluded ones)
    still references the given uploaded filename.
    """
    pattern = {"$regex": re.escape(filename) + "(?:[?#].*)?$"}

    news_query: dict = {
        "$or": [
            {"image": pattern},
            {"document": pattern},
            {"documents.url": pattern},
        ]
    }
    if exclude_news_id:
        news_query = {"$and": [news_query, {"id": {"$ne": exclude_news_id}}]}

    if await news_collection.find_one(news_query, {"_id": 1}):
        return True

    proj_query: dict = {"image": pattern}
    if exclude_project_id:
        proj_query = {"$and": [proj_query, {"id": {"$ne": exclude_project_id}}]}

    if await projects_collection.find_one(proj_query, {"_id": 1}):
        return True

    return False


async def delete_orphan_files(
    filenames: Iterable[str],
    exclude_news_id: Optional[str] = None,
    exclude_project_id: Optional[str] = None,
) -> int:
    """Delete uploaded_files docs that are no longer referenced anywhere.
    Each delete is best-effort: failures are logged but do not raise.
    Returns the number of files actually removed.
    """
    removed = 0
    for fn in set(filenames or []):
        try:
            if await _is_referenced_elsewhere(
                fn,
                exclude_news_id=exclude_news_id,
                exclude_project_id=exclude_project_id,
            ):
                continue
            result = await uploaded_files_collection.delete_one({"filename": fn})
            if result.deleted_count:
                removed += 1
                logger.info(f"Orphan cleanup: deleted uploaded file {fn}")
        except Exception as e:
            # Never let cleanup failures break the parent admin operation.
            logger.warning(f"Orphan cleanup: failed to remove {fn}: {e}")
    return removed
