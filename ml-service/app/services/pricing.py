"""
Best Deal Scoring Service
Calculates best deal considering price, delivery fee, availability, and minimum order
"""
from app.utils.logger import get_logger

logger = get_logger(__name__)

class PricingService:
    @staticmethod
    def calculate_best_deal(results_items):
        """
        Calculate best deal across platforms for the searched items.
        
        Args:
            results_items: List of search results from backend. Each item has:
                - name: original search name
                - quantity: requested quantity
                - prices: dict of platform -> price details
                - availability: dict of platform -> boolean
        
        Returns:
            Dict with platform totals, best platform, and missing items details.
        """
        try:
            platforms = ['blinkit', 'zepto', 'instamart']
            platform_totals = {
                p: {
                    'subtotal': 0.0,
                    'deliveryFee': 0.0,
                    'total': 0.0,
                    'availableCount': 0,
                    'totalCount': len(results_items),
                    'missingItems': [],
                    'eligible': False
                } for p in platforms
            }
            
            # Sum up prices for each platform
            for item in results_items:
                item_name = item.get('name', 'Unknown Item')
                qty = item.get('quantity', 1)
                prices = item.get('prices', {})
                availability = item.get('availability', {})
                
                for platform in platforms:
                    p_data = prices.get(platform)
                    is_avail = availability.get(platform, False)
                    
                    if is_avail and p_data and p_data.get('price') is not None:
                        price = float(p_data.get('price', 0))
                        platform_totals[platform]['subtotal'] += price * qty
                        platform_totals[platform]['availableCount'] += 1
                        
                        # Use the highest delivery fee scraped or a default
                        fee = float(p_data.get('deliveryFee', 0))
                        if fee > platform_totals[platform]['deliveryFee']:
                            platform_totals[platform]['deliveryFee'] = fee
                    else:
                        platform_totals[platform]['missingItems'].append(item_name)
            
            # Apply default delivery fees if subtotal is greater than 0 but delivery fee is 0
            # (since delivery fees are sometimes dynamic and not easily scraped)
            defaults = {'blinkit': 15.0, 'zepto': 20.0, 'instamart': 19.0}
            min_orders = {'blinkit': 99.0, 'zepto': 99.0, 'instamart': 99.0}
            
            for platform in platforms:
                data = platform_totals[platform]
                if data['availableCount'] > 0:
                    data['eligible'] = True
                    # If subtotal is less than minimum order, add small surcharge or default delivery fee
                    if data['subtotal'] < min_orders[platform]:
                        data['deliveryFee'] = max(data['deliveryFee'], defaults[platform] + 10.0)
                    elif data['deliveryFee'] == 0:
                        data['deliveryFee'] = defaults[platform]
                    
                    data['total'] = round(data['subtotal'] + data['deliveryFee'], 2)
                    data['subtotal'] = round(data['subtotal'], 2)
                    data['deliveryFee'] = round(data['deliveryFee'], 2)
            
            # Find the best deal
            # Criteria:
            # 1. Maximum availableCount (we want the most items available)
            # 2. Minimum total price (lowest cost for the items that are available)
            best_deal = None
            max_available = 0
            min_total = float('inf')
            
            for platform in platforms:
                data = platform_totals[platform]
                if not data['eligible']:
                    continue
                
                # Compare availability first
                if data['availableCount'] > max_available:
                    max_available = data['availableCount']
                    min_total = data['total']
                    best_deal = platform
                elif data['availableCount'] == max_available:
                    # If same availability, compare price
                    if data['total'] < min_total:
                        min_total = data['total']
                        best_deal = platform
            
            return {
                'platformResults': platform_totals,
                'bestDeal': best_deal,
                'totalSearchedItems': len(results_items),
                'disclaimer': 'Prices are fetched in real-time and may vary on actual apps. Accuracy margin: ±2 rupees'
            }

        except Exception as e:
            logger.error(f"Error calculating best deal: {e}")
            return {'error': str(e)}

