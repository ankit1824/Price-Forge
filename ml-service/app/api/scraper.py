from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.scraper import ScraperService
from ..services.pricing import PricingService
from datetime import datetime

router = APIRouter()
scraper_service = ScraperService()

class ScrapeRequest(BaseModel):
    productName: str
    platforms: list = ["blinkit", "zepto", "instamart"]

class ScrapeResponse(BaseModel):
    productName: str
    prices: dict
    availability: dict
    scrapedAt: str

class BestDealRequest(BaseModel):
    items: list

@router.post("/scrape-prices", response_model=ScrapeResponse)
async def scrape_prices(request: ScrapeRequest):
    """
    Scrape real-time prices from multiple platforms using ScraperService (hybrid approach)
    """
    try:
        product_name = request.productName
        platforms = request.platforms
        
        # Call the updated scraper service
        result = await scraper_service.scrape_all_platforms(product_name, platforms)
        
        return ScrapeResponse(
            productName=product_name,
            prices=result['prices'],
            availability=result['availability'],
            scrapedAt=datetime.now().isoformat()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraping error: {str(e)}")

@router.post("/calculate-best-deal")
async def calculate_best_deal_endpoint(request: BestDealRequest):
    """
    Calculate the overall best deal and platform comparisons for a list of items
    """
    try:
        results = PricingService.calculate_best_deal(request.items)
        if "error" in results:
            raise HTTPException(status_code=500, detail=results["error"])
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pricing calculation error: {str(e)}")