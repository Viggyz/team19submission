from django.urls import path

from knox.views import LogoutView

from .views import * 

urlpatterns = [
    path('auth/login', LoginView.as_view()),
    path('auth/logout', LogoutView.as_view()),
    path('auth/signup', SignUpAPIView.as_view()),

    path('locations', LocationsAPIView.as_view()),
    path('search', SearchAPIView.as_view()),
]