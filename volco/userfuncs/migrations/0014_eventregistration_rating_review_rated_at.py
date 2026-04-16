# Generated manually for rating system

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userfuncs', '0013_alter_events_end_datetime_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventregistration',
            name='rating',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='eventregistration',
            name='review',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='eventregistration',
            name='rated_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
