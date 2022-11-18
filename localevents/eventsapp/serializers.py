from django.db import transaction
from django.contrib.auth.models import User

from rest_framework import serializers

from localevents.regex import osm_type_id_regex

from .models import Location, Event

class LocationListSerializer(serializers.Serializer):
    # xid = serializers.CharField()
    # name = serializers.CharField(allow_null=True)
    kinds = serializers.CharField()
    rate = serializers.IntegerField()
    dist = serializers.FloatField()
    point = serializers.JSONField()

class LocationSerializer(serializers.ModelSerializer): 
    osm_type_id = serializers.RegexField(regex=osm_type_id_regex)
    class Meta:
        model = Location
        fields = '__all__'

class EventListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class EventSerializer(serializers.Serializer):
    name = serializers.CharField()
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    description = serializers.CharField(max_length=512)
    max_people = serializers.IntegerField(max_value=12, min_value=1)
    created_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    location = LocationSerializer(write_only=True)
    
    def create(self, validated_data):
        location = None
        location_details = validated_data.pop('location')
        try:
            location = Location.objects.get(osm_type_id=location_details.osm_type_id)
        except Location.DoesNotExist: 
            location = None
            # TODO Prob a try catch
        with transaction.atomic():
            if not location:
                location = Location.objects.create(**location_details)
            event = Event.objects.create(**validated_data, location=location)
        return event
        

    def validate(self, data):
        if data["end_time"] > data["start_time"]:
            raise serializers.ValidationError("An event cannot end before it begins")
        return data

class SignUpSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, min_length=4, write_only=True)
    email = serializers.EmailField(required=True,write_only=True)
    password = serializers.CharField(required=True, min_length=6, max_length=16, write_only=True)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
