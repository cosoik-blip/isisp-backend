from fastapi import APIRouter, HTTPException
from typing import List
from models import Project, ProjectCreate, ProjectUpdate, APIResponse
from database import projects_collection, button_configs_collection
from datetime import datetime
import logging

router = APIRouter(prefix="/api/projects", tags=["projects"])
logger = logging.getLogger(__name__)

async def create_project_button(project_id: str, project_title: str):
    """Create a Learn More button config for a new project"""
    try:
        button_id = f"project_learn_more_{project_id}"
        
        # Check if button already exists
        existing = await button_configs_collection.find_one({"buttonId": button_id})
        if existing:
            return
        
        button_config = {
            "buttonId": button_id,
            "section": "projects",
            "label": "Learn More",
            "isVisible": True,
            "clickAction": "show_message",
            "clickMessage": f"""{project_title}

Click 'Edit' in the Buttons section of the dashboard to add detailed information about this project.

You can customize:
• Project overview and objectives
• Key achievements and impact
• Partners and stakeholders
• Timeline and milestones""",
            "buttonStyle": "outline",
            "order": 1,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        await button_configs_collection.insert_one(button_config)
        logger.info(f"Created Learn More button for project: {project_title}")
        
    except Exception as e:
        logger.error(f"Error creating button for project {project_id}: {str(e)}")

@router.get("/", response_model=List[Project])
async def get_projects():
    """Get all active projects ordered by order field"""
    try:
        cursor = projects_collection.find({"isActive": True}).sort("order", 1)
        projects = await cursor.to_list(length=100)
        
        # Convert ObjectId to string for JSON serialization
        for project in projects:
            if "_id" in project:
                del project["_id"]
        
        logger.info(f"Retrieved {len(projects)} projects")
        return projects
        
    except Exception as e:
        logger.error(f"Error retrieving projects: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve projects")

@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: str):
    """Get a specific project by ID"""
    try:
        project = await projects_collection.find_one({"id": project_id, "isActive": True})
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        if "_id" in project:
            del project["_id"]
            
        return project
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving project {project_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve project")

@router.post("/", response_model=APIResponse)
async def create_project(project: ProjectCreate):
    """Create a new project (Admin only - future implementation)"""
    try:
        project_dict = project.dict()
        project_obj = Project(**project_dict)
        
        result = await projects_collection.insert_one(project_obj.dict())
        
        if result.inserted_id:
            logger.info(f"Created new project: {project_obj.title}")
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

@router.put("/{project_id}", response_model=APIResponse)
async def update_project(project_id: str, project_update: ProjectUpdate):
    """Update a project (Admin only - future implementation)"""
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
        
        logger.info(f"Updated project {project_id}")
        return APIResponse(success=True, message="Project updated successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating project {project_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update project")

@router.delete("/{project_id}", response_model=APIResponse)
async def delete_project(project_id: str):
    """Soft delete a project (Admin only - future implementation)"""
    try:
        result = await projects_collection.update_one(
            {"id": project_id},
            {"$set": {"isActive": False, "updatedAt": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        
        logger.info(f"Deleted project {project_id}")
        return APIResponse(success=True, message="Project deleted successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting project {project_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete project")