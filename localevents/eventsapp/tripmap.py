import requests
from requests.exceptions import RequestException
from urllib.parse import urlencode

from decouple import config

BASE_API_URL = 'https://api.opentripmap.com/0.1/en/places'
KINDS = ['gardens_and_parks','sport']
RATE = 1
RESPONSE_FORMAT = 'json'

class TripPlacesAPI:
    @staticmethod
    def get_places(radius: int, lon: float, lat: float):
        query_params = {
            'radius': radius,
            'lon': lon,
            'lat': lat,
            'kinds': ','.join(KINDS),
            'rate': RATE,
            'format': RESPONSE_FORMAT,
            'apikey': config('TRIPMAP_APIKEY')
        }        
        url = f'{BASE_API_URL}/radius'
        response = requests.get(url, params=query_params, headers={'accept': 'application/json'})
        return response.json()

    @staticmethod
    def get_place(xid):
        query_params = {
            'apikey': config('TRIPMAP_APIKEY')
        }
        url = f'{BASE_API_URL}/xid/{xid}'
        response = requests.get(url, params=query_params, headers={'accept': 'application/json'})
        return response.json()