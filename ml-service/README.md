## PriceForge - ML Microservice

This FastAPI microservice handles:
- **Product Name Matching** using Sentence-Transformers embeddings
- **Real-time Web Scraping** using Playwright
- **Best Deal Calculation** considering all factors

## Setup

```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

## API Endpoints

### 1. Search Products
**POST** `/api/search`

Request:
```json
{
  "items": ["Atta", "Sugar", "Oil"]
}
```

Response:
```json
{
  "results": [
    {
      "search_query": "Atta",
      "platforms": {
        "blinkit": {
          "name": "Aashirvaad Atta 5kg",
          "price": 245,
          "delivery": "₹20",
          "availability": true,
          "similarity_score": 0.92
        },
        "zepto": { ... },
        "instamart": null
      },
      "available_on": 2,
      "total_platforms": 3
    }
  ],
  "partialAvailability": [
    {
      "itemName": "Atta",
      "availableOn": ["blinkit", "zepto"],
      "count": "2/3"
    }
  ]
}
```

### 2. Checkout & Best Deal
**POST** `/api/checkout`

Request:
```json
{
  "cartItems": [
    {"itemName": "Atta", "quantity": 2},
    {"itemName": "Sugar", "quantity": 1}
  ]
}
```

Response:
```json
{
  "platformResults": {
    "blinkit": {
      "subtotal": 490,
      "delivery": 20,
      "total": 510,
      "eligible": true
    },
    "zepto": {
      "subtotal": 480,
      "delivery": 0,
      "total": 480,
      "eligible": true
    }
  },
  "bestDeal": "zepto",
  "partialAvailability": []
}
```

### 3. Health Check
**GET** `/api/health`

## Architecture

```
FastAPI App
    ↓
Routes (/api/search, /api/checkout)
    ↓
Services (Matching, Pricing)
    ↓
Sub-services (Embeddings, Scraper)
    ↓
Playwright Browser + Sentence-Transformers
```

## Key Features

✅ **AI-Powered Matching** - Uses embeddings to find similar products
✅ **Real-time Scraping** - Concurrent scraping from all platforms
✅ **Partial Availability** - Handles items on 1-3 platforms
✅ **Async Operations** - Fast concurrent processing
✅ **Error Handling** - Graceful fallbacks

## Docker

```bash
docker build -t priceforge-ml .
docker run -p 8000:8000 priceforge-ml
```

Or with docker-compose:
```bash
docker-compose up ml-service
```
