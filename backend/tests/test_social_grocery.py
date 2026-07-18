"""Tests for Social Grocery of Souli project sync (preview -> production DB)."""
import os
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://three-thirds-cms.preview.emergentagent.com").rstrip("/")
PROJECT_ID = "970d60e6-de39-422f-9336-46bf3307159d"
BUTTON_ID = f"project_learn_more_{PROJECT_ID}"


@pytest.fixture(scope="module")
def projects():
    r = requests.get(f"{BASE_URL}/api/projects/", timeout=15)
    assert r.status_code == 200, f"GET /api/projects/ failed: {r.status_code}"
    return r.json()


def test_projects_endpoint_returns_list(projects):
    assert isinstance(projects, list)
    assert len(projects) >= 1


def test_social_grocery_project_present(projects):
    ids = [p.get("id") for p in projects]
    assert PROJECT_ID in ids, f"Social Grocery project id not in {ids}"


def test_social_grocery_project_fields(projects):
    p = next(x for x in projects if x.get("id") == PROJECT_ID)
    # Title contains Greek subtitle
    assert "Κοινωνικό Παντοπωλείο Σουλίου" in p["title"]
    assert p["category"] == "Social Economy"
    # Greek description
    assert "Δήμο Σουλίου" in p["description"] or "Σουλίου" in p["description"]
    assert p.get("isActive") is True
    assert p.get("image"), "Project should have an image URL"


def test_learn_more_button_exists():
    r = requests.get(f"{BASE_URL}/api/buttons/{BUTTON_ID}", timeout=15)
    assert r.status_code == 200, f"Button not found: {r.status_code}"
    b = r.json()
    assert b["buttonId"] == BUTTON_ID
    assert b["isVisible"] is True
    assert b["clickAction"] == "show_message"
    # Verify Greek popup message content
    assert "Κοινωνικό Παντοπωλείο" in b["clickMessage"]
    assert "Δήμου Σουλίου" in b["clickMessage"]
    # Should contain image markdown for popup
    assert "![" in b["clickMessage"]


def test_content_migration_has_project():
    with open("/app/backend/content_migration.py", "r", encoding="utf-8") as f:
        content = f.read()
    assert PROJECT_ID in content
    assert "Κοινωνικό Παντοπωλείο Σουλίου" in content
    assert BUTTON_ID in content
