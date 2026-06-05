from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.embeddings import get_product_embedding, find_best_match

router = APIRouter()

class ProductMatchRequest(BaseModel):
    productName: str

class ProductMatchResponse(BaseModel):
    originalName: str
    normalizedName: str
    confidence: float
    alternatives: list = []

# Known product database for fuzzy matching
PRODUCT_DATABASE = {
    "aashirvaad atta": ["aashirvaad atta 1kg", "aashirvaad whole wheat atta", "aashirvaad indian atta"],
    "amul milk": ["amul milk 500ml", "amul toned milk", "amul full cream milk"],
    "tata salt": ["tata iodized salt", "tata salt 1kg"],
    "fortune oil": ["fortune refined oil", "fortune vegetable oil"],
    "bournvita": ["bournvita 500g", "bournvita chocolate"],
    "cadbury dairy milk": ["cadbury dairy milk 40g", "cadbury dairy milk 20g"],
    "dettol soap": ["dettol handwash", "dettol soap 125g"],
    "maggi noodles": ["maggi instant noodles 420g", "maggi 2-minute noodles"],
    "pepsi": ["pepsi 1.25l", "pepsi 2l", "pepsi 250ml"],
    "coke": ["coca cola 1.25l", "coca cola 2l"],
    "banana": ["banana 1kg", "banana fresh"],
    "tomato": ["tomato 1kg", "tomato fresh"],
    "onion": ["onion 1kg", "onion fresh"],
    "potato": ["potato 1kg", "potato fresh"],
    "rice": ["basmati rice 1kg", "long grain rice"],
    "dal": ["moong dal 1kg", "toor dal 1kg"],
    "paneer": ["paneer 200g", "paneer cottage cheese"],
    "curd": ["curd 500ml", "yogurt"],
    "butter": ["butter 100g", "amul butter"]
}

@router.post("/match-product", response_model=ProductMatchResponse)
async def match_product_endpoint(request: ProductMatchRequest):
    """
    Match user input to database products using embeddings
    Handles variations like typos, abbreviations, and regional names
    """
    try:
        user_input = request.productName.lower().strip()
        
        # Get embedding for user input
        user_embedding = get_product_embedding(user_input)
        
        # Find best match from database
        best_match, confidence = find_best_match(user_input, user_embedding, PRODUCT_DATABASE)
        
        if confidence < 0.5:
            # If confidence is low, return the input as-is but flag it
            return ProductMatchResponse(
                originalName=request.productName,
                normalizedName=user_input,
                confidence=confidence,
                alternatives=[]
            )
        
        # Get alternatives (similar products)
        alternatives = []
        if best_match in PRODUCT_DATABASE:
            alternatives = PRODUCT_DATABASE[best_match][:3]
        
        return ProductMatchResponse(
            originalName=request.productName,
            normalizedName=best_match,
            confidence=min(confidence, 1.0),
            alternatives=alternatives
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error matching product: {str(e)}")