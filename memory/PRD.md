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
   - News & Updates section
   - Contact form (with email notifications)
   - Company document downloads (PDF/DOCX)
   
2. Admin Dashboard:
   - Password-protected access
   - Full CRUD for Services, Projects, and News
   - Image upload functionality for Projects and News
   - Settings management (Hero stats, contact info)
   - Button configuration management
   - Contact form inquiry viewer

## Architecture
- **Frontend**: React with Shadcn UI components
- **Backend**: FastAPI with Pydantic models
- **Database**: MongoDB
- **Routing**: React Router for frontend, RESTful APIs for backend
- **File Storage**: Local uploads directory with API endpoints

## What's Been Implemented

### July 18, 2026
- **Social Grocery of Souli Project**: Created new project "Κοινωνικό Παντοπωλείο Σουλίου" with:
  - ESPA 2021-2027 logo extracted from espa-epirus.gr
  - Full Greek description about Social Grocery initiative
  - Bilingual title (English + Greek)
  - Proper categorization (Social Economy, Ήπειρος region)

### Previous Sessions (Completed)
- **Multiple Document Uploads**: News articles now support multiple PDF/DOCX/XLS attachments
- **Markdown Hyperlinks**: News content supports `[text](url)` markdown links
- **Greek Filename Support**: RFC 5987 Content-Disposition headers for non-ASCII filenames
- **Orphan File Cleanup**: Automatic GridFS cleanup when articles/projects are modified/deleted
- **Excel File Support**: Added .xls and .xlsx upload support
- **Format Badges**: Color-coded file type badges (PDF=red, DOC=blue, XLS=green)
- **Cache Control Fix**: Reduced max-age from 1 year to 1 hour for uploaded files

### January 14, 2026
- **Image Upload Feature**: Added direct image upload for Projects and News sections
  - File upload endpoint at `/api/upload/image`
  - Supports JPG, PNG, GIF, WebP (max 10MB)
  - Image serving at `/api/upload/images/{filename}`
  - Both Projects and News forms now have "Upload Image" button alongside URL option
- **Content Migration Script Verified**: Tested and confirmed working locally
  - All 7 services, 4 projects, 13 buttons, and settings migrate on startup
  - Ready for production deployment

### January 13, 2026
- **Content Migration Script**: Created comprehensive `content_migration.py` to sync all dashboard content to production database on startup
- **Email Integration**: Contact form now sends emails to `info@3ts.gr` via dnhost SMTP
- **News & Updates Section**: Full CRUD module with admin management
- **Service Popup Content**: Detailed Learn More popups for all 7 services

### January 12, 2026
- **Fixed MongoDB Atlas connection timeout**: Added proper connection settings
- **Made database initialization resilient**: App starts even if DB slow
- **Fixed deployment error**: Exception handlers return JSONResponse
- **Added root-level `/health` endpoint** for Kubernetes health probes

### Previous Session (Completed)
- Full-stack website with React frontend, FastAPI backend, MongoDB
- Admin dashboard at `/admin` with password protection
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
- **Format Badges on Teasers**: Add compact PDF/XLS/DOC chips to News article card teasers
- **Backend Testing**: Run comprehensive automated tests with `testing_agent_v3_fork` (critical - significant untested backend changes)

### P2 - Future
- **Video Embedding**: User wants a 1-minute video on the website (waiting for video URL/file from user)
- **Multiple Admin Accounts**: Currently single admin via `.env`

### P3 - Backlog
- Additional content sections as needed
- Newsletter functionality implementation
- SEO optimizations

## Notes
- User has not yet tested the admin dashboard button management system
- No third-party integrations currently in use
- No mocked components - all content is served dynamically from backend
