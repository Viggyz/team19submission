from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


from .views import * 

urlpatterns = [
    path('auth/login', TokenObtainPairView.as_view()),
    path('auth/refresh_token', TokenRefreshView.as_view()),
    path('auth/signup', SignUpAPIView.as_view()),

    path('locations/search', LocationSearchAPIView.as_view()),
    path('locations/<str:osm_id>', LocationDetailAPIView.as_view()),
    path('locations/<str:osm_id>/events', LocationEventListAPIView.as_view()),

    path('events', EventListAPIView.as_view()),
    path('events/<int:event_id>', EventDetailAPIView.as_view()),
    path('events/<int:event_id>/interested', EventIntrestAPIView.as_view()),

    path('user', UserDetailAPIView.as_view()),
    path('user/events/created', EventsCreatedAPIView.as_view()),
    path('user/events/interested', EventsInterestedAPIView.as_view()),
    
    path('search', SearchAPIView.as_view()),
]