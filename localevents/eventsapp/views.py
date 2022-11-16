from django.contrib.auth import login

from rest_framework.views import APIView 
from rest_framework.response import Response 
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework import status, permissions
from knox.views import LoginView as KnoxLoginView
from knox.auth import TokenAuthentication

from .tripmap import TripPlacesAPI
from .serializers import LocationListSerializer, SignUpSerializer

class LocationsAPIView(APIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (permissions.IsAuthenticated,)
    def get(self, request):
        if not request.query_params.get('lon') and request.query_params.get('lat'):
            return Response({'message': 'Latitude and longitude need to be passed as query params'}, status.HTTP_400_BAD_REQUEST)
        response_json = TripPlacesAPI.get_places(10000, request.query_params.get('lon'), request.query_params.get('lat'))
        serializer = LocationListSerializer(data=sorted(response_json, key=lambda loc: loc['dist']), many=True)
        if serializer.is_valid():
            return Response(serializer.data, status.HTTP_200_OK)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        
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

