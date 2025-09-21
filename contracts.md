# Three Thirds Society (3TS) - Backend Implementation Contracts

## Overview
Transform the frontend-only 3TS website into a fully functional web application with database-backed functionality, content management, and professional features.

## Current Mock Data to Replace
Located in `/app/frontend/src/mock.js`:
- `heroData` - Hero section statistics and content
- `servicesData` - 6 service offerings with features
- `projectsData` - 4 impact projects with details and images
- `contactData` - Company contact information  
- `teamData` - Team member information
- `testimonialsData` - Client testimonials

## Database Models Required

### 1. Services Model
```javascript
{
  id: ObjectId,
  title: String,
  description: String,
  icon: String, // Icon name for frontend
  features: [String],
  isActive: Boolean,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Projects Model
```javascript
{
  id: ObjectId,
  title: String,
  description: String,
  impact: String,
  region: String,
  year: String,
  category: String,
  image: String, // URL to project image
  isActive: Boolean,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Contact Inquiries Model
```javascript
{
  id: ObjectId,
  name: String,
  email: String,
  organization: String, // Optional
  subject: String,
  message: String,
  status: String, // 'new', 'read', 'responded', 'closed'
  ipAddress: String,
  userAgent: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Company Settings Model
```javascript
{
  id: ObjectId,
  settingKey: String, // 'hero_stats', 'contact_info', 'company_info'
  settingValue: Object, // Flexible JSON storage
  isActive: Boolean,
  updatedAt: Date
}
```

### 5. Team Members Model (Optional)
```javascript
{
  id: ObjectId,
  name: String,
  role: String,
  expertise: String,
  experience: String,
  image: String,
  isActive: Boolean,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints to Implement

### Public Endpoints (No Authentication Required)

#### GET /api/services
- **Purpose**: Fetch all active services for frontend display
- **Response**: Array of service objects ordered by `order` field
- **Frontend Integration**: Replace `servicesData` in Services component

#### GET /api/projects  
- **Purpose**: Fetch all active projects for frontend display
- **Response**: Array of project objects ordered by `order` field
- **Frontend Integration**: Replace `projectsData` in Projects component

#### POST /api/contact
- **Purpose**: Handle contact form submissions
- **Request Body**: `{ name, email, organization?, subject, message }`
- **Response**: `{ success: boolean, message: string }`
- **Frontend Integration**: Replace mock form submission in Contact component
- **Additional Features**: 
  - Email notification to admin
  - Auto-response email to user
  - Input validation and sanitization
  - Rate limiting to prevent spam

#### GET /api/settings/:key
- **Purpose**: Fetch dynamic settings (hero stats, contact info, etc.)
- **Response**: Setting object with key-value pairs
- **Frontend Integration**: Replace hardcoded data in Hero and Contact components

### Admin Endpoints (Future Enhancement)

#### Services Management
- `GET /api/admin/services` - List all services
- `POST /api/admin/services` - Create new service
- `PUT /api/admin/services/:id` - Update service
- `DELETE /api/admin/services/:id` - Delete service

#### Projects Management  
- `GET /api/admin/projects` - List all projects
- `POST /api/admin/projects` - Create new project
- `PUT /api/admin/projects/:id` - Update project
- `DELETE /api/admin/projects/:id` - Delete project

#### Contact Inquiries Management
- `GET /api/admin/contacts` - List all inquiries with pagination
- `PUT /api/admin/contacts/:id/status` - Update inquiry status
- `GET /api/admin/contacts/stats` - Dashboard statistics

## Frontend Integration Plan

### Phase 1: Replace Mock Data
1. **Services Component**: Replace `servicesData` import with API call to `/api/services`
2. **Projects Component**: Replace `projectsData` import with API call to `/api/projects`  
3. **Hero Component**: Replace `heroData.stats` with API call to `/api/settings/hero_stats`
4. **Contact Component**: Replace mock contact info with API call to `/api/settings/contact_info`

### Phase 2: Functional Contact Form
1. Update Contact component form submission to call `/api/contact`
2. Add proper error handling and success messages
3. Add form validation and loading states
4. Implement client-side rate limiting

### Phase 3: Dynamic Content Loading
1. Add loading states for all data fetching
2. Add error handling for failed API calls
3. Implement data caching where appropriate
4. Add refresh mechanisms

## Technical Implementation Details

### Backend Architecture
- **Framework**: FastAPI (existing)
- **Database**: MongoDB with Motor (existing) 
- **Validation**: Pydantic models for request/response validation
- **Email**: SMTP integration for contact form notifications
- **Environment Variables**: Email settings, admin credentials, etc.

### Security Features
- Input validation and sanitization
- Rate limiting on contact form
- CORS properly configured
- Request logging for monitoring
- Basic security headers

### Error Handling
- Comprehensive error responses
- Logging for debugging
- Graceful degradation on frontend
- User-friendly error messages

## Data Migration Strategy
1. Create database models and seed with current mock data
2. Test API endpoints with seeded data
3. Update frontend components one by one
4. Remove mock.js file once all integrations complete

## Testing Approach
1. Test each API endpoint with sample data
2. Test frontend integration component by component  
3. Test contact form end-to-end (form submission → database → email)
4. Test error scenarios and edge cases
5. Verify responsive design still works with dynamic data

## Success Criteria
- ✅ All services load from database
- ✅ All projects load from database  
- ✅ Contact form sends emails and stores inquiries
- ✅ Hero statistics are dynamic and updatable
- ✅ Website loads quickly with proper error handling
- ✅ All interactive elements work smoothly
- ✅ No console errors or broken functionality
- ✅ Professional-grade performance and reliability

## Future Enhancements (Optional)
- Admin dashboard for content management
- User authentication system
- Advanced analytics and tracking
- Multi-language support
- Advanced email templates
- File upload capabilities for project images
- SEO optimization features
- Performance monitoring and analytics