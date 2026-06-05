from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.playwright_scraper import scrape_all_platforms

router = APIRouter()

class ScrapeRequest(BaseModel):
    productName: str
    platforms: list = ["blinkit", "zepto", "instamart"]

class PriceData(BaseModel):
    price: float
    deliveryFee: float = 0
    minimumOrder: int = 0
    buyLink: str
    lastUpdated: str

class ScrapeResponse(BaseModel):
    productName: str
    prices: dict
    availability: dict
    scrapedAt: str

@router.post("/scrape-prices", response_model=ScrapeResponse)
async def scrape_prices(request: ScrapeRequest):
    """
    Scrape real-time prices from multiple platforms
    Returns prices with delivery fees and buy links
    """
    try:
        from datetime import datetime
        
        product_name = request.productName
        platforms = request.platforms
        
        # Call playwright scraper service
        result = await scrape_all_platforms(product_name, platforms)
        
        return ScrapeResponse(
            productName=product_name,
            prices=result['prices'],
            availability=result['availability'],
            scrapedAt=datetime.now().isoformat()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraping error: {str(e)}")