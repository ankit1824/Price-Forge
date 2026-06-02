"""
Web Scraping Service using Playwright
Handles real-time scraping from Blinkit, Zepto, Instamart
"""
from playwright.async_api import async_playwright
from app.utils.logger import get_logger
from app.config import PLATFORMS, SCRAPER_TIMEOUT, USER_AGENTS
import random
import asyncio

logger = get_logger(__name__)

class ScraperService:
    def __init__(self):
        """Initialize the scraper"""
        self.user_agents = USER_AGENTS
        self.platforms = PLATFORMS
        logger.info("✅ Scraper service initialized")

    async def scrape_platform(self, platform_name, search_query):
        """
        Scrape prices from a specific platform
        
        Args:
            platform_name: 'blinkit', 'zepto', or 'instamart'
            search_query: Product to search for
        
        Returns:
            List of products with prices
        """
        try:
            if platform_name not in self.platforms:
                logger.error(f"Unknown platform: {platform_name}")
                return []

            platform_config = self.platforms[platform_name]
            base_url = platform_config['url']
            search_url = f"{base_url}/search?q={search_query}"

            # Use random user agent
            user_agent = random.choice(self.user_agents)

            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                context = await browser.new_context(user_agent=user_agent)
                page = await context.new_page()

                try:
                    logger.info(f"🔍 Scraping {platform_name} for '{search_query}'")
                    await page.goto(search_url, wait_until='networkidle', timeout=SCRAPER_TIMEOUT)
                    
                    # Wait for products to load
                    await page.wait_for_selector(platform_config['selector']['products'], timeout=5000)
                    
                    # Extract product data
                    products = await page.evaluate(self._extract_products_js, platform_config['selector'])
                    
                    logger.info(f"✅ Found {len(products)} products on {platform_name}")
                    return products

                except Exception as e:
                    logger.error(f"Error scraping {platform_name}: {e}")
                    return []
                
                finally:
                    await browser.close()

        except Exception as e:
            logger.error(f"Fatal error in scrape_platform: {e}")
            return []

    async def scrape_all_platforms(self, search_query):
        """
        Scrape all platforms concurrently
        
        Args:
            search_query: Product to search
        
        Returns:
            Dict of {platform: products}
        """
        try:
            logger.info(f"🔍 Starting concurrent scrape for '{search_query}'")
            
            tasks = [
                self.scrape_platform('blinkit', search_query),
                self.scrape_platform('zepto', search_query),
                self.scrape_platform('instamart', search_query)
            ]
            
            results = await asyncio.gather(*tasks)
            
            return {
                'blinkit': results[0],
                'zepto': results[1],
                'instamart': results[2]
            }

        except Exception as e:
            logger.error(f"Error scraping all platforms: {e}")
            return {}

    @staticmethod
    def _extract_products_js(selectors):
        """JavaScript to extract product information from page"""
        return """
        (function(selectors) {
            const products = [];
            const productElements = document.querySelectorAll(selectors.products);
            
            productElements.forEach(el => {
                try {
                    const name = el.querySelector(selectors.name)?.innerText || '';
                    const priceText = el.querySelector(selectors.price)?.innerText || '0';
                    const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
                    const delivery = el.querySelector(selectors.delivery)?.innerText || 'N/A';
                    
                    if (name && price > 0) {
                        products.push({
                            name: name,
                            price: price,
                            delivery: delivery,
                            availability: true
                        });
                    }
                } catch (e) {
                    console.error('Error parsing product:', e);
                }
            });
            
            return products;
        })(arguments[0])
        """
