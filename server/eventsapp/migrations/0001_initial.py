# Generated by Django 4.1.2 on 2022-11-18 14:58

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('osm_type_id', models.CharField(db_index=True, max_length=11, unique=True, validators=[django.core.validators.RegexValidator('^[WNP][0-9]{,10}$')])),
                ('name', models.CharField(max_length=255)),
                ('place', models.CharField(max_length=255)),
                ('address', models.JSONField()),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Events',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField()),
                ('description', models.TextField(blank=True, null=True)),
                ('max_people', models.IntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(12)])),
                ('current_people', models.IntegerField(default=0)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_events', to=settings.AUTH_USER_MODEL)),
                ('interested', models.ManyToManyField(related_name='interested_events', to=settings.AUTH_USER_MODEL)),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='eventsapp.location')),
            ],
        ),
        migrations.AddConstraint(
            model_name='events',
            constraint=models.CheckConstraint(check=models.Q(('current_people__lt', models.F('max_people'))), name='Current people already in are less than max'),
        ),
        migrations.AddConstraint(
            model_name='events',
            constraint=models.CheckConstraint(check=models.Q(('end_time__gt', models.F('start_time'))), name='End time must be less than start time'),
        ),
    ]
