from requests import HTTPError

from django.contrib.auth.models import User
from django.utils import timezone

from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.response import Response 
from rest_framework.views import APIView
from rest_framework import status, permissions

from .geoservice import GeoServiceClient
from .serializers import (
    EventListSerializer,
    EventInterestSerializer,
    EventSerializer,
    LocationListSerializer, 
    LocationSerializer,
    SignUpSerializer, 
)
from .models import Location, Event

class SearchAPIView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def get(self, request):
        if query := request.query_params.get('q', None):
            try: 
                response_json = GeoServiceClient.autocomplete(query)
                return Response(response_json)
            except HTTPError as HE:
                if (HE.response.status_code == 404):
                    return Response([])
                elif HE.response.status_code == 429 and HE.response.reason == "Rate Limited Day":
                    return Response({'details': 'Try again in 24 hours'}, status.HTTP_503_SERVICE_UNAVAILABLE)
                elif HE.response.status_code == 429:
                    return Response({'details': 'Try again in a few seconds'}, status.HTTP_429_TOO_MANY_REQUESTS)
        return Response({'message': 'Search term must be provided'}, status.HTTP_400_BAD_REQUEST)

class LocationListAPIView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        if (longitude := request.query_params.get('lon', None)) and (latitude := request.query_params.get('lat', None)):
            try:
                response_json = GeoServiceClient.get_places(30000, longitude, latitude)
                return Response(response_json)
            except HTTPError as HE:
                if (HE.response.status_code == 404):
                    return Response([])
                elif HE.response.status_code == 429 and HE.response.reason == "Rate Limited Day":
                    return Response({'details': 'Try again in 24 hours'}, status.HTTP_503_SERVICE_UNAVAILABLE)
                elif HE.response.status_code == 429:
                    return Response({'details': 'Try again in a few seconds'}, status.HTTP_429_TOO_MANY_REQUESTS)
        return Response({'message': 'Latitude and longitude need to be passed as query params'}, status.HTTP_400_BAD_REQUEST)

# class Events Mine 
class LocationDetailAPIView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, osm_id):
        location = None
        try:
            location = Location.objects.get(osm_type_id=osm_id)
            serializer = LocationSerializer(location)
            return Response(serializer.data)
        except Location.DoesNotExist:
            raise NotFound()
        
class LocationEventListAPIView(APIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get(self, request, osm_id):
        try:
            qs = Location.objects \
                .get(osm_type_id=osm_id) \
                .events \
                .filter(start_time__gt=timezone.now()) \
                .order_by('start_time')[:10]
            serializer = EventListSerializer(qs, many=True)
            return Response(serializer.data)
        except Location.DoesNotExist:
            return Response([], status.HTTP_200_OK)

    def post(self, request, osm_id):
        request.data['created_by'] = request.user.id
        serializer = EventSerializer(data=request.data, context = {'request': request})
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status.HTTP_201_CREATED)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

class EventListAPIView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        qs = Event.objects.filter(start_time__gt=timezone.now())
        if city := request.query_params.get('city', None):
            qs = (
                qs.filter(city__iexact=city)
                if qs.filter(city__iexact=city).exists()
                else qs
            )
        serializer = EventListSerializer(qs, many=True)
        return Response(serializer.data)

class EventDetailAPIView(APIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get(self, request, event_id):
        try:
            instance = Event.objects.get(pk=event_id)
            serializer = EventSerializer(instance, context={'request': request})
            return Response(serializer.data)
        except Event.DoesNotExist:
            return Response({'detail': 'Invalid event_id passed'}, status.HTTP_400_BAD_REQUEST)
            
    def put(self, request, event_id):
        try:
            instance = Event.objects.get(pk=event_id)
            serializer = EventSerializer(instance, data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors)
        except Event.DoesNotExist:
            return Response({'detail': 'Invalid event_id passed'}, status.HTTP_400_BAD_REQUEST)

    def delete(self, request, event_id):
        try:
            instance = Event.objects.get(pk=event_id)
            if instance.created_by == request.user:
                instance.delete()
                return Response({}, status.HTTP_204_NO_CONTENT)
            raise PermissionDenied()
        except Event.DoesNotExist:
            return Response({'detail': 'Invalid event_id passed'}, status.HTTP_400_BAD_REQUEST)

class EventIntrestAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, event_id):
        serializer = EventInterestSerializer(
            data={'event_id': event_id},
            context={'request': request},
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_201_CREATED)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

    def delete(self, request, event_id):
        try:
            instance = Event.objects.get(pk=event_id)
            if (instance.created_by == request.user):
                raise PermissionDenied()
            instance.interested.remove(request.user)
            return Response({}, status.HTTP_204_NO_CONTENT)
        except Event.DoesNotExist:
            return Response({'detail': 'Invalid event_id passed'}, status.HTTP_400_BAD_REQUEST)

class EventsCreatedAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request):
        qs = request.user.created_events.all()[:10]
        serializer = EventListSerializer(qs, many=True)
        return Response(serializer.data)

class EventsInterestedAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request):
        qs = request.user.interested_events.all()[:10]
        serializer = EventListSerializer(qs, many=True)
        return Response(serializer.data)

class SignUpAPIView(APIView):
    permission_classes = (permissions.AllowAny, )
    
    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            
            return Response({"message": "User successfully created"}, status.HTTP_201_CREATED)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
