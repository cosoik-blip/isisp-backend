import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging

logger = logging.getLogger(__name__)

SMTP_SERVER = os.environ.get('SMTP_SERVER', 'mail.3ts.gr')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_EMAIL = os.environ.get('SMTP_EMAIL', 'info@3ts.gr')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')

async def send_contact_email(name: str, email: str, organization: str, subject: str, message: str) -> bool:
    """Send contact form submission to info@3ts.gr"""
    
    if not SMTP_PASSWORD:
        logger.error("SMTP_PASSWORD not configured")
        return False
    
    try:
        # Create email message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"[3TS Website] {subject}"
        msg['From'] = SMTP_EMAIL
        msg['To'] = SMTP_EMAIL
        msg['Reply-To'] = email
        
        # Plain text version
        text_content = f"""
New Contact Form Submission from 3TS Website
============================================

Name: {name}
Email: {email}
Organization: {organization or 'Not provided'}
Subject: {subject}

Message:
{message}

---
This email was sent from the Three Thirds Society website contact form.
"""
        
        # HTML version
        html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #10b981, #14b8a6); color: white; padding: 20px; border-radius: 8px 8px 0 0; }}
        .content {{ background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }}
        .field {{ margin-bottom: 15px; }}
        .label {{ font-weight: bold; color: #059669; }}
        .message-box {{ background: white; padding: 15px; border-left: 4px solid #10b981; margin-top: 10px; }}
        .footer {{ margin-top: 20px; font-size: 12px; color: #6b7280; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0;">New Contact Form Submission</h2>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Three Thirds Society Website</p>
        </div>
        <div class="content">
            <div class="field">
                <span class="label">Name:</span> {name}
            </div>
            <div class="field">
                <span class="label">Email:</span> <a href="mailto:{email}">{email}</a>
            </div>
            <div class="field">
                <span class="label">Organization:</span> {organization or 'Not provided'}
            </div>
            <div class="field">
                <span class="label">Subject:</span> {subject}
            </div>
            <div class="field">
                <span class="label">Message:</span>
                <div class="message-box">
                    {message.replace(chr(10), '<br>')}
                </div>
            </div>
            <div class="footer">
                <p>This email was sent from the Three Thirds Society website contact form.</p>
                <p>You can reply directly to this email to respond to {name}.</p>
            </div>
        </div>
    </div>
</body>
</html>
"""
        
        # Attach both versions
        msg.attach(MIMEText(text_content, 'plain'))
        msg.attach(MIMEText(html_content, 'html'))
        
        # Send email
        await aiosmtplib.send(
            msg,
            hostname=SMTP_SERVER,
            port=SMTP_PORT,
            username=SMTP_EMAIL,
            password=SMTP_PASSWORD,
            start_tls=True
        )
        
        logger.info(f"Contact email sent successfully from {email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send contact email: {str(e)}")
        return False
