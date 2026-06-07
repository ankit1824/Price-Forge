from sentence_transformers import SentenceTransformer, util
import numpy as np
import threading
import socket

# Global model instance variables
_model = None
_fallback_mode = False
_is_loading = False

def load_model_in_background():
    """Load the model in a background thread to prevent blocking startup"""
    global _model, _fallback_mode, _is_loading
    if _model is not None or _is_loading:
        return
    
    _is_loading = True
    
    def load_task():
        global _model, _fallback_mode, _is_loading
        try:
            print("🚀 Starting SentenceTransformer model download/load in background...")
            # Set a socket timeout so huggingface downloads don't hang indefinitely
            socket.setdefaulttimeout(15.0)
            
            _model = SentenceTransformer('all-MiniLM-L6-v2')
            _fallback_mode = False
            print("✅ SentenceTransformer model loaded successfully in background!")
        except Exception as e:
            _model = None
            _fallback_mode = True
            print(f"⚠️ Warning: SentenceTransformer load failed ({str(e)}). Using offline fuzzy string-matching fallback.")
        finally:
            _is_loading = False

    thread = threading.Thread(target=load_task)
    thread.daemon = True
    thread.start()

def load_model():
    """Trigger the background loading process"""
    load_model_in_background()

def get_model():
    """Get the loaded model (returns None if not yet loaded)"""
    global _model
    return _model

def get_product_embedding(product_name: str):
    """Get embedding for a product name (returns None if model not loaded yet)"""
    model = get_model()
    if model is None:
        return None
    try:
        embedding = model.encode(product_name, convert_to_tensor=True)
        return embedding
    except Exception:
        return None

def find_best_match(user_input: str, user_embedding, product_database: dict):
    """
    Find the best matching product from database using embeddings or string-similarity fallback.
    If the model hasn't finished loading yet, it defaults to string-similarity instantly.
    """
    user_input_clean = user_input.lower().strip()
    model = get_model()
    
    # Check if we should use string-similarity fallback (model not loaded or failed)
    if model is None or user_embedding is None or _fallback_mode:
        import difflib
        choices = list(product_database.keys())
        matches = difflib.get_close_matches(user_input_clean, choices, n=1, cutoff=0.3)
        if matches:
            return matches[0], 0.8
        return user_input_clean, 0.0

    best_match = None
    best_score = 0
    
    # Calculate similarity with each product in database
    for product_key in product_database.keys():
        try:
            product_embedding = model.encode(product_key, convert_to_tensor=True)
            # Calculate cosine similarity (0 to 1)
            similarity = util.pytorch_cos_sim(user_embedding, product_embedding).item()
            
            if similarity > best_score:
                best_score = similarity
                best_match = product_key
        except Exception:
            continue
            
    return best_match if best_match else user_input_clean, best_score
