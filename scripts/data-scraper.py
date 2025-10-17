#!/usr/bin/env python3
"""
Autoilty Business Data Scraper
Aggregates automotive business data from public APIs (Google Places, Yelp)
Ethical scraping with rate limiting and compliance with terms of service
"""

import os
import sys
import time
import json
import requests
from datetime import datetime
from typing import List, Dict, Optional
from dotenv import load_dotenv
from pymongo import MongoClient
import logging
from ratelimit import limits, sleep_and_retry
from backoff import on_exception, expo
import validators

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/scraper.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Configuration
GOOGLE_API_KEY = os.getenv('GOOGLE_PLACES_API_KEY')
YELP_API_KEY = os.getenv('YELP_API_KEY')
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/autoilty-curator')
SCRAPE_DELAY = int(os.getenv('SCRAPE_DELAY_MS', 2000)) / 1000  # Convert to seconds

# Canadian provinces
PROVINCES = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT']

# Major Canadian cities
MAJOR_CITIES = [
    'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa',
    'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener', 'London', 'Victoria',
    'Halifax', 'Oshawa', 'Windsor', 'Saskatoon', 'Regina', 'Sherbrooke',
    'Barrie', 'St. John\'s', 'Kelowna', 'Abbotsford', 'Kingston', 'Trois-Rivières'
]

# Automotive business categories
BUSINESS_CATEGORIES = {
    'mechanics': ['auto repair', 'car mechanic', 'auto service'],
    'dealerships': ['car dealer', 'auto dealership', 'used car dealer'],
    'auto-parts': ['auto parts store', 'car parts'],
    'detailing': ['car detailing', 'auto detailing', 'car wash'],
    'performance-shops': ['performance auto shop', 'auto tuning'],
    'tire-centers': ['tire shop', 'tire dealer'],
    'ev-chargers': ['ev charging station', 'electric vehicle charging'],
    'body-shops': ['auto body shop', 'collision repair'],
    'oil-change': ['oil change', 'quick lube'],
    'glass-repair': ['auto glass repair', 'windshield repair'],
    'rust-proofing': ['rust proofing', 'undercoating']
}

class AutoiltyDataScraper:
    def __init__(self):
        """Initialize the scraper with API clients and database connection"""
        self.mongo_client = MongoClient(MONGODB_URI)
        self.db = self.mongo_client.get_database()
        self.businesses_collection = self.db['businesses']
        
        # API headers
        self.yelp_headers = {
            'Authorization': f'Bearer {YELP_API_KEY}'
        }
        
        logger.info("Scraper initialized successfully")
    
    @sleep_and_retry
    @limits(calls=100, period=60)  # Rate limit: 100 calls per minute
    @on_exception(expo, requests.exceptions.RequestException, max_tries=3)
    def _google_places_search(self, query: str, location: str) -> List[Dict]:
        """
        Search Google Places API for businesses
        Rate limited and with retry logic
        """
        if not GOOGLE_API_KEY:
            logger.warning("Google API key not configured")
            return []
        
        url = 'https://maps.googleapis.com/maps/api/place/textsearch/json'
        params = {
            'query': f'{query} in {location} Canada',
            'key': GOOGLE_API_KEY,
            'region': 'ca'
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get('status') == 'OK':
                logger.info(f"Google Places: Found {len(data.get('results', []))} results for '{query}' in {location}")
                return data.get('results', [])
            else:
                logger.warning(f"Google Places API returned status: {data.get('status')}")
                return []
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Google Places API error: {str(e)}")
            return []
    
    def _google_place_details(self, place_id: str) -> Optional[Dict]:
        """Get detailed information about a specific place"""
        if not GOOGLE_API_KEY:
            return None
        
        url = 'https://maps.googleapis.com/maps/api/place/details/json'
        params = {
            'place_id': place_id,
            'key': GOOGLE_API_KEY,
            'fields': 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,opening_hours,price_level,photos,reviews,geometry'
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get('status') == 'OK':
                return data.get('result')
            return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Google Place Details API error: {str(e)}")
            return None
    
    @sleep_and_retry
    @limits(calls=500, period=86400)  # Yelp daily limit: 500 calls
    @on_exception(expo, requests.exceptions.RequestException, max_tries=3)
    def _yelp_search(self, term: str, location: str) -> List[Dict]:
        """Search Yelp API for businesses"""
        if not YELP_API_KEY:
            logger.warning("Yelp API key not configured")
            return []
        
        url = 'https://api.yelp.com/v3/businesses/search'
        params = {
            'term': term,
            'location': f'{location}, Canada',
            'limit': 50,
            'categories': 'automotive'
        }
        
        try:
            response = requests.get(url, headers=self.yelp_headers, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            businesses = data.get('businesses', [])
            logger.info(f"Yelp: Found {len(businesses)} results for '{term}' in {location}")
            return businesses
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Yelp API error: {str(e)}")
            return []
    
    def _normalize_province(self, address_components: List[Dict]) -> Optional[str]:
        """Extract and normalize province code from Google address components"""
        for component in address_components:
            if 'administrative_area_level_1' in component.get('types', []):
                long_name = component.get('long_name', '')
                
                # Map full province names to codes
                province_map = {
                    'Alberta': 'AB', 'British Columbia': 'BC', 'Manitoba': 'MB',
                    'New Brunswick': 'NB', 'Newfoundland and Labrador': 'NL',
                    'Nova Scotia': 'NS', 'Northwest Territories': 'NT',
                    'Nunavut': 'NU', 'Ontario': 'ON', 'Prince Edward Island': 'PE',
                    'Quebec': 'QC', 'Saskatchewan': 'SK', 'Yukon': 'YT'
                }
                
                return province_map.get(long_name, component.get('short_name'))
        
        return None
    
    def _parse_google_business(self, place: Dict, details: Optional[Dict] = None) -> Dict:
        """Parse Google Places data into our business schema"""
        if details:
            place.update(details)
        
        # Extract address components
        address_components = place.get('address_components', [])
        geometry = place.get('geometry', {})
        location_data = geometry.get('location', {})
        
        # Parse address
        street = ""
        city = ""
        postal_code = ""
        
        for component in address_components:
            types = component.get('types', [])
            if 'street_number' in types:
                street = component.get('long_name', '') + " "
            elif 'route' in types:
                street += component.get('long_name', '')
            elif 'locality' in types:
                city = component.get('long_name', '')
            elif 'postal_code' in types:
                postal_code = component.get('long_name', '')
        
        province = self._normalize_province(address_components)
        
        # Parse business hours
        hours = {}
        opening_hours = place.get('opening_hours', {})
        if opening_hours and 'periods' in opening_hours:
            days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
            for period in opening_hours['periods']:
                day = days[period.get('open', {}).get('day', 0)]
                open_time = period.get('open', {}).get('time', 'N/A')
                close_time = period.get('close', {}).get('time', 'N/A')
                
                if open_time != 'N/A' and close_time != 'N/A':
                    hours[day] = {
                        'open': f"{open_time[:2]}:{open_time[2:]}",
                        'close': f"{close_time[:2]}:{close_time[2:]}",
                        'closed': False
                    }
        
        # Parse reviews
        reviews = []
        for review in place.get('reviews', [])[:5]:  # Top 5 reviews
            reviews.append({
                'source': 'google',
                'rating': review.get('rating', 0),
                'text': review.get('text', ''),
                'author': review.get('author_name', 'Anonymous'),
                'date': datetime.fromtimestamp(review.get('time', 0)),
                'verified': True
            })
        
        # Build business document
        business = {
            'name': place.get('name'),
            'category': self._determine_category(place.get('types', [])),
            'description': '',
            'location': {
                'address': {
                    'street': street.strip(),
                    'city': city,
                    'province': province,
                    'postalCode': postal_code,
                    'country': 'Canada'
                },
                'coordinates': {
                    'type': 'Point',
                    'coordinates': [
                        location_data.get('lng', 0),
                        location_data.get('lat', 0)
                    ]
                }
            },
            'contact': {
                'phone': place.get('formatted_phone_number', ''),
                'website': place.get('website', '')
            },
            'hours': hours,
            'priceRange': '$' * (place.get('price_level', 2)),
            'reviews': reviews,
            'aggregateRating': {
                'average': place.get('rating', 0),
                'count': place.get('user_ratings_total', 0)
            },
            'externalIds': {
                'googlePlaceId': place.get('place_id')
            },
            'status': 'pending',
            'lastScraped': datetime.utcnow()
        }
        
        return business
    
    def _parse_yelp_business(self, business: Dict) -> Dict:
        """Parse Yelp data into our business schema"""
        location = business.get('location', {})
        coordinates = business.get('coordinates', {})
        
        # Map Yelp categories to our categories
        yelp_categories = [cat['alias'] for cat in business.get('categories', [])]
        category = self._determine_category(yelp_categories)
        
        return {
            'name': business.get('name'),
            'category': category,
            'description': '',
            'location': {
                'address': {
                    'street': location.get('address1', ''),
                    'city': location.get('city', ''),
                    'province': location.get('state', ''),
                    'postalCode': location.get('zip_code', ''),
                    'country': 'Canada'
                },
                'coordinates': {
                    'type': 'Point',
                    'coordinates': [
                        coordinates.get('longitude', 0),
                        coordinates.get('latitude', 0)
                    ]
                }
            },
            'contact': {
                'phone': business.get('phone', ''),
                'website': business.get('url', '')
            },
            'priceRange': business.get('price', '$$'),
            'aggregateRating': {
                'average': business.get('rating', 0),
                'count': business.get('review_count', 0)
            },
            'externalIds': {
                'yelpId': business.get('id')
            },
            'status': 'pending',
            'lastScraped': datetime.utcnow()
        }
    
    def _determine_category(self, types: List[str]) -> str:
        """Determine business category from Google types or Yelp categories"""
        type_str = ' '.join(types).lower()
        
        if any(x in type_str for x in ['car_dealer', 'dealer']):
            return 'dealerships'
        elif any(x in type_str for x in ['car_repair', 'mechanic', 'auto_repair']):
            return 'mechanics'
        elif any(x in type_str for x in ['auto_parts', 'autoparts']):
            return 'auto-parts'
        elif any(x in type_str for x in ['car_wash', 'detailing']):
            return 'detailing'
        elif any(x in type_str for x in ['tire', 'tires']):
            return 'tire-centers'
        elif any(x in type_str for x in ['charging', 'ev']):
            return 'ev-chargers'
        elif any(x in type_str for x in ['body_shop', 'collision']):
            return 'body-shops'
        elif any(x in type_str for x in ['oil_change', 'lube']):
            return 'oil-change'
        else:
            return 'mechanics'  # Default category
    
    def _business_exists(self, name: str, city: str) -> bool:
        """Check if business already exists in database"""
        return self.businesses_collection.find_one({
            'name': name,
            'location.address.city': city
        }) is not None
    
    def save_business(self, business_data: Dict) -> bool:
        """Save or update business in MongoDB"""
        try:
            # Validate required fields
            if not business_data.get('name') or not business_data.get('location', {}).get('address', {}).get('city'):
                logger.warning("Skipping business with missing required fields")
                return False
            
            # Check if already exists
            if self._business_exists(business_data['name'], business_data['location']['address']['city']):
                logger.info(f"Business already exists: {business_data['name']}")
                return False
            
            # Insert business
            self.businesses_collection.insert_one(business_data)
            logger.info(f"✓ Saved: {business_data['name']} - {business_data['location']['address']['city']}")
            return True
            
        except Exception as e:
            logger.error(f"Error saving business: {str(e)}")
            return False
    
    def scrape_city(self, city: str, max_per_category: int = 20) -> int:
        """Scrape businesses for a specific city"""
        logger.info(f"\n{'='*60}\nScraping businesses in {city}\n{'='*60}")
        
        total_saved = 0
        
        for category, search_terms in BUSINESS_CATEGORIES.items():
            logger.info(f"\n--- Category: {category} ---")
            
            for term in search_terms:
                # Google Places search
                google_results = self._google_places_search(term, city)
                time.sleep(SCRAPE_DELAY)
                
                for place in google_results[:max_per_category]:
                    # Get detailed information
                    details = self._google_place_details(place['place_id'])
                    time.sleep(SCRAPE_DELAY)
                    
                    business = self._parse_google_business(place, details)
                    if self.save_business(business):
                        total_saved += 1
                
                # Yelp search
                yelp_results = self._yelp_search(term, city)
                time.sleep(SCRAPE_DELAY)
                
                for yelp_business in yelp_results[:max_per_category]:
                    business = self._parse_yelp_business(yelp_business)
                    if self.save_business(business):
                        total_saved += 1
        
        logger.info(f"\n✓ Completed {city}: {total_saved} new businesses added")
        return total_saved
    
    def scrape_all_cities(self, cities: List[str] = MAJOR_CITIES):
        """Scrape all specified cities"""
        logger.info(f"\n{'#'*60}\nStarting full scraping operation\nTarget cities: {len(cities)}\n{'#'*60}\n")
        
        start_time = time.time()
        total_businesses = 0
        
        for city in cities:
            try:
                count = self.scrape_city(city)
                total_businesses += count
                
                # Rate limiting between cities
                time.sleep(SCRAPE_DELAY * 5)
                
            except Exception as e:
                logger.error(f"Error scraping {city}: {str(e)}")
                continue
        
        elapsed = time.time() - start_time
        logger.info(f"\n{'#'*60}\nScraping completed!\nTotal businesses added: {total_businesses}\nTime elapsed: {elapsed/60:.2f} minutes\n{'#'*60}")
    
    def close(self):
        """Close database connection"""
        self.mongo_client.close()
        logger.info("Scraper closed")

def main():
    """Main execution function"""
    scraper = AutoiltyDataScraper()
    
    try:
        # Option 1: Scrape all major cities (comprehensive)
        # scraper.scrape_all_cities()
        
        # Option 2: Scrape specific cities (for testing)
        test_cities = ['Toronto', 'Vancouver', 'Montreal', 'Calgary']
        scraper.scrape_all_cities(test_cities)
        
    except KeyboardInterrupt:
        logger.info("\nScraping interrupted by user")
    except Exception as e:
        logger.error(f"Fatal error: {str(e)}")
    finally:
        scraper.close()

if __name__ == '__main__':
    main()


