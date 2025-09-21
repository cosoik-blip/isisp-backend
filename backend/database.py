from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
services_collection = db.services
projects_collection = db.projects
contact_inquiries_collection = db.contact_inquiries
company_settings_collection = db.company_settings
team_members_collection = db.team_members

async def init_database():
    """Initialize database with indexes and default data"""
    
    # Create indexes
    await services_collection.create_index("order")
    await services_collection.create_index("isActive")
    
    await projects_collection.create_index("order")
    await projects_collection.create_index("isActive")
    
    await contact_inquiries_collection.create_index("createdAt")
    await contact_inquiries_collection.create_index("status")
    
    await company_settings_collection.create_index("settingKey", unique=True)
    
    await team_members_collection.create_index("order")
    await team_members_collection.create_index("isActive")
    
    print("Database initialized with indexes")

async def seed_initial_data():
    """Seed database with initial data from mock.js"""
    
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
    
    # Insert data
    await services_collection.insert_many(services_data)
    await projects_collection.insert_many(projects_data)
    await company_settings_collection.insert_many(settings_data)
    
    print("Database seeded with initial data")

async def close_database():
    """Close database connection"""
    client.close()