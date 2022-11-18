from django.contrib.auth import login

from rest_framework.views import APIView 
from rest_framework.response import Response 
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework import status, permissions
from knox.views import LoginView as KnoxLoginView
from knox.auth import TokenAuthentication

from .geoservice import GeoServiceClient
from .serializers import (
    EventListSerializer,
    EventSerializer,
    LocationListSerializer, 
    LocationSerializer,
    SignUpSerializer, 
)
from .models import Location

class SearchAPIView(APIView):
    def get(self, request):
        if query := request.query_params.get('q', None):
            response_json = GeoServiceClient.autocomplete(query)
            print(response_json)
            return Response(response_json)
        return Response({'message': 'Search term must be provided'}, status.HTTP_400_BAD_REQUEST)

class LocationsAPIView(APIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (permissions.IsAuthenticated,)
    def get(self, request):
        if (longitude := request.query_params.get('lon', None)) and (latitude := request.query_params.get('lat', None)):
            response_json = GeoServiceClient.get_places(30000, longitude, latitude)
            return Response(response_json)
        return Response({'message': 'Latitude and longitude need to be passed as query params'}, status.HTTP_400_BAD_REQUEST)
        
class LocationAPIView(APIView):
    def get(self, request, osm_id):
        location = None
        try:
            location = Location.objects.get(osm_type_id=osm_id)
            serializer = LocationSerializer(location)
            return Response(serializer.data)
        except Location.DoesNotExist:
            return Response({'data': {}}, status.HTTP_404_NOT_FOUND)

class LocationEventsAPIView(APIView):
    def get(self, request, osm_id):
        qs = Location.objects.get(osm_type_id=osm_id).events.all()
        serializer = EventListSerializer(qs, many=True)
        return Response(serializer.data)


    def post(self, request, osm_id):
        request.data.update({
            'location_osm_id': osm_id,
            'created_by': request.user
        })
        serializer = LocationEvents(request.data)
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status.HTTP_201_CREATED)
        return Response(serializer.errors)
            
class SignUpAPIView(APIView):
    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            
            return Response({"message": "User successfully created"}, status.HTTP_201_CREATED)
        return Response(serializer.errors)
        
class LoginView(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginView, self).post(request, format=None)

