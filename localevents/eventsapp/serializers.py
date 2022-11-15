from rest_framework import serializers

class LocationListSerializer(serializers.Serializer):
    xid = serializers.CharField()
    # name = serializers.CharField(allow_null=True)
    kinds = serializers.CharField()
    rate = serializers.IntegerField()
    dist = serializers.FloatField()
    point = serializers.JSONField()