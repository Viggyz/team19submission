from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework import status

from .tripmap import TripPlacesAPI
from .serializers import LocationListSerializer

class LocationsAPIView(APIView):
    def get(self, request):
        if not request.query_params.get('lon') and request.query_params.get('lat'):
            return Response({'message': 'Latitude and longitude need to be passed as query params'}, status.HTTP_400_BAD_REQUEST)
        response_json = TripPlacesAPI.get_places(10000, request.query_params.get('lon'), request.query_params.get('lat'))
        serializer = LocationListSerializer(data=sorted(response_json, key=lambda loc: loc['dist']), many=True)
        if serializer.is_valid():
            return Response(serializer.data, status.HTTP_200_OK)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
