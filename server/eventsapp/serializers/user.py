from django.db import IntegrityError

from rest_framework import serializers
from rest_framework.exceptions import APIException

from ..models import User, UserProfile

class UserSerializer(serializers.ModelSerializer):
    contact_no = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "contact_no"
        ]
    
    def get_contact_no(self, instance):
        return instance.profile.contact_no

class SignUpSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, min_length=4, write_only=True)
    email = serializers.EmailField(required=True,write_only=True)
    password = serializers.CharField(required=True, min_length=6, max_length=16, write_only=True)
    contact_no = serializers.CharField(required=True,max_length=10, min_length=10, write_only=True)

    user = UserSerializer(read_only=True)

    def create(self, validated_data):
        try:
            contact_no = validated_data.pop('contact_no')
            user = User.objects.create_user(**validated_data)
            UserProfile.objects.create(user=user, contact_no=contact_no)
            return {'user': user}
        except IntegrityError:
            raise APIException(detail="Username already exists")
    