from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from typing import List
from models import (
    Service, ServiceCreate, ServiceUpdate, 
    Project, ProjectCreate, ProjectUpdate,
    CompanySetting, CompanySettingUpdate, CompanySettingCreate,
    ContactInquiry, ContactInquiryUpdate,
    ButtonConfig, ButtonConfigCreate, ButtonConfigUpdate,
    NewsArticle, NewsArticleCreate, NewsArticleUpdate,
    APIResponse
)
from database import (
    services_collection, 
    projects_collection, 
    company_settings_collection, 
    contact_inquiries_collection,
    button_configs_collection,
    news_collection
)
from datetime import datetime
import logging
import secrets

router = APIRouter(prefix="/api/admin", tags=["admin"])
logger = logging.getLogger(__name__)
security = HTTPBasic()

# Admin credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "254TFD98"

def authenticate_admin(credentials: HTTPBasicCredentials = Depends(security)):
    """Authenticate admin user"""
    is_correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    is_correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    
    if not (is_correct_username and is_correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

# Dashboard Overview
@router.get("/dashboard")
async def get_dashboard_overview(admin_user: str = Depends(authenticate_admin)):
    """Get dashboard overview statistics"""
    try:
        # Get counts
        services_count = await services_collection.count_documents({"isActive": True})
        projects_count = await projects_collection.count_documents({"isActive": True})
        buttons_count = await button_configs_collection.count_documents({})
        total_inquiries = await contact_inquiries_collection.count_documents({})
        new_inquiries = await contact_inquiries_collection.count_documents({"status": "new"})
        
        # Get recent inquiries (last 5)
        recent_inquiries_cursor = contact_inquiries_collection.find().sort("createdAt", -1).limit(5)
        recent_inquiries = await recent_inquiries_cursor.to_list(length=5)
        
        # Clean up inquiries for JSON
        for inquiry in recent_inquiries:
            if "_id" in inquiry:
                del inquiry["_id"]
        
        stats = {
            "services_count": services_count,
            "projects_count": projects_count,
            "buttons_count": buttons_count,
            "total_inquiries": total_inquiries,
            "new_inquiries": new_inquiries,
            "recent_inquiries": recent_inquiries
        }
        
        logger.info(f"Admin dashboard accessed by {admin_user}")
        return stats
        
    except Exception as e:
        logger.error(f"Error getting dashboard overview: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get dashboard overview")

# Services Management
@router.get("/services", response_model=List[Service])
async def get_all_services_admin(admin_user: str = Depends(authenticate_admin)):
    """Get all services including inactive ones"""
    try:
        cursor = services_collection.find().sort("order", 1)
        services = await cursor.to_list(length=100)
        
        for service in services:
            if "_id" in service:
                del service["_id"]
        
        return services
        
    except Exception as e:
        logger.error(f"Error retrieving admin services: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve services")

@router.post("/services", response_model=APIResponse)
async def create_service_admin(service: ServiceCreate, admin_user: str = Depends(authenticate_admin)):
    """Create a new service"""
    try:
        service_obj = Service(**service.dict())
        result = await services_collection.insert_one(service_obj.dict())
        
        if result.inserted_id:
            logger.info(f"Admin {admin_user} created service: {service_obj.title}")
            return APIResponse(
                success=True,
                message="Service created successfully",
                data={"id": service_obj.id}
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to create service")
            
    except Exception as e:
        logger.error(f"Error creating service: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create service")

@router.put("/services/{service_id}", response_model=APIResponse)
async def update_service_admin(service_id: str, service_update: ServiceUpdate, admin_user: str = Depends(authenticate_admin)):
    """Update a service"""
    try:
        update_data = {k: v for k, v in service_update.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        
        update_data["updatedAt"] = datetime.utcnow()
        
        result = await services_collection.update_one(
            {"id": service_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Service not found")
        
        logger.info(f"Admin {admin_user} updated service {service_id}")
        return APIResponse(success=True, message="Service updated successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating service {service_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update service")

@router.delete("/services/{service_id}", response_model=APIResponse)
async def delete_service_admin(service_id: str, admin_user: str = Depends(authenticate_admin)):
    """Soft delete a service"""
    try:
        result = await services_collection.update_one(
            {"id": service_id},
            {"$set": {"isActive": False, "updatedAt": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Service not found")
        
        logger.info(f"Admin {admin_user} deleted service {service_id}")
        return APIResponse(success=True, message="Service deleted successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting service {service_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete service")

# Projects Management
@router.get("/projects", response_model=List[Project])
async def get_all_projects_admin(admin_user: str = Depends(authenticate_admin)):
    """Get all projects including inactive ones"""
    try:
        cursor = projects_collection.find().sort("order", 1)
        projects = await cursor.to_list(length=100)
        
        for project in projects:
            if "_id" in project:
                del project["_id"]
        
        return projects
        
    except Exception as e:
        logger.error(f"Error retrieving admin projects: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve projects")

@router.post("/projects", response_model=APIResponse)
async def create_project_admin(project: ProjectCreate, admin_user: str = Depends(authenticate_admin)):
    """Create a new project"""
    try:
        project_obj = Project(**project.dict())
        result = await projects_collection.insert_one(project_obj.dict())
        
        if result.inserted_id:
            logger.info(f"Admin {admin_user} created project: {project_obj.title}")
            return APIResponse(
                success=True,
                message="Project created successfully",
                data={"id": project_obj.id}
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to create project")
            
    except Exception as e:
        logger.error(f"Error creating project: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create project")

@router.put("/projects/{project_id}", response_model=APIResponse)
async def update_project_admin(project_id: str, project_update: ProjectUpdate, admin_user: str = Depends(authenticate_admin)):
    """Update a project"""
    try:
        update_data = {k: v for k, v in project_update.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        
        update_data["updatedAt"] = datetime.utcnow()
        
        result = await projects_collection.update_one(
            {"id": project_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        
        logger.info(f"Admin {admin_user} updated project {project_id}")
        return APIResponse(success=True, message="Project updated successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating project {project_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update project")

@router.delete("/projects/{project_id}", response_model=APIResponse)
async def delete_project_admin(project_id: str, admin_user: str = Depends(authenticate_admin)):
    """Soft delete a project"""
    try:
        result = await projects_collection.update_one(
            {"id": project_id},
            {"$set": {"isActive": False, "updatedAt": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        
        logger.info(f"Admin {admin_user} deleted project {project_id}")
        return APIResponse(success=True, message="Project deleted successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting project {project_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete project")

# Settings Management
@router.get("/settings")
async def get_all_settings_admin(admin_user: str = Depends(authenticate_admin)):
    """Get all settings for admin"""
    try:
        cursor = company_settings_collection.find()
        settings = await cursor.to_list(length=100)
        
        settings_dict = {}
        for setting in settings:
            if "_id" in setting:
                del setting["_id"]
            settings_dict[setting["settingKey"]] = setting
        
        return settings_dict
        
    except Exception as e:
        logger.error(f"Error retrieving admin settings: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve settings")

@router.put("/settings/{setting_key}", response_model=APIResponse)
async def update_setting_admin(setting_key: str, setting_update: CompanySettingUpdate, admin_user: str = Depends(authenticate_admin)):
    """Update a setting"""
    try:
        update_data = {k: v for k, v in setting_update.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        
        update_data["updatedAt"] = datetime.utcnow()
        
        result = await company_settings_collection.update_one(
            {"settingKey": setting_key},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            # Create new setting if it doesn't exist
            new_setting = CompanySetting(
                settingKey=setting_key,
                settingValue=setting_update.settingValue,
                isActive=True
            )
            await company_settings_collection.insert_one(new_setting.dict())
            logger.info(f"Admin {admin_user} created new setting {setting_key}")
        else:
            logger.info(f"Admin {admin_user} updated setting {setting_key}")
        
        return APIResponse(success=True, message="Setting updated successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating setting {setting_key}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update setting")

# Contact Inquiries Management
@router.get("/inquiries")
async def get_contact_inquiries_admin(skip: int = 0, limit: int = 50, admin_user: str = Depends(authenticate_admin)):
    """Get contact inquiries with pagination"""
    try:
        cursor = contact_inquiries_collection.find().sort("createdAt", -1).skip(skip).limit(limit)
        inquiries = await cursor.to_list(length=limit)
        
        for inquiry in inquiries:
            if "_id" in inquiry:
                del inquiry["_id"]
        
        total_count = await contact_inquiries_collection.count_documents({})
        
        return {
            "inquiries": inquiries,
            "total": total_count,
            "skip": skip,
            "limit": limit
        }
        
    except Exception as e:
        logger.error(f"Error retrieving admin inquiries: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve inquiries")

@router.put("/inquiries/{inquiry_id}/status", response_model=APIResponse)
async def update_inquiry_status_admin(inquiry_id: str, status_update: ContactInquiryUpdate, admin_user: str = Depends(authenticate_admin)):
    """Update inquiry status"""
    try:
        result = await contact_inquiries_collection.update_one(
            {"id": inquiry_id},
            {"$set": {"status": status_update.status, "updatedAt": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Inquiry not found")
        
        logger.info(f"Admin {admin_user} updated inquiry {inquiry_id} status to {status_update.status}")
        return APIResponse(success=True, message="Inquiry status updated successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating inquiry {inquiry_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update inquiry status")

# Button Configuration Management
@router.get("/buttons", response_model=List[ButtonConfig])
async def get_all_buttons_admin(admin_user: str = Depends(authenticate_admin)):
    """Get all button configurations"""
    try:
        cursor = button_configs_collection.find().sort("section", 1).sort("order", 1)
        buttons = await cursor.to_list(length=100)
        
        for button in buttons:
            if "_id" in button:
                del button["_id"]
        
        return buttons
        
    except Exception as e:
        logger.error(f"Error retrieving admin buttons: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve buttons")

@router.post("/buttons", response_model=APIResponse)
async def create_button_admin(button: ButtonConfigCreate, admin_user: str = Depends(authenticate_admin)):
    """Create a new button configuration"""
    try:
        button_obj = ButtonConfig(**button.dict())
        result = await button_configs_collection.insert_one(button_obj.dict())
        
        if result.inserted_id:
            logger.info(f"Admin {admin_user} created button: {button_obj.buttonId}")
            return APIResponse(
                success=True,
                message="Button created successfully",
                data={"id": button_obj.id}
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to create button")
            
    except Exception as e:
        logger.error(f"Error creating button: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create button")

@router.put("/buttons/{button_id}", response_model=APIResponse)
async def update_button_admin(button_id: str, button_update: ButtonConfigUpdate, admin_user: str = Depends(authenticate_admin)):
    """Update a button configuration"""
    try:
        update_data = {k: v for k, v in button_update.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        
        update_data["updatedAt"] = datetime.utcnow()
        
        result = await button_configs_collection.update_one(
            {"buttonId": button_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Button not found")
        
        logger.info(f"Admin {admin_user} updated button {button_id}")
        return APIResponse(success=True, message="Button updated successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating button {button_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update button")

@router.delete("/buttons/{button_id}", response_model=APIResponse)
async def delete_button_admin(button_id: str, admin_user: str = Depends(authenticate_admin)):
    """Delete a button configuration"""
    try:
        result = await button_configs_collection.delete_one({"buttonId": button_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Button not found")
        
        logger.info(f"Admin {admin_user} deleted button {button_id}")
        return APIResponse(success=True, message="Button deleted successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting button {button_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete button")


# News Management
@router.get("/news", response_model=List[NewsArticle])
async def get_all_news_admin(admin_user: str = Depends(authenticate_admin)):
    """Get all news articles including unpublished ones"""
    try:
        cursor = news_collection.find().sort("publishedAt", -1)
        articles = await cursor.to_list(length=100)
        
        for article in articles:
            if "_id" in article:
                del article["_id"]
        
        return articles
        
    except Exception as e:
        logger.error(f"Error retrieving admin news: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve news")

@router.post("/news", response_model=APIResponse)
async def create_news_admin(article: NewsArticleCreate, admin_user: str = Depends(authenticate_admin)):
    """Create a new news article"""
    try:
        article_obj = NewsArticle(**article.dict())
        result = await news_collection.insert_one(article_obj.dict())
        
        if result.inserted_id:
            logger.info(f"Admin {admin_user} created news: {article_obj.title}")
            return APIResponse(
                success=True,
                message="News article created successfully",
                data={"id": article_obj.id}
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to create article")
            
    except Exception as e:
        logger.error(f"Error creating news: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create article")

@router.put("/news/{article_id}", response_model=APIResponse)
async def update_news_admin(article_id: str, article_update: NewsArticleUpdate, admin_user: str = Depends(authenticate_admin)):
    """Update a news article"""
    try:
        update_data = {k: v for k, v in article_update.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        
        update_data["updatedAt"] = datetime.utcnow()
        
        result = await news_collection.update_one(
            {"id": article_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Article not found")
        
        logger.info(f"Admin {admin_user} updated news {article_id}")
        return APIResponse(success=True, message="Article updated successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating news {article_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update article")

@router.delete("/news/{article_id}", response_model=APIResponse)
async def delete_news_admin(article_id: str, admin_user: str = Depends(authenticate_admin)):
    """Delete a news article"""
    try:
        result = await news_collection.delete_one({"id": article_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Article not found")
        
        logger.info(f"Admin {admin_user} deleted news {article_id}")
        return APIResponse(success=True, message="Article deleted successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting news {article_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete article")