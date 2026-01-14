from fastapi import APIRouter, HTTPException, UploadFile, File, Header
from fastapi.responses import FileResponse
import os
import uuid
import logging
from pathlib import Path
import aiofiles

router = APIRouter(prefix="/api/upload", tags=["upload"])
logger = logging.getLogger(__name__)

# Create uploads directory
UPLOAD_DIR = Path("/app/backend/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Allowed image extensions
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    authorization: str = Header(None)
):
    """Upload an image file and return its URL"""
    try:
        # Validate authorization (basic check)
        if not authorization or not authorization.startswith("Basic "):
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        # Validate file extension
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        
        # Read file content
        content = await file.read()
        
        # Check file size
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB"
            )
        
        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(content)
        
        # Get the backend URL from environment
        backend_url = os.environ.get('REACT_APP_BACKEND_URL', '')
        
        # Return the URL to access the uploaded image
        image_url = f"{backend_url}/api/upload/images/{unique_filename}"
        
        logger.info(f"Image uploaded successfully: {unique_filename}")
        
        return {
            "success": True,
            "url": image_url,
            "filename": unique_filename
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading image: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to upload image")

@router.get("/images/{filename}")
async def get_image(filename: str):
    """Serve an uploaded image"""
    try:
        # Sanitize filename to prevent directory traversal
        safe_filename = Path(filename).name
        file_path = UPLOAD_DIR / safe_filename
        
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="Image not found")
        
        # Determine content type
        ext = file_path.suffix.lower()
        content_types = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
        }
        content_type = content_types.get(ext, 'application/octet-stream')
        
        return FileResponse(
            path=file_path,
            media_type=content_type,
            filename=safe_filename
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error serving image {filename}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to serve image")

@router.delete("/images/{filename}")
async def delete_image(
    filename: str,
    authorization: str = Header(None)
):
    """Delete an uploaded image"""
    try:
        # Validate authorization
        if not authorization or not authorization.startswith("Basic "):
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        # Sanitize filename
        safe_filename = Path(filename).name
        file_path = UPLOAD_DIR / safe_filename
        
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="Image not found")
        
        os.remove(file_path)
        logger.info(f"Image deleted: {filename}")
        
        return {"success": True, "message": "Image deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting image {filename}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete image")
