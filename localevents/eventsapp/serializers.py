from django.contrib.auth.models import User

from rest_framework import serializers

class LocationListSerializer(serializers.Serializer):
    xid = serializers.CharField()
    # name = serializers.CharField(allow_null=True)
    kinds = serializers.CharField()
    rate = serializers.IntegerField()
    dist = serializers.FloatField()
    point = serializers.JSONField()

class SignUpSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, min_length=4, write_only=True)
    email = serializers.EmailField(required=True,write_only=True)
    password = serializers.CharField(required=True, min_length=6, max_length=16, write_only=True)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user