from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

# Database Models
class Service(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    icon: str
    features: List[str]
    isActive: bool = True
    order: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class ServiceCreate(BaseModel):
    title: str
    description: str
    icon: str
    features: List[str]
    order: int = 0

class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    features: Optional[List[str]] = None
    isActive: Optional[bool] = None
    order: Optional[int] = None

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    impact: str
    region: str
    year: str
    category: str
    image: str
    isActive: bool = True
    order: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class ProjectCreate(BaseModel):
    title: str
    description: str
    impact: str
    region: str
    year: str
    category: str
    image: str
    order: int = 0

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    impact: Optional[str] = None
    region: Optional[str] = None
    year: Optional[str] = None
    category: Optional[str] = None
    image: Optional[str] = None
    isActive: Optional[bool] = None
    order: Optional[int] = None

class ContactInquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    organization: Optional[str] = None
    subject: str
    message: str
    status: str = "new"  # 'new', 'read', 'responded', 'closed'
    ipAddress: Optional[str] = None
    userAgent: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class ContactInquiryCreate(BaseModel):
    name: str
    email: EmailStr
    organization: Optional[str] = None
    subject: str
    message: str

class ContactInquiryUpdate(BaseModel):
    status: Optional[str] = None

class CompanySetting(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    settingKey: str
    settingValue: Dict[str, Any]
    isActive: bool = True
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class CompanySettingCreate(BaseModel):
    settingKey: str
    settingValue: Dict[str, Any]

class CompanySettingUpdate(BaseModel):
    settingValue: Optional[Dict[str, Any]] = None
    isActive: Optional[bool] = None

class TeamMember(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    expertise: str
    experience: str
    image: str
    isActive: bool = True
    order: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class TeamMemberCreate(BaseModel):
    name: str
    role: str
    expertise: str
    experience: str
    image: str
    order: int = 0

class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    expertise: Optional[str] = None
    experience: Optional[str] = None
    image: Optional[str] = None
    isActive: Optional[bool] = None
    order: Optional[int] = None

# New Button Configuration Models
class ButtonConfig(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    buttonId: str  # Unique identifier for the button (e.g., 'hero_cta_primary')
    section: str   # Which section it belongs to (e.g., 'hero', 'services', 'projects')
    label: str     # Button text
    isVisible: bool = True
    clickAction: str = "none"  # 'none', 'show_message', 'redirect', 'download'
    clickMessage: Optional[str] = None  # Message to show on click
    redirectUrl: Optional[str] = None   # URL for redirect action
    buttonStyle: str = "primary"  # 'primary', 'secondary', 'outline'
    order: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class ButtonConfigCreate(BaseModel):
    buttonId: str
    section: str
    label: str
    isVisible: bool = True
    clickAction: str = "none"
    clickMessage: Optional[str] = None
    redirectUrl: Optional[str] = None
    buttonStyle: str = "primary"
    order: int = 0

class ButtonConfigUpdate(BaseModel):
    label: Optional[str] = None
    isVisible: Optional[bool] = None
    clickAction: Optional[str] = None
    clickMessage: Optional[str] = None
    redirectUrl: Optional[str] = None
    buttonStyle: Optional[str] = None
    order: Optional[int] = None

# Response Models
class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None

class ContactResponse(APIResponse):
    pass