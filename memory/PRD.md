# Three Thirds Society (3ts.gr) Website - PRD

## Original Problem Statement
Build a modern, professional website for "Three Thirds Society" (3ts.gr), a social economy organization in Greece. The website should feature sections for services, projects, and company information with an admin dashboard for content management.

## User Personas
- **Public Visitors**: People seeking information about 3TS services and projects
- **Admin Users**: Staff who manage website content via the admin dashboard

## Core Requirements
1. Public-facing website with:
   - Hero section with organization overview
   - Services section
   - Projects showcase
   - Contact form
   - Company document downloads (PDF/DOCX)
   
2. Admin Dashboard:
   - Password-protected access
   - Full CRUD for Services and Projects
   - Settings management (Hero stats, contact info)
   - Button configuration management
   - Contact form inquiry viewer

## Architecture
- **Frontend**: React with Shadcn UI components
- **Backend**: FastAPI with Pydantic models
- **Database**: MongoDB
- **Routing**: React Router for frontend, RESTful APIs for backend

## What's Been Implemented

### January 12, 2026
- **Removed "Made with Emergent" badge** from website footer
- **Updated page title** to "Three Thirds Society | Social Economy & Innovation"
- **Updated meta description** to be organization-relevant

### Previous Session (Completed)
- Full-stack website with React frontend, FastAPI backend, MongoDB
- Admin dashboard at `/admin` with password protection (254TFD98)
- Dynamic button management system
- Document integration (PDF/DOCX downloads)
- Official logo integration
- Contact form with database storage
- Complete CMS for Services, Projects, Settings

## Key Files
- `/app/frontend/src/App.js` - Main React router
- `/app/backend/server.py` - FastAPI application
- `/app/frontend/src/components/admin/Dashboard.jsx` - Admin panel
- `/app/frontend/public/index.html` - HTML template (updated)

## Database Collections
- `services` - Service listings
- `projects` - Project portfolio
- `settings` - Site configuration
- `inquiries` - Contact form submissions
- `buttons` - Button configurations

## Credentials
- **Admin Dashboard**: `/admin`
  - Username: `admin`
  - Password: `254TFD98`

## Backlog / Future Tasks

### P1 - Upcoming
- **Video Embedding**: User wants a 1-minute video on the website (waiting for video URL/file from user)
- **Backend Testing**: Run comprehensive automated tests

### P2 - Future
- Additional content sections as needed
- Newsletter functionality implementation
- SEO optimizations

## Notes
- User has not yet tested the admin dashboard button management system
- No third-party integrations currently in use
- No mocked components - all content is served dynamically from backend
