# ML Service - FastAPI + Python

## Installation
```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

## Architecture
- `/app/api/routes.py` - API endpoints
- `/app/services/scraper.py` - Playwright web scraping
- `/app/services/embeddings.py` - Sentence-Transformers for product matching
- `/app/services/matching.py` - Smart product matching logic
- `/app/services/pricing.py` - Price extraction and normalization

## Key Services

### 1. Product Matching (Embeddings)
- Uses Sentence-Transformers to find similar product names
- Handles slight variations (e.g., "Atta" vs "Aata", "Aashirvaad" vs "Aashirwad")
- Compares embeddings across platforms with configurable threshold

### 2. Web Scraping (Playwright)
- Real-time scraping from Blinkit, Zepto, Instamart
- Extracts: product name, price, availability, delivery fee, minimum order
- User-Agent rotation to avoid blocking
- Caching to reduce scraping frequency

### 3. Best Deal Scoring
- Calculates total cost: (item_price × quantity) + delivery_fee
- Checks minimum order requirements
- Recommends best platform considering all factors
- Returns detailed breakdown for each platform

### 4. Partial Availability Handling
- Items not on all platforms are marked clearly
- Shows availability count (e.g., "Available on 2/3 platforms")
- Allows users to still compare available options
