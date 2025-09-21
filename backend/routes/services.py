from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models import Service, ServiceCreate, ServiceUpdate, APIResponse
from database import services_collection
from datetime import datetime
import logging

router = APIRouter(prefix="/api/services", tags=["services"])
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[Service])
async def get_services():
    """Get all active services ordered by order field"""
    try:
        cursor = services_collection.find({"isActive": True}).sort("order", 1)
        services = await cursor.to_list(length=100)
        
        # Convert ObjectId to string for JSON serialization
        for service in services:
            if "_id" in service:
                del service["_id"]
        
        logger.info(f"Retrieved {len(services)} services")
        return services
        
    except Exception as e:
        logger.error(f"Error retrieving services: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve services")

@router.get("/{service_id}", response_model=Service)
async def get_service(service_id: str):
    """Get a specific service by ID"""
    try:
        service = await services_collection.find_one({"id": service_id, "isActive": True})
        
        if not service:
            raise HTTPException(status_code=404, detail="Service not found")
        
        if "_id" in service:
            del service["_id"]
            
        return service
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving service {service_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve service")

@router.post("/", response_model=APIResponse)
async def create_service(service: ServiceCreate):
    """Create a new service (Admin only - future implementation)"""
    try:
        service_dict = service.dict()
        service_obj = Service(**service_dict)
        
        result = await services_collection.insert_one(service_obj.dict())
        
        if result.inserted_id:
            logger.info(f"Created new service: {service_obj.title}")
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

@router.put("/{service_id}", response_model=APIResponse)
async def update_service(service_id: str, service_update: ServiceUpdate):
    """Update a service (Admin only - future implementation)"""
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
        
        logger.info(f"Updated service {service_id}")
        return APIResponse(success=True, message="Service updated successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating service {service_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update service")

@router.delete("/{service_id}", response_model=APIResponse)
async def delete_service(service_id: str):
    """Soft delete a service (Admin only - future implementation)"""
    try:
        result = await services_collection.update_one(
            {"id": service_id},
            {"$set": {"isActive": False, "updatedAt": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Service not found")
        
        logger.info(f"Deleted service {service_id}")
        return APIResponse(success=True, message="Service deleted successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting service {service_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete service")