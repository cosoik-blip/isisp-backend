from fastapi import FastAPI, APIRouter, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from contextlib import asynccontextmanager

# Import database initialization
from database import init_database, seed_initial_data, close_database
from content_migration import migrate_custom_content

# Import route modules
from routes.services import router as services_router
from routes.projects import router as projects_router
from routes.contact import router as contact_router
from routes.settings import router as settings_router
from routes.admin import router as admin_router
from routes.buttons import router as buttons_router
from routes.news import router as news_router
from routes.upload import router as upload_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up Three Thirds Society API...")
    try:
        await init_database()
        await seed_initial_data()
        await migrate_custom_content()
        logger.info("Database initialized, seeded, and custom content migrated")
    except Exception as e:
        logger.error(f"Database initialization error (non-fatal): {str(e)}")
        # Don't fail startup - app can still serve health checks
        # Database operations will retry on first request
    yield
    # Shutdown
    logger.info("Shutting down...")
    await close_database()

# Create the main app
app = FastAPI(
    title="Three Thirds Society API",
    description="API for the Three Thirds Society website",
    version="1.0.0",
    lifespan=lifespan
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check endpoint (at root level for Kubernetes)
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "three-thirds-society-api",
        "version": "1.0.0"
    }

# Legacy hello world endpoint
@api_router.get("/")
async def root():
    return {"message": "Three Thirds Society API is running!"}

# Health check endpoint (under /api for frontend access)
@api_router.get("/health")
async def api_health_check():
    return {
        "status": "healthy",
        "service": "three-thirds-society-api",
        "version": "1.0.0"
    }

# Include route modules
app.include_router(services_router)
app.include_router(projects_router)
app.include_router(contact_router)
app.include_router(settings_router)
app.include_router(admin_router)
app.include_router(buttons_router)
app.include_router(news_router)

# Include the main API router
app.include_router(api_router)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],  # In production, specify exact origins
    allow_methods=["*"],
    allow_headers=["*"],
)

# Error handling middleware
@app.exception_handler(500)
async def internal_server_error_handler(request: Request, exc: Exception):
    logger.error(f"Internal server error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "Something went wrong. Please try again later."
        }
    )

@app.exception_handler(404)
async def not_found_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=404,
        content={
            "error": "Not found",
            "message": "The requested resource was not found."
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)