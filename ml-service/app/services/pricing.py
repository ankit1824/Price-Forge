"""
Best Deal Scoring Service
Calculates best deal considering price, delivery fee, and minimum order
"""
from app.utils.logger import get_logger

logger = get_logger(__name__)

class PricingService:
    @staticmethod
    def calculate_best_deal(matches, cart_items):
        """
        Calculate best deal for cart items
        
        Args:
            matches: Match results from matching service
            cart_items: List of {itemName, quantity}
        
        Returns:
            Dict with best platform and breakdown
        """
        try:
            platform_totals = {
                'blinkit': {'subtotal': 0, 'delivery': 0, 'eligible': True},
                'zepto': {'subtotal': 0, 'delivery': 0, 'eligible': True},
                'instamart': {'subtotal': 0, 'delivery': 0, 'eligible': True}
            }
            
            partial_availability = []
            
            # Calculate for each platform
            for match in matches:
                search_query = match['search_query']
                available_count = match['available_on']
                
                if available_count < 3:
                    partial_availability.append({
                        'itemName': search_query,
                        'availableOn': [p for p, data in match['platforms'].items() if data],
                        'availabilityCount': f"{available_count}/3"
                    })
                
                # Find corresponding cart item
                cart_item = next((c for c in cart_items if c['itemName'].lower() == search_query.lower()), None)
                if not cart_item:
                    continue
                
                quantity = cart_item['quantity']
                
                for platform, product_data in match['platforms'].items():
                    if product_data is None:
                        platform_totals[platform]['eligible'] = False
                        continue
                    
                    price = product_data['price']
                    delivery = PricingService._parse_delivery_fee(product_data['delivery'])
                    
                    platform_totals[platform]['subtotal'] += price * quantity
                    platform_totals[platform]['delivery'] = delivery
            
            # Calculate totals and find best deal
            results = {}
            best_deal = None
            min_total = float('inf')
            
            for platform, data in platform_totals.items():
                if not data['eligible']:
                    results[platform] = {
                        'subtotal': data['subtotal'],
                        'delivery': data['delivery'],
                        'total': 0,
                        'eligible': False,
                        'reason': 'Item not available on this platform'
                    }
                else:
                    total = data['subtotal'] + data['delivery']
                    results[platform] = {
                        'subtotal': data['subtotal'],
                        'delivery': data['delivery'],
                        'total': total,
                        'eligible': True
                    }
                    
                    if total < min_total:
                        min_total = total
                        best_deal = platform
            
            return {
                'platformResults': results,
                'bestDeal': best_deal,
                'partialAvailability': partial_availability,
                'disclaimer': 'Prices are fetched in real-time and may vary on actual apps'
            }

        except Exception as e:
            logger.error(f"Error calculating best deal: {e}")
            return {'error': str(e)}

    @staticmethod
    def _parse_delivery_fee(delivery_str):
        """Parse delivery fee from string"""
        try:
            if 'Free' in delivery_str or '0' in delivery_str:
                return 0
            
            import re
            numbers = re.findall(r'\d+', delivery_str)
            return int(numbers[0]) if numbers else 0
        except:
            return 0
