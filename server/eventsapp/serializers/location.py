from rest_framework import serializers

from server.regex import osm_type_id_regex 

from ..models import Location

class LocationSerializer(serializers.ModelSerializer): 
    osm_type_id = serializers.RegexField(regex=osm_type_id_regex)
    class Meta:
        model = Location
        fields = '__all__'

class LocationCoordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ["lat", "lon", "osm_type_id"]