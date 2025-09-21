from fastapi import APIRouter, HTTPException, Request
from models import ContactInquiry, ContactInquiryCreate, ContactResponse
from database import contact_inquiries_collection
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime

router = APIRouter(prefix="/api/contact", tags=["contact"])
logger = logging.getLogger(__name__)

async def send_notification_email(inquiry: ContactInquiry):
    """Send email notification to admin about new contact inquiry"""
    try:
        # Email configuration (to be set in environment variables)
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_username = os.getenv("SMTP_USERNAME", "")
        smtp_password = os.getenv("SMTP_PASSWORD", "")
        admin_email = os.getenv("ADMIN_EMAIL", "info@3ts.gr")
        
        if not smtp_username or not smtp_password:
            logger.warning("Email credentials not configured, skipping email notification")
            return
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = smtp_username
        msg['To'] = admin_email
        msg['Subject'] = f"New Contact Inquiry: {inquiry.subject}"
        
        # Email body
        body = f"""
        New contact inquiry received:
        
        Name: {inquiry.name}
        Email: {inquiry.email}
        Organization: {inquiry.organization or 'Not specified'}
        Subject: {inquiry.subject}
        
        Message:
        {inquiry.message}
        
        Received at: {inquiry.createdAt}
        IP Address: {inquiry.ipAddress or 'Unknown'}
        
        ---
        Three Thirds Society Contact System
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        text = msg.as_string()
        server.sendmail(smtp_username, admin_email, text)
        server.quit()
        
        logger.info(f"Notification email sent for inquiry {inquiry.id}")
        
    except Exception as e:
        logger.error(f"Failed to send notification email: {str(e)}")

async def send_auto_response_email(inquiry: ContactInquiry):
    """Send auto-response email to the person who submitted the inquiry"""
    try:
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_username = os.getenv("SMTP_USERNAME", "")
        smtp_password = os.getenv("SMTP_PASSWORD", "")
        
        if not smtp_username or not smtp_password:
            logger.warning("Email credentials not configured, skipping auto-response")
            return
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = smtp_username
        msg['To'] = inquiry.email
        msg['Subject'] = "Thank you for contacting Three Thirds Society"
        
        # Email body
        body = f"""
        Dear {inquiry.name},
        
        Thank you for reaching out to Three Thirds Society. We have received your inquiry about "{inquiry.subject}" and appreciate your interest in our work.
        
        Our team will review your message and get back to you within 24-48 hours. In the meantime, feel free to explore our website to learn more about our projects and services.
        
        If you have any urgent matters, please don't hesitate to call us at +30 211 7057627.
        
        Best regards,
        The Three Thirds Society Team
        
        ---
        Three Thirds Society
        Social Economy & Innovation
        Pellis 2, Nea Filadelfia, Marousi, Attiki, Greece
        Phone: +30 211 7057627
        Email: info@3ts.gr
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        text = msg.as_string()
        server.sendmail(smtp_username, inquiry.email, text)
        server.quit()
        
        logger.info(f"Auto-response email sent to {inquiry.email}")
        
    except Exception as e:
        logger.error(f"Failed to send auto-response email: {str(e)}")

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
        
        # Send notification emails (async in background)
        try:
            await send_notification_email(contact_inquiry)
            await send_auto_response_email(contact_inquiry)
        except Exception as e:
            # Don't fail the request if emails fail
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
    """Get all contact inquiries (Admin only - future implementation)"""
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
    """Get contact inquiry statistics (Admin only - future implementation)"""
    try:
        total_count = await contact_inquiries_collection.count_documents({})
        new_count = await contact_inquiries_collection.count_documents({"status": "new"})
        read_count = await contact_inquiries_collection.count_documents({"status": "read"})
        responded_count = await contact_inquiries_collection.count_documents({"status": "responded"})
        closed_count = await contact_inquiries_collection.count_documents({"status": "closed"})
        
        # Get recent inquiries (last 7 days)
        from datetime import timedelta
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