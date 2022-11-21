from django.contrib.auth.models import User
from django.db import transaction, IntegrityError
from django.utils import timezone

from rest_framework.exceptions import PermissionDenied, APIException
from rest_framework import serializers

from localevents.regex import osm_type_id_regex

from .models import Location, Event

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "email"
        ]

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

class LocationCoordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ["lat", "lon", "osm_type_id"]
class EventListSerializer(serializers.ModelSerializer):
    location = LocationCoordsSerializer()

    class Meta:
        model = Event
        fields = [
            'id',
            'name',
            'start_time',
            'end_time',
            'description',
            'max_people',
            'current_people',
            'location'
        ]

class EventSerializer(serializers.Serializer):
    name = serializers.CharField()
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    description = serializers.CharField(max_length=512)
    max_people = serializers.IntegerField(max_value=12, min_value=1)
    requesting_user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    interested = UserSerializer(read_only=True, many=True)
    current_people = serializers.IntegerField(read_only=True)
    created_by = UserSerializer(read_only=True)
    location = LocationSerializer()
    
    def create(self, validated_data):
        current_user = validated_data.pop('requesting_user')
        location = None
        location_details = validated_data.pop('location')
        try:
            location = Location.objects.get(osm_type_id=location_details['osm_type_id'])
        except Location.DoesNotExist: 
            location = None
        try:
            with transaction.atomic():
                if not location:
                    location = Location.objects.create(**location_details)
                event = Event.objects.create(
                    **validated_data, 
                    location=location,
                    created_by=current_user,
                    city=location_details['address'].get('city', None)
                )
        except IntegrityError:
            raise APIException(detail="Unable to create event")
        return event
        
    def update(self, instance: Event, validated_data: dict):
        current_user = validated_data.pop('requesting_user')
        if instance.created_by != current_user:
            raise PermissionDenied()
        fields = (
            "name",
            "start_time",
            "end_time",
            "description",
            "max_people",
        )
        instance.name = validated_data['name']
        instance.start_time = validated_data['start_time']
        instance.end_time = validated_data['end_time']
        instance.description = validated_data['description']
        instance.max_people = validated_data['max_people']
        instance.save(update_fields=fields)
        return instance

    
    def validate(self, data):
        now = timezone.now()
        if data["start_time"] < now:
            raise serializers.ValidationError("Cannot pass a datetime that has already passed")
        if data["end_time"] < data["start_time"]:
            raise serializers.ValidationError("An event cannot end before it begins")
        return data
    
class EventInterestSerializer(serializers.Serializer):
    event_id = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all(), write_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    event = EventSerializer(read_only=True)

    def create(self, validated_data):
        event: Event = validated_data['event_id']
        event.interested.add(validated_data['user'])
        return {
            'event': event
        }

    def validate(self, data):
        if data['user'] == data['event_id'].created_by:
            raise serializers.ValidationError('Cannot show intrest in an your own event')
        if data['user'] in data['event_id'].interested.all():
            raise serializers.ValidationError('Already added to interested')
        return data

class SignUpSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, min_length=4, write_only=True)
    email = serializers.EmailField(required=True,write_only=True)
    password = serializers.CharField(required=True, min_length=6, max_length=16, write_only=True)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
