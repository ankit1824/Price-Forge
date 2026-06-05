from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class SuggestionsResponse(BaseModel):
    suggestions: list

# Product catalog for autocomplete
PRODUCT_CATALOG = [
    "Aashirvaad Atta 1kg",
    "Amul Milk 500ml",
    "Tata Salt 1kg",
    "Fortune Refined Oil 1l",
    "Bournvita 500g",
    "Cadbury Dairy Milk",
    "Dettol Handwash",
    "Maggi Noodles",
    "Pepsi",
    "Coca Cola",
    "Banana",
    "Tomato",
    "Onion",
    "Potato",
    "Basmati Rice 1kg",
    "Moong Dal 1kg",
    "Paneer 200g",
    "Curd 500ml",
    "Butter 100g",
    "Sugar 1kg",
    "Flour 1kg",
    "Honey 500ml",
    "Tea Leaves 250g",
    "Coffee Powder 100g",
    "Ghee 500ml",
    "Olive Oil 500ml",
    "Mustard Oil 1l",
    "Coconut Oil 500ml",
    "Bread 400g",
    "Eggs 6pcs"
]

@router.get("/suggestions", response_model=SuggestionsResponse)
async def get_suggestions(q: str):
    """
    Get autocomplete suggestions based on user query
    """
    try:
        if not q or len(q) < 2:
            return SuggestionsResponse(suggestions=[])
        
        q_lower = q.lower()
        
        # Filter products that match the query
        matching = [p for p in PRODUCT_CATALOG if q_lower in p.lower()]
        
        # Return top 5 suggestions
        return SuggestionsResponse(suggestions=matching[:5])
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting suggestions: {str(e)}")