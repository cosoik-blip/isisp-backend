"""
Custom content migration for Three Thirds Society website.
This ensures all button configurations, services, and content are present in the database.
"""

from database import button_configs_collection, company_settings_collection, services_collection, projects_collection
from datetime import datetime
import logging
import uuid

logger = logging.getLogger(__name__)

# Projects data - ensure all projects exist
PROJECTS_DATA = [
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

# Services data - ensure all services exist
SERVICES_DATA = [
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
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Social Economy Workshops & Conferences",
        "description": "THREE THIRDS SOCIETY designs and organizes Social Economy workshops and conferences that empower civil society actors, support policy dialogue, and strengthen regional development. Through participatory formats and multi-stakeholder engagement, our events foster knowledge exchange, capacity building, and collaborative solutions for inclusive and sustainable local economies.",
        "icon": "Calendar",
        "features": ["Interactive Workshops", "Thematic Panels", "Peer Learning", "Policy Dialogues"],
        "isActive": True,
        "order": 0
    }
]

CUSTOM_BUTTON_CONFIGS = [
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
        "clickMessage": """THREE THIRDS SOCIETY (3TS) is a Greek non-profit social enabling organization dedicated to strengthening the Social Economy and empowering civil society actors. Founded in 2010, the organization advances inclusive and sustainable development by supporting social enterprises, cooperatives, CSOs and vulnerable groups, while actively contributing to policy dialogue and institutional reforms at regional and national levels.

Our mission is to promote the social economy and social entrepreneurship ecosystem in Greece and Europe by empowering civil society actors, influencing policy, and enabling inclusive, sustainable socioeconomic development.

Our main offices are in Athens, but we have also branched in two other Greek Regions (Region of Epirus & Region of Western Greece) working mainly with social issues and socially vulnerable groups through our two Social Hubs (providing capacity building services to social economy organizations and vulnerable social groups). THREE THIRDS SOCIETY collaborates with other non-governmental organizations (NGOs), Municipalities, and Greek Regions to implement projects (local, national, regional, and cross-border) involving vocational training, seminars, workshops, consultations, mentoring and capacity building.

At THREE THIRDS SOCIETY (3TS) we believe that resilient communities are built through collaboration, empowerment and inclusive public policy. Since 2010 we have supported social enterprises, cooperatives and civil society actors through advocacy, capacity building, incubation and community-driven innovation.

Working closely with municipalities, regional authorities, universities and European partners, we combine on-the-ground delivery with policy engagement to scale sustainable solutions for vulnerable groups, youth and local economies.

We remain committed to shaping an enabling institutional environment for the Social Economy in Greece and across Europe.""",
        "buttonStyle": "outline",
        "order": 2
    },
    {
        "buttonId": "services_cta_primary",
        "section": "services",
        "label": "Schedule Consultation",
        "isVisible": True,
        "clickAction": "redirect",
        "redirectUrl": "#contact?action=consultation",
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
        "label": "Why we are a Relevant Partner",
        "isVisible": True,
        "clickAction": "show_message",
        "clickMessage": """• Proven experience in strengthening the social entrepreneurship ecosystem through hubs, mentoring, and incubation

• Practical experience in project management for Interreg, Erasmus+, CERV, AMIF and national funds

• Expertise in designing methodologies, policy tools, and capacity-building curricula

• Leading role in promoting social economy within civil society in Greece (conference, training programmes, regional hubs)

• Strong networks with municipalities, regions, universities, NGOs and EU partners""",
        "buttonStyle": "outline",
        "order": 2
    },
    {
        "buttonId": "service_learn_more_1",
        "section": "services",
        "label": "Learn More",
        "isVisible": True,
        "clickAction": "show_message",
        "clickMessage": """Social Enterprise Development

THREE THIRDS SOCIETY provides comprehensive support for the creation, development, and scaling of social enterprises that address community needs while generating sustainable economic value. Our approach combines entrepreneurial expertise, social impact orientation, and deep knowledge of the social economy ecosystem.

We support emerging and established social enterprises, cooperatives, and collective initiatives throughout all stages of development—from idea generation and validation to growth and long-term sustainability. Our services are tailored to the specific context of each initiative, with a strong focus on local impact, inclusive employment, and community-driven solutions.

Our support includes:

• Business Plan Development
We assist social entrepreneurs in designing robust and realistic business plans that integrate social mission, governance, operational structure, and financial sustainability. Emphasis is placed on impact logic, scalability, and alignment with funding and policy frameworks.

• Market Analysis
We conduct market and ecosystem analysis to help social enterprises understand demand, competition, value chains, and stakeholder dynamics. This ensures that products and services are viable, responsive to real needs, and well-positioned within local and regional markets.

• Funding Support
We provide guidance on accessing EU, national, and alternative funding opportunities, including grants, public funding schemes, and social finance instruments. Support includes funding strategy design, application preparation, and alignment with donor and programme requirements.

• Mentorship Programs
Through structured mentoring and coaching, we connect social enterprises with experienced professionals and sector experts. Mentorship focuses on governance, management, financial planning, impact measurement, and strategic growth, supporting enterprises during critical development phases.

By combining capacity building, mentoring, and ecosystem knowledge, THREE THIRDS SOCIETY enables social enterprises to become resilient, impactful, and economically sustainable actors within their communities. Our work contributes to job creation, social inclusion, and the strengthening of local and regional social economy ecosystems.""",
        "buttonStyle": "outline",
        "order": 1
    },
    {
        "buttonId": "service_learn_more_2",
        "section": "services",
        "label": "Learn More",
        "isVisible": True,
        "clickAction": "show_message",
        "clickMessage": """Training & Capacity Building

THREE THIRDS SOCIETY designs and delivers professional training and capacity-building programmes aimed at empowering vulnerable groups and civil society actors with the skills, knowledge, and competencies needed for social inclusion, employability, and active participation in the social economy.

Our training initiatives target youth, NEETs, unemployed persons, migrants and refugees, social entrepreneurs, and CSOs, responding to real labour market needs and community challenges. Programmes are developed using inclusive, learner-centred methodologies and are adapted to local, regional, and European contexts.

Key training areas include:

• Skills Development
We deliver training focused on transversal and job-related skills, including communication, teamwork, problem-solving, project management, and employability competences. These skills strengthen participants' ability to access employment, engage in collective initiatives, and contribute to community development.

• Leadership Training
We support the development of leadership capacities among individuals and groups, fostering confidence, participation, and responsible decision-making. Training addresses leadership in social enterprises, cooperatives, community initiatives, and civil society organizations, with an emphasis on inclusive and participatory governance.

• Digital Literacy
We provide digital skills training to reduce digital exclusion and support the digital transformation of individuals and organizations. Programmes cover basic and advanced digital competences, online collaboration tools, digital communication, and technology-enabled learning and work.

• Entrepreneurship Education
We deliver entrepreneurship education with a strong social impact perspective, supporting participants to develop entrepreneurial mindsets, identify opportunities, and transform ideas into viable initiatives. Training integrates business fundamentals, social innovation, and sustainability principles.

Through hands-on training, practical exercises, mentoring elements, and peer learning, THREE THIRDS SOCIETY ensures that participants gain applicable skills and long-term capacity. Our training and capacity-building activities contribute to increased employability, social inclusion, and the strengthening of resilient and inclusive local economies.""",
        "buttonStyle": "outline",
        "order": 1
    },
    {
        "buttonId": "service_learn_more_3",
        "section": "services",
        "label": "Learn More",
        "isVisible": True,
        "clickAction": "show_message",
        "clickMessage": """Research & Innovation

THREE THIRDS SOCIETY conducts applied research and develops innovative solutions to address social challenges and promote inclusive, sustainable economic growth. Our work bridges research, practice, and policy, ensuring that knowledge production leads to measurable social impact and informed decision-making.

We collaborate with public authorities, academic institutions, social economy actors, and European partners to generate evidence, test new approaches, and scale solutions that respond to real societal needs. Research and innovation activities are closely linked to field implementation, community engagement, and policy development.

Our focus areas include:

• Social Impact Research
We design and implement research studies that assess social, economic, and territorial impact. This includes impact measurement frameworks, sustainability models, and evaluation methodologies supporting social enterprises, community initiatives, and public programmes.

• Policy Development
We support policy design and reform processes by providing research-based insights, policy recommendations, and participatory consultation processes. Our work contributes to local, regional, and national strategies on social economy, employment, youth inclusion, and social innovation.

• Innovation Labs
We design and facilitate innovation labs and co-creation spaces where stakeholders collaboratively develop, test, and refine innovative solutions. These labs bring together civil society, public authorities, entrepreneurs, and researchers to pilot new models, services, and governance approaches.

• Data Analytics
We use data collection and analysis tools to support evidence-based planning, monitoring, and evaluation. Data analytics inform programme design, track outcomes, and strengthen transparency and accountability in social and public interventions.

Through research-driven innovation and collaborative experimentation, THREE THIRDS SOCIETY supports the development of scalable solutions, strengthens institutional capacity, and contributes to policies and practices that foster inclusive and resilient local and regional economies.""",
        "buttonStyle": "outline",
        "order": 1
    },
    {
        "buttonId": "service_learn_more_4",
        "section": "services",
        "label": "Learn More",
        "isVisible": True,
        "clickAction": "show_message",
        "clickMessage": """Project Management

THREE THIRDS SOCIETY provides end-to-end project management services for social impact initiatives and EU-funded programmes, supporting organizations from project design and planning to implementation, monitoring, and evaluation. Our approach ensures that projects are strategically aligned, efficiently managed, and deliver measurable and sustainable impact.

We work with civil society organizations, social enterprises, public authorities, and European partnerships, offering both coordination and support roles in complex, multi-stakeholder projects. Drawing on extensive experience in EU and national funding frameworks, we ensure compliance, quality delivery, and effective collaboration across partners.

Our project management services include:

• EU Project Management
We support the full lifecycle of EU-funded projects (Interreg, Erasmus+, CERV, ESF+, AMIF, NSRF), including proposal development, partnership coordination, work plan implementation, reporting, and communication with managing authorities.

• Impact Assessment
We design and implement impact assessment frameworks to measure social, economic, and territorial outcomes. This includes defining indicators, collecting qualitative and quantitative data, and using results to improve project effectiveness and accountability.

• Strategic Planning
We support organizations and partnerships in defining clear project strategies, objectives, and roadmaps. Strategic planning ensures coherence between activities, resources, expected results, and long-term sustainability beyond project duration.

• Quality Assurance
We apply structured quality assurance processes to ensure timely delivery, compliance with funding rules, and high-quality outputs. Continuous monitoring, risk management, and internal evaluation mechanisms are integrated throughout the project lifecycle.

Through rigorous management, strategic oversight, and impact-focused evaluation, THREE THIRDS SOCIETY enables partners to successfully implement complex projects that contribute to social inclusion, community development, and the strengthening of social economy ecosystems at local, regional, and European levels.""",
        "buttonStyle": "outline",
        "order": 1
    },
    {
        "buttonId": "service_learn_more_5",
        "section": "services",
        "label": "Learn More",
        "isVisible": True,
        "clickAction": "show_message",
        "clickMessage": """Advisory Services

THREE THIRDS SOCIETY provides expert advisory and strategic consulting services to organizations seeking to maximize their social impact, strengthen governance, and improve operational efficiency. Our advisory work is grounded in practical experience, policy knowledge, and a deep understanding of the social economy ecosystem.

We support civil society organizations, social enterprises, cooperatives, public bodies, and multi-stakeholder partnerships, offering tailored guidance that responds to organizational needs, development stage, and operating context. Advisory services are delivered through structured consulting, mentoring, and long-term strategic support.

Our advisory services include:

• Organizational Development
We support organizations in strengthening internal structures, governance models, operational processes, and human resources. This includes organizational assessments, capacity-building roadmaps, and support for growth and professionalization.

• Strategic Consulting
We provide strategic guidance to help organizations define their mission, vision, and long-term objectives. Strategic consulting supports decision-making, prioritization of activities, stakeholder engagement, and alignment with policy and funding environments.

• Impact Measurement
We design and apply impact measurement frameworks that enable organizations to assess, demonstrate, and communicate their social and economic value. This includes defining indicators, data collection methods, and reporting tools aligned with funder and policy requirements.

• Sustainability Planning
We assist organizations in developing sustainability strategies that strengthen financial resilience, diversify funding sources, and ensure long-term viability. Sustainability planning integrates business models, partnerships, and impact-driven growth approaches.

Through evidence-based advisory support and strategic alignment, THREE THIRDS SOCIETY enables organizations to increase effectiveness, accountability, and resilience, contributing to stronger social economy actors and more sustainable community-driven initiatives.""",
        "buttonStyle": "outline",
        "order": 1
    },
    {
        "buttonId": "service_learn_more_6",
        "section": "services",
        "label": "Learn More",
        "isVisible": True,
        "clickAction": "show_message",
        "clickMessage": """Networking & Partnerships

THREE THIRDS SOCIETY fosters networking and strategic partnerships that connect stakeholders and build collaborative ecosystems capable of amplifying social impact across communities. We act as a bridge between civil society, social enterprises, public authorities, academia, and European partners, enabling cooperation that leads to sustainable and scalable solutions.

Our networking and partnership activities support the development of strong, inclusive, and resilient ecosystems, where knowledge, resources, and expertise are shared to address complex social and economic challenges. Partnerships are designed to be purpose-driven, long-term, and aligned with community needs and policy priorities.

Our networking and partnership services include:

• Stakeholder Engagement
We design and facilitate engagement processes that bring together diverse stakeholders, ensuring inclusive participation and meaningful dialogue. This includes multi-stakeholder forums, working groups, consultations, and collaborative planning processes.

• Partnership Development
We support the creation and strengthening of partnerships at local, regional, national, and European levels. This includes identifying complementary partners, defining roles and governance structures, and supporting cooperation within EU-funded and cross-sector initiatives.

• Community Building
We contribute to the development of communities of practice and thematic networks that strengthen trust, collaboration, and collective action. Community building activities support peer learning, mutual support, and the long-term sustainability of social economy ecosystems.

• Knowledge Exchange
We facilitate structured knowledge exchange through workshops, conferences, peer learning activities, and digital platforms. This ensures that best practices, innovative approaches, and lessons learned are shared and transferred across regions and sectors.

Through strategic networking and partnership facilitation, THREE THIRDS SOCIETY enables stakeholders to collaborate effectively, mobilize collective resources, and co-create solutions that enhance social inclusion, regional development, and inclusive economic growth.""",
        "buttonStyle": "outline",
        "order": 1
    }
]

# Service for Social Economy Workshops - needs special handling due to dynamic ID
WORKSHOPS_SERVICE_LEARN_MORE = {
    "section": "services",
    "label": "Learn More",
    "isVisible": True,
    "clickAction": "show_message",
    "clickMessage": """Social Economy Workshops & Conferences

THREE THIRDS SOCIETY designs and delivers Social Economy workshops and conferences that strengthen civil society actors, support policy dialogue, and contribute to inclusive and sustainable regional development.

Our events serve as platforms for learning, exchange, and collaboration, bringing together social enterprises, cooperatives, CSOs, public authorities, policymakers, academics, and European partners. Through participatory and practice-oriented formats, we promote innovative social economy models, enhance organizational capacity, and foster cross-sector cooperation.

We organize local, regional, national, and European-level events, focusing on key thematic areas such as social entrepreneurship, cooperative development, youth employment and NEET inclusion, social innovation, community-led development, and the green and digital transition. Special emphasis is placed on connecting grassroots experience with policy frameworks and funding opportunities at regional, national, and EU levels.

Our methodological approach combines interactive workshops, thematic panels, peer learning, case studies, and structured policy dialogues, ensuring meaningful engagement and practical outcomes for participants. Events are often linked to ongoing projects, regional Social Hubs, and policy initiatives, reinforcing long-term impact beyond single activities.

By organizing Social Economy workshops and conferences, THREE THIRDS SOCIETY contributes to:

• Capacity building of social economy actors and civil society organizations

• Strengthening regional social economy ecosystems

• Enhancing multi-stakeholder cooperation and knowledge exchange

• Supporting evidence-based policymaking and institutional development

With more than a decade of experience and a strong presence at regional and European levels, THREE THIRDS SOCIETY acts as a trusted facilitator and convenor, supporting communities and institutions in shaping resilient, inclusive, and sustainable local economies.""",
    "buttonStyle": "outline",
    "order": 1
}

UPDATED_SETTINGS = [
    {
        "settingKey": "contact_info",
        "settingValue": {
            "address": "Pellis 2, Nea Filadelfia, Attiki, Greece",
            "phone": "+30 211 7057627",
            "email": "info@3ts.gr",
            "workingHours": "Monday - Friday: 9:00 AM - 6:00 PM"
        },
        "isActive": True
    }
]

async def migrate_custom_content():
    """Migrate all custom content to ensure it exists in the database"""
    try:
        logger.info("Starting custom content migration...")
        
        # FIRST: Ensure services exist
        services_count = await services_collection.count_documents({})
        logger.info(f"Found {services_count} existing services")
        
        if services_count == 0:
            logger.info("No services found, inserting all services...")
            for service_data in SERVICES_DATA:
                service_data["createdAt"] = datetime.utcnow()
                service_data["updatedAt"] = datetime.utcnow()
                await services_collection.insert_one(service_data)
                logger.info(f"Inserted service: {service_data['title']}")
        else:
            # Update existing services or insert missing ones
            for service_data in SERVICES_DATA:
                existing = await services_collection.find_one({"title": service_data["title"]})
                if not existing:
                    service_data["createdAt"] = datetime.utcnow()
                    service_data["updatedAt"] = datetime.utcnow()
                    await services_collection.insert_one(service_data)
                    logger.info(f"Inserted missing service: {service_data['title']}")
        
        # Migrate button configurations
        for btn_config in CUSTOM_BUTTON_CONFIGS:
            existing = await button_configs_collection.find_one({"buttonId": btn_config["buttonId"]})
            if existing:
                # Update existing button
                await button_configs_collection.update_one(
                    {"buttonId": btn_config["buttonId"]},
                    {"$set": btn_config}
                )
                logger.info(f"Updated button: {btn_config['buttonId']}")
            else:
                # Insert new button
                await button_configs_collection.insert_one(btn_config)
                logger.info(f"Inserted button: {btn_config['buttonId']}")
        
        # Handle the workshops service learn more button (dynamic ID)
        workshops_service = await services_collection.find_one({"title": {"$regex": "Workshop", "$options": "i"}})
        if workshops_service:
            workshops_btn_id = f"service_learn_more_{workshops_service.get('id')}"
            workshops_btn = {**WORKSHOPS_SERVICE_LEARN_MORE, "buttonId": workshops_btn_id}
            existing = await button_configs_collection.find_one({"buttonId": workshops_btn_id})
            if existing:
                await button_configs_collection.update_one(
                    {"buttonId": workshops_btn_id},
                    {"$set": workshops_btn}
                )
            else:
                await button_configs_collection.insert_one(workshops_btn)
            logger.info(f"Configured workshops button: {workshops_btn_id}")
        
        # Update settings
        for setting in UPDATED_SETTINGS:
            await company_settings_collection.update_one(
                {"settingKey": setting["settingKey"]},
                {"$set": setting},
                upsert=True
            )
            logger.info(f"Updated setting: {setting['settingKey']}")
        
        logger.info("Custom content migration completed successfully")
        
    except Exception as e:
        logger.error(f"Error during custom content migration: {str(e)}")
