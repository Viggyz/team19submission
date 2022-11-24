import requests
from requests.exceptions import RequestException

from decouple import config

BASE_API_URL = 'https://eu1.locationiq.com/v1'
TAGS = [
    # 'park',
    # 'stadium',
    'amenity:community_centre',
    
    'leisure:park',
    'leisure:sports_centre',
    'leisure:swimming_area',
    'leisure:swimming',
    'leisure:playground',
    'leisure:dog_park',
    # 'leisure:hackerspace',

    ]
RESPONSE_FORMAT = 'json'
PLACE_TYPES = [
    'city',
    'borough', 
    'suburb', 
    'quarter', 
    'neighbourhood',
]

class GeoServiceClient:
    @staticmethod
    def get(endpoint, query_params):
        url = f'{BASE_API_URL}/{endpoint}'
        query_params.update({
            'key': config('GEOSERVICE_APIKEY'),
        })
        response = requests.get(url, params=query_params, headers={'accept': 'application/json'})
        response.raise_for_status()
        return response.json()
    
    @staticmethod
    def get_places(radius: int, lon: float, lat: float):
        query_params = {
            'radius': radius,
            'lon': lon,
            'lat': lat,
            
            'tag': ','.join(TAGS),

            'format': RESPONSE_FORMAT,
            'limit': '35',
        }        
        return GeoServiceClient.get('nearby', query_params)

    @staticmethod
    def autocomplete(query):
        query_params = {
            'q': query,

            'countrycodes': 'in',
            'tag': 'place:*,highway:*',
            'addressdetails': 1,
            
            'dedupe': 1,
            'limit': '5',
            'format': RESPONSE_FORMAT,
        }
        return GeoServiceClient.get('autocomplete', query_params)

    @staticmethod
    def reverse_geocode(lat, lon):
        query_params = {
            'lon': lon,
            'lat': lat,

            'format': RESPONSE_FORMAT,
        }
        return GeoServiceClient.get('reverse', query_params)