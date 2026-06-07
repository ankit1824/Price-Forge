import logging
import sys
import os

# Ensure logs directory exists safely
handlers = [logging.StreamHandler(sys.stdout)]

try:
    os.makedirs('logs', exist_ok=True)
    file_handler = logging.FileHandler('logs/app.log')
    handlers.append(file_handler)
except Exception as e:
    print(f"⚠️ Warning: Could not create log file handler ({str(e)}). Logging to console only.")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=handlers
)

logger = logging.getLogger(__name__)

def get_logger(name):
    return logging.getLogger(name)

