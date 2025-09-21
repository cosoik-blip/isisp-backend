from fastapi import APIRouter, HTTPException
from models import CompanySetting, CompanySettingCreate, CompanySettingUpdate, APIResponse
from database import company_settings_collection
from datetime import datetime
import logging

router = APIRouter(prefix="/api/settings", tags=["settings"])
logger = logging.getLogger(__name__)

@router.get("/{setting_key}")
async def get_setting(setting_key: str):
    """Get a specific setting by key"""
    try:
        setting = await company_settings_collection.find_one({
            "settingKey": setting_key,
            "isActive": True
        })
        
        if not setting:
            raise HTTPException(status_code=404, detail=f"Setting '{setting_key}' not found")
        
        if "_id" in setting:
            del setting["_id"]
            
        # Return just the setting value for easier frontend consumption
        return setting["settingValue"]
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving setting {setting_key}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve setting")

@router.get("/")
async def get_all_settings():
    """Get all active settings"""
    try:
        cursor = company_settings_collection.find({"isActive": True})
        settings = await cursor.to_list(length=100)
        
        # Convert to key-value pairs for easier frontend consumption
        settings_dict = {}
        for setting in settings:
            if "_id" in setting:
                del setting["_id"]
            settings_dict[setting["settingKey"]] = setting["settingValue"]
        
        logger.info(f"Retrieved {len(settings)} settings")
        return settings_dict
        
    except Exception as e:
        logger.error(f"Error retrieving settings: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve settings")

@router.post("/", response_model=APIResponse)
async def create_setting(setting: CompanySettingCreate):
    """Create a new setting (Admin only - future implementation)"""
    try:
        # Check if setting already exists
        existing = await company_settings_collection.find_one({"settingKey": setting.settingKey})
        if existing:
            raise HTTPException(status_code=400, detail="Setting already exists")
        
        setting_obj = CompanySetting(**setting.dict())
        result = await company_settings_collection.insert_one(setting_obj.dict())
        
        if result.inserted_id:
            logger.info(f"Created new setting: {setting.settingKey}")
            return APIResponse(
                success=True,
                message="Setting created successfully",
                data={"id": setting_obj.id}
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to create setting")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating setting: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create setting")

@router.put("/{setting_key}", response_model=APIResponse)
async def update_setting(setting_key: str, setting_update: CompanySettingUpdate):
    """Update a setting (Admin only - future implementation)"""
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
            raise HTTPException(status_code=404, detail="Setting not found")
        
        logger.info(f"Updated setting {setting_key}")
        return APIResponse(success=True, message="Setting updated successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating setting {setting_key}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update setting")