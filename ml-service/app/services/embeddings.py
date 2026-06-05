from sentence_transformers import SentenceTransformer, util
import numpy as np

# Global model instance
_model = None

def load_model():
    """Load Sentence Transformer model on startup"""
    global _model
    _model = SentenceTransformer('all-MiniLM-L6-v2')  # Fast, lightweight model
    print("Sentence Transformer model loaded")

def get_model():
    """Get the loaded model"""
    global _model
    if _model is None:
        load_model()
    return _model

def get_product_embedding(product_name: str):
    """Get embedding for a product name"""
    model = get_model()
    embedding = model.encode(product_name, convert_to_tensor=True)
    return embedding

def find_best_match(user_input: str, user_embedding, product_database: dict):
    """
    Find the best matching product from database using embeddings
    Returns (best_match, confidence_score)
    """
    model = get_model()
    
    best_match = None
    best_score = 0
    
    # Calculate similarity with each product in database
    for product_key in product_database.keys():
        product_embedding = model.encode(product_key, convert_to_tensor=True)
        
        # Calculate cosine similarity (0 to 1)
        similarity = util.pytorch_cos_sim(user_embedding, product_embedding).item()
        
        if similarity > best_score:
            best_score = similarity
            best_match = product_key
    
    # Return best match with confidence score
    return best_match, best_score