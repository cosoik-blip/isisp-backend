from fastapi import APIRouter, HTTPException
from typing import List
from models import NewsArticle, NewsArticleCreate, NewsArticleUpdate, APIResponse
from database import news_collection
from datetime import datetime
import logging

router = APIRouter(prefix="/api/news", tags=["news"])
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[NewsArticle])
async def get_news():
    """Get all published news articles ordered by publish date"""
    try:
        cursor = news_collection.find({"isPublished": True}).sort("publishedAt", -1)
        articles = await cursor.to_list(length=100)
        
        # Convert ObjectId to string for JSON serialization
        for article in articles:
            if "_id" in article:
                del article["_id"]
        
        logger.info(f"Retrieved {len(articles)} news articles")
        return articles
        
    except Exception as e:
        logger.error(f"Error retrieving news: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve news")

@router.get("/recent")
async def get_recent_news(limit: int = 5):
    """Get recent news articles"""
    try:
        cursor = news_collection.find({"isPublished": True}).sort("publishedAt", -1).limit(limit)
        articles = await cursor.to_list(length=limit)
        
        for article in articles:
            if "_id" in article:
                del article["_id"]
        
        return articles
        
    except Exception as e:
        logger.error(f"Error retrieving recent news: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve recent news")

@router.get("/category/{category}")
async def get_news_by_category(category: str):
    """Get news articles by category"""
    try:
        cursor = news_collection.find({"isPublished": True, "category": category}).sort("publishedAt", -1)
        articles = await cursor.to_list(length=100)
        
        for article in articles:
            if "_id" in article:
                del article["_id"]
        
        return articles
        
    except Exception as e:
        logger.error(f"Error retrieving news by category: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve news")

@router.get("/{article_id}", response_model=NewsArticle)
async def get_news_article(article_id: str):
    """Get a specific news article by ID"""
    try:
        article = await news_collection.find_one({"id": article_id, "isPublished": True})
        
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
        
        if "_id" in article:
            del article["_id"]
            
        return article
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving article {article_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve article")
