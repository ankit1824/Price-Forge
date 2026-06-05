from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .api import match_product, scraper, suggestions

# Load models on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Loading Sentence Transformer model...")
    from .services.embeddings import load_model
    load_model()
    print("Model loaded successfully")
    yield
    # Shutdown
    print("Shutting down...")

app = FastAPI(
    title="PriceForge ML Service",
    description="AI/ML microservice for product matching and price scraping",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(match_product.router, prefix="/api", tags=["Product Matching"])
app.include_router(scraper.router, prefix="/api", tags=["Scraping"])
app.include_router(suggestions.router, prefix="/api", tags=["Suggestions"])

@app.get("/health")
async def health_check():
    return {"status": "ML Service is running"}

@app.get("/")
async def root():
    return {
        "name": "PriceForge ML Service",
        "version": "1.0.0",
        "endpoints": [
            "/api/match-product",
            "/api/scrape-prices",
            "/api/suggestions"
        ]
    }