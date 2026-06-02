import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://admin:password123@localhost:27017/priceforge?authSource=admin')
BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:5000')

# Platforms configuration
PLATFORMS = {
    'blinkit': {
        'url': 'https://www.blinkit.com',
        'search_endpoint': '/search',
        'selector': {
            'products': '[data-testid="plp-product-item"]',
            'name': '[class*="ProductCard__productName"]',
            'price': '[class*="ProductCard__discountedPrice"]',
            'delivery': '[class*="DeliveryCharge"]'
        }
    },
    'zepto': {
        'url': 'https://www.zeptomart.com',
        'search_endpoint': '/search',
        'selector': {
            'products': '[class*="ProductCard"]',
            'name': '[class*="productName"]',
            'price': '[class*="price"]',
            'delivery': '[class*="delivery"]'
        }
    },
    'instamart': {
        'url': 'https://www.instamart.in',
        'search_endpoint': '/search',
        'selector': {
            'products': '[class*="ProductItem"]',
            'name': '[class*="productName"]',
            'price': '[class*="productPrice"]',
            'delivery': '[class*="deliveryFee"]'
        }
    }
}

# Scraping config
SCRAPER_TIMEOUT = 30000  # ms
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
]

# Embeddings config
EMBEDDING_MODEL = 'all-MiniLM-L6-v2'
SIMILARITY_THRESHOLD = 0.75
