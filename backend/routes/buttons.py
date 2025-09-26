from fastapi import APIRouter, HTTPException
from typing import List
from models import ButtonConfig, ButtonConfigCreate, ButtonConfigUpdate, APIResponse
from database import button_configs_collection
from datetime import datetime
import logging

router = APIRouter(prefix="/api/buttons", tags=["buttons"])
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[ButtonConfig])
async def get_all_buttons():
    """Get all button configurations"""
    try:
        cursor = button_configs_collection.find().sort("section", 1).sort("order", 1)
        buttons = await cursor.to_list(length=100)
        
        # Convert ObjectId to string for JSON serialization
        for button in buttons:
            if "_id" in button:
                del button["_id"]
        
        logger.info(f"Retrieved {len(buttons)} button configurations")
        return buttons
        
    except Exception as e:
        logger.error(f"Error retrieving button configurations: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve button configurations")

@router.get("/section/{section}")
async def get_buttons_by_section(section: str):
    """Get button configurations for a specific section"""
    try:
        cursor = button_configs_collection.find({"section": section}).sort("order", 1)
        buttons = await cursor.to_list(length=50)
        
        # Convert ObjectId to string for JSON serialization
        for button in buttons:
            if "_id" in button:
                del button["_id"]
        
        logger.info(f"Retrieved {len(buttons)} buttons for section {section}")
        return buttons
        
    except Exception as e:
        logger.error(f"Error retrieving buttons for section {section}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve buttons")

@router.get("/{button_id}", response_model=ButtonConfig)
async def get_button_config(button_id: str):
    """Get a specific button configuration"""
    try:
        button = await button_configs_collection.find_one({"buttonId": button_id})
        
        if not button:
            # Return default configuration if not found
            return {
                "id": "default",
                "buttonId": button_id,
                "section": "unknown",
                "label": "Button",
                "isVisible": True,
                "clickAction": "none",
                "buttonStyle": "primary",
                "order": 0
            }
        
        if "_id" in button:
            del button["_id"]
            
        return button
        
    except Exception as e:
        logger.error(f"Error retrieving button {button_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve button configuration")