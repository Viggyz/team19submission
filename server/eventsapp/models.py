from django.db import models
from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save

from server.regex import osm_type_id_regex

class Location(models.Model):
    osm_type_id = models.CharField(
        max_length=11, 
        unique=True, 
        db_index=True,
        validators=[
            RegexValidator(osm_type_id_regex)
        ]
    )
    name = models.CharField(max_length=255)
    place = models.CharField(max_length=255)
    address = models.JSONField()
    lat = models.FloatField(default=12.9732913)
    lon = models.FloatField(default=77.6404672)
    # description = models.TextField()

class Event(models.Model):
    name = models.CharField(max_length=255)
    location = models.ForeignKey('Location', on_delete=models.CASCADE, related_name="events")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_events')
    
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(blank=True, null=True)
    
    description = models.TextField(blank=True, null=True)
    # image = models.FileField()
    
    interested = models.ManyToManyField(
        User,
        related_name='interested_events'
    ) 
    max_people = models.IntegerField()
    current_people = models.IntegerField(default=0)

    city = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(current_people__lt=models.F("max_people")),
                name="Current people already in are less than max"
            ),
            models.CheckConstraint(
                check=models.Q(end_time__gt=models.F("start_time")),
                name="End time must be less than start time"
            ),
            models.CheckConstraint(
                check=(models.Q(max_people__gte=1) & models.Q(max_people__lte=12)),
                name="Max people for an event can only be upto 11"
            ),  
        ]
    
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    contact_no = models.CharField(max_length=10, default=None)