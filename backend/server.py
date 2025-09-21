from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from contextlib import asynccontextmanager

# Import database initialization
from database import init_database, seed_initial_data, close_database

# Import route modules
from routes import services, projects, contact, settings

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
    await init_database()
    await seed_initial_data()
    logger.info("Database initialized and seeded")
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

# Legacy hello world endpoint
@api_router.get("/")
async def root():
    return {"message": "Three Thirds Society API is running!"}

# Health check endpoint
@api_router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "three-thirds-society-api",
        "version": "1.0.0"
    }

# Include route modules
app.include_router(services.router)
app.include_router(projects.router)
app.include_router(contact.router)
app.include_router(settings.router)

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
async def internal_server_error_handler(request, exc):
    logger.error(f"Internal server error: {str(exc)}")
    return {
        "error": "Internal server error",
        "message": "Something went wrong. Please try again later."
    }

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {
        "error": "Not found",
        "message": "The requested resource was not found."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)