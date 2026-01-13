from fastapi import APIRouter, HTTPException, Request
from models import ContactInquiry, ContactInquiryCreate, ContactResponse
from database import contact_inquiries_collection
from email_service import send_contact_email
import logging
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/contact", tags=["contact"])
logger = logging.getLogger(__name__)

@router.post("/", response_model=ContactResponse)
async def submit_contact_inquiry(inquiry: ContactInquiryCreate, request: Request):
    """Handle contact form submissions"""
    try:
        # Create inquiry object with additional metadata
        inquiry_dict = inquiry.dict()
        inquiry_dict["ipAddress"] = request.client.host if request.client else None
        inquiry_dict["userAgent"] = request.headers.get("user-agent", "")
        
        contact_inquiry = ContactInquiry(**inquiry_dict)
        
        # Save to database
        result = await contact_inquiries_collection.insert_one(contact_inquiry.dict())
        
        if not result.inserted_id:
            raise HTTPException(status_code=500, detail="Failed to save inquiry")
        
        # Send email notification to info@3ts.gr
        try:
            email_sent = await send_contact_email(
                name=contact_inquiry.name,
                email=contact_inquiry.email,
                organization=contact_inquiry.organization or "",
                subject=contact_inquiry.subject,
                message=contact_inquiry.message
            )
            if email_sent:
                logger.info(f"Contact email sent to info@3ts.gr from {contact_inquiry.email}")
            else:
                logger.warning(f"Failed to send contact email for inquiry from {contact_inquiry.email}")
        except Exception as e:
            # Don't fail the request if email fails
            logger.error(f"Email sending failed: {str(e)}")
        
        logger.info(f"Contact inquiry submitted by {inquiry.email}")
        
        return ContactResponse(
            success=True,
            message="Thank you for your message! We will get back to you within 24-48 hours.",
            data={"inquiryId": contact_inquiry.id}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing contact inquiry: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process your inquiry. Please try again.")

@router.get("/inquiries", response_model=list)
async def get_contact_inquiries(skip: int = 0, limit: int = 50):
    """Get all contact inquiries (Admin only)"""
    try:
        cursor = contact_inquiries_collection.find().sort("createdAt", -1).skip(skip).limit(limit)
        inquiries = await cursor.to_list(length=limit)
        
        # Convert ObjectId to string for JSON serialization
        for inquiry in inquiries:
            if "_id" in inquiry:
                del inquiry["_id"]
        
        logger.info(f"Retrieved {len(inquiries)} contact inquiries")
        return inquiries
        
    except Exception as e:
        logger.error(f"Error retrieving contact inquiries: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve inquiries")

@router.get("/inquiries/stats")
async def get_inquiry_stats():
    """Get contact inquiry statistics (Admin only)"""
    try:
        total_count = await contact_inquiries_collection.count_documents({})
        new_count = await contact_inquiries_collection.count_documents({"status": "new"})
        read_count = await contact_inquiries_collection.count_documents({"status": "read"})
        responded_count = await contact_inquiries_collection.count_documents({"status": "responded"})
        closed_count = await contact_inquiries_collection.count_documents({"status": "closed"})
        
        # Get recent inquiries (last 7 days)
        recent_date = datetime.utcnow() - timedelta(days=7)
        recent_count = await contact_inquiries_collection.count_documents({
            "createdAt": {"$gte": recent_date}
        })
        
        stats = {
            "total": total_count,
            "new": new_count,
            "read": read_count,
            "responded": responded_count,
            "closed": closed_count,
            "recent_week": recent_count
        }
        
        logger.info("Retrieved contact inquiry statistics")
        return stats
        
    except Exception as e:
        logger.error(f"Error retrieving inquiry stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve statistics")
