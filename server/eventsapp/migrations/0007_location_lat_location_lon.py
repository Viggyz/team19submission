# Generated by Django 4.1.2 on 2022-11-21 19:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eventsapp', '0006_event_city_alter_event_location'),
    ]

    operations = [
        migrations.AddField(
            model_name='location',
            name='lat',
            field=models.FloatField(default=12.9732913),
        ),
        migrations.AddField(
            model_name='location',
            name='lon',
            field=models.FloatField(default=77.6404672),
        ),
    ]
