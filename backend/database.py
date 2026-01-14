from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
import os
from dotenv import load_dotenv
from pathlib import Path
import logging
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logger = logging.getLogger(__name__)

# MongoDB connection settings optimized for Atlas
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'test_database')

# Create client with Atlas-compatible settings
client = AsyncIOMotorClient(
    mongo_url,
    serverSelectionTimeoutMS=30000,
    connectTimeoutMS=30000,
    socketTimeoutMS=30000,
    retryWrites=True,
    retryReads=True,
    maxPoolSize=10,
    minPoolSize=1
)

db = client[db_name]

# Collections
services_collection = db.services
projects_collection = db.projects
contact_inquiries_collection = db.contact_inquiries
company_settings_collection = db.company_settings
team_members_collection = db.team_members
button_configs_collection = db.button_configs
news_collection = db.news
uploaded_files_collection = db.uploaded_files

# GridFS for storing larger files
fs_bucket = AsyncIOMotorGridFSBucket(db)

async def init_database():
    """Initialize database with indexes and default data"""
    max_retries = 3
    retry_delay = 2
    
    for attempt in range(max_retries):
        try:
            # Test connection first
            await client.admin.command('ping')
            logger.info("MongoDB connection successful")
            
            # Create indexes with background=True for non-blocking
            await services_collection.create_index("order", background=True)
            await services_collection.create_index("isActive", background=True)
            
            await projects_collection.create_index("order", background=True)
            await projects_collection.create_index("isActive", background=True)
            
            await contact_inquiries_collection.create_index("createdAt", background=True)
            await contact_inquiries_collection.create_index("status", background=True)
            
            await company_settings_collection.create_index("settingKey", unique=True, background=True)
            
            await team_members_collection.create_index("order", background=True)
            await team_members_collection.create_index("isActive", background=True)
            
            await button_configs_collection.create_index("buttonId", unique=True, background=True)
            await button_configs_collection.create_index("section", background=True)
            
            await news_collection.create_index("publishedAt", background=True)
            await news_collection.create_index("isPublished", background=True)
            await news_collection.create_index("category", background=True)
            
            print("Database initialized with indexes")
            logger.info("Database initialized with indexes")
            return
            
        except Exception as e:
            logger.warning(f"Database init attempt {attempt + 1}/{max_retries} failed: {str(e)}")
            if attempt < max_retries - 1:
                await asyncio.sleep(retry_delay)
                retry_delay *= 2
            else:
                logger.error(f"Failed to initialize database after {max_retries} attempts: {str(e)}")
                # Don't raise - allow app to start, indexes can be created later
                print(f"Warning: Database initialization incomplete, will retry on first request")

async def seed_initial_data():
    """Seed database with initial data from mock.js"""
    
    try:
        # Check if data already exists
        services_count = await services_collection.count_documents({})
        if services_count > 0:
            print("Database already seeded, skipping...")
            return
        
        # Services data
        services_data = [
            {
                "id": "1",
                "title": "Social Enterprise Development",
                "description": "Comprehensive support for creating and scaling social enterprises that address community needs while generating sustainable income.",
                "icon": "Building2",
                "features": ["Business Plan Development", "Market Analysis", "Funding Support", "Mentorship Programs"],
                "isActive": True,
                "order": 1
            },
            {
                "id": "2",
                "title": "Training & Capacity Building",
                "description": "Professional workshops and training programs designed to empower vulnerable groups with essential skills and knowledge.",
                "icon": "GraduationCap",
                "features": ["Skills Development", "Leadership Training", "Digital Literacy", "Entrepreneurship Education"],
                "isActive": True,
                "order": 2
            },
            {
                "id": "3",
                "title": "Research & Innovation",
                "description": "Cutting-edge research and innovative solutions to tackle social challenges and promote inclusive economic growth.",
                "icon": "Lightbulb",
                "features": ["Social Impact Research", "Policy Development", "Innovation Labs", "Data Analytics"],
                "isActive": True,
                "order": 3
            },
            {
                "id": "4",
                "title": "Project Management",
                "description": "End-to-end project planning, implementation, and evaluation services for social impact initiatives and EU-funded programs.",
                "icon": "Settings",
                "features": ["EU Project Management", "Impact Assessment", "Strategic Planning", "Quality Assurance"],
                "isActive": True,
                "order": 4
            },
            {
                "id": "5",
                "title": "Advisory Services",
                "description": "Expert consultation and strategic guidance for organizations seeking to maximize their social impact and operational efficiency.",
                "icon": "Users",
                "features": ["Organizational Development", "Strategic Consulting", "Impact Measurement", "Sustainability Planning"],
                "isActive": True,
                "order": 5
            },
            {
                "id": "6",
                "title": "Networking & Partnerships",
                "description": "Building bridges between stakeholders to create collaborative ecosystems that amplify social impact across communities.",
                "icon": "Network",
                "features": ["Stakeholder Engagement", "Partnership Development", "Community Building", "Knowledge Exchange"],
                "isActive": True,
                "order": 6
            }
        ]
        
        # Projects data
        projects_data = [
            {
                "id": "1",
                "title": "Epirus Social Hub",
                "description": "A comprehensive initiative to stimulate and support social enterprises in the Epirus region, fostering economic and social recovery.",
                "impact": "25+ social enterprises launched",
                "region": "Epirus",
                "year": "2023-2024",
                "category": "Regional Development",
                "image": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop",
                "isActive": True,
                "order": 1
            },
            {
                "id": "2",
                "title": "Digital Convergence Initiative",
                "description": "Bridging the digital divide by providing technology access and digital literacy training to vulnerable communities.",
                "impact": "1,200+ people trained in digital skills",
                "region": "Attica",
                "year": "2023",
                "category": "Digital Inclusion",
                "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
                "isActive": True,
                "order": 2
            },
            {
                "id": "3",
                "title": "Women's Economic Empowerment",
                "description": "Supporting women's organizations and female entrepreneurs through targeted training and funding opportunities.",
                "impact": "150+ women entrepreneurs supported",
                "region": "Peloponnese",
                "year": "2022-2023",
                "category": "Gender Equality",
                "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop",
                "isActive": True,
                "order": 3
            },
            {
                "id": "4",
                "title": "Youth Social Innovation Lab",
                "description": "Empowering young people to develop innovative solutions for social challenges in their communities.",
                "impact": "50+ youth-led projects launched",
                "region": "Thessaly",
                "year": "2023",
                "category": "Youth Development",
                "image": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
                "isActive": True,
                "order": 4
            }
        ]
        
        # Company settings
        settings_data = [
            {
                "settingKey": "hero_stats",
                "settingValue": {
                    "stats": [
                        {"number": "500+", "label": "Social Enterprises Supported"},
                        {"number": "50+", "label": "Training Programs Delivered"},
                        {"number": "15", "label": "Regions Covered"},
                        {"number": "10K+", "label": "Lives Impacted"}
                    ]
                },
                "isActive": True
            },
            {
                "settingKey": "contact_info",
                "settingValue": {
                    "address": "Pellis 2, Nea Filadelfia, Marousi, Attiki, Greece",
                    "phone": "+30 211 7057627",
                    "email": "info@3ts.gr",
                    "workingHours": "Monday - Friday: 9:00 AM - 6:00 PM"
                },
                "isActive": True
            },
            {
                "settingKey": "company_info",
                "settingValue": {
                    "name": "Three Thirds Society",
                    "shortName": "3TS",
                    "tagline": "Social Economy & Innovation",
                    "description": "We are a leading social economy organization dedicated to improving the quality of life for disadvantaged and vulnerable social groups through innovative solutions, training, and sustainable development programs."
                },
                "isActive": True
            }
        ]
        
        # Button configurations
        button_configs_data = [
            {
                "buttonId": "hero_cta_primary",
                "section": "hero",
                "label": "Explore Our Impact",
                "isVisible": True,
                "clickAction": "show_message",
                "clickMessage": "Thank you for your interest! We are making a real difference in communities across Greece. Contact us to learn more about how we can work together.",
                "buttonStyle": "primary",
                "order": 1
            },
            {
                "buttonId": "hero_cta_secondary",
                "section": "hero",
                "label": "Watch Our Story",
                "isVisible": True,
                "clickAction": "show_message",
                "clickMessage": "Our story video is coming soon! In the meantime, explore our projects and services to see the impact we're creating.",
                "buttonStyle": "outline",
                "order": 2
            },
            {
                "buttonId": "services_cta_primary",
                "section": "services",
                "label": "Schedule Consultation",
                "isVisible": True,
                "clickAction": "redirect",
                "redirectUrl": "#contact",
                "buttonStyle": "primary",
                "order": 1
            },
            {
                "buttonId": "services_cta_secondary",
                "section": "services",
                "label": "Contact Us Today",
                "isVisible": True,
                "clickAction": "redirect",
                "redirectUrl": "#contact",
                "buttonStyle": "outline",
                "order": 2
            },
            {
                "buttonId": "projects_cta_primary",
                "section": "projects",
                "label": "Propose a Project",
                "isVisible": True,
                "clickAction": "redirect",
                "redirectUrl": "#contact",
                "buttonStyle": "primary",
                "order": 1
            },
            {
                "buttonId": "projects_cta_secondary",
                "section": "projects",
                "label": "View All Projects",
                "isVisible": True,
                "clickAction": "show_message",
                "clickMessage": "We're working on a dedicated projects gallery. Contact us to learn more about our current and upcoming initiatives!",
                "buttonStyle": "outline",
                "order": 2
            }
        ]
        
        # Insert data
        await services_collection.insert_many(services_data)
        await projects_collection.insert_many(projects_data)
        await company_settings_collection.insert_many(settings_data)
        await button_configs_collection.insert_many(button_configs_data)
        
        print("Database seeded with initial data including button configurations")
        logger.info("Database seeded with initial data")
        
    except Exception as e:
        logger.warning(f"Seeding skipped or failed: {str(e)}")
        print(f"Warning: Database seeding incomplete: {str(e)}")

async def close_database():
    """Close database connection"""
    client.close()
