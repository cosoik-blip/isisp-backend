from fastapi import APIRouter, HTTPException, UploadFile, File, Header
from fastapi.responses import Response
import os
import uuid
import logging
from pathlib import Path
from datetime import datetime
from database import uploaded_files_collection
import base64

router = APIRouter(prefix="/api/upload", tags=["upload"])
logger = logging.getLogger(__name__)

# Allowed image extensions
ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
# Allowed document extensions
ALLOWED_DOCUMENT_EXTENSIONS = {'.pdf', '.doc', '.docx'}
# All allowed extensions
ALLOWED_EXTENSIONS = ALLOWED_IMAGE_EXTENSIONS | ALLOWED_DOCUMENT_EXTENSIONS

MAX_FILE_SIZE = 20 * 1024 * 1024  # 20MB for documents

# Content types mapping
CONTENT_TYPES = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
}

@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    authorization: str = Header(None)
):
    """Upload an image file and store it in MongoDB"""
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
        unique_id = str(uuid.uuid4())
        unique_filename = f"{unique_id}{file_ext}"
        
        # Store in MongoDB
        file_doc = {
            "filename": unique_filename,
            "original_filename": file.filename,
            "content_type": CONTENT_TYPES.get(file_ext, 'application/octet-stream'),
            "data": base64.b64encode(content).decode('utf-8'),
            "size": len(content),
            "uploaded_at": datetime.utcnow()
        }
        
        await uploaded_files_collection.insert_one(file_doc)
        
        # Get the backend URL from environment
        backend_url = os.environ.get('REACT_APP_BACKEND_URL', '')
        
        # Return the URL to access the uploaded image
        image_url = f"{backend_url}/api/upload/images/{unique_filename}"
        
        logger.info(f"Image uploaded successfully to MongoDB: {unique_filename}")
        
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
    """Serve an uploaded image from MongoDB"""
    try:
        # Sanitize filename to prevent issues
        safe_filename = Path(filename).name
        
        # Find the file in MongoDB
        file_doc = await uploaded_files_collection.find_one({"filename": safe_filename})
        
        if not file_doc:
            raise HTTPException(status_code=404, detail="Image not found")
        
        # Decode the base64 data
        content = base64.b64decode(file_doc["data"])
        
        return Response(
            content=content,
            media_type=file_doc["content_type"],
            headers={
                "Cache-Control": "public, max-age=31536000",
                "Content-Disposition": f"inline; filename={safe_filename}"
            }
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
    """Delete an uploaded image from MongoDB"""
    try:
        # Validate authorization
        if not authorization or not authorization.startswith("Basic "):
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        # Sanitize filename
        safe_filename = Path(filename).name
        
        # Delete from MongoDB
        result = await uploaded_files_collection.delete_one({"filename": safe_filename})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Image not found")
        
        logger.info(f"Image deleted from MongoDB: {filename}")
        
        return {"success": True, "message": "Image deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting image {filename}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete image")
