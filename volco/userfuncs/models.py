from django.db import models
from django.contrib.auth.models import AbstractUser,BaseUserManager
import datetime
from auther.models import customUser
from django.utils.text import slugify
from django.utils import timezone

class events(models.Model):
    eventid = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    start_datetime = models.DateTimeField(default=timezone.now)
    end_datetime = models.DateTimeField(default=timezone.now)
    organization = models.ForeignKey(customUser,on_delete=models.CASCADE,null=True,related_name='events')
    location = models.CharField(
    choices=[('Kalyani Nagar','Kalyani Nagar'),
    ('Hinjewadi','Hinjewadi'),
    ('Shaniwar Peth','Shaniwar Peth'),
    ('Koregaon Park','Koregaon Park'),
    ('Pashan','Pashan'),
    ('Sadashiv Peth','Sadashiv Peth')
    ],
    blank=True,
    null=False,
    default="Pune",    # remove null=True
    max_length=500
    )

    address = models.TextField(blank=True, null=True)
    hours= models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    volunteers_needed = models.IntegerField(blank=True, null=True)
    volunteers_registered = models.IntegerField(blank=True, null=True)
    causes=[('Education','Education'),('Environment','Environment'),('Health','Health'),('Community Development','Community Development'),('Animal Welfare','Animal Welfare'),('Arts and Culture','Arts and Culture')]
    causes = models.JSONField(default=list, blank=True)
    skills = models.JSONField(default=list, blank=True)
    skill=[('Programming','Programming'),('Teaching','Teaching'),('Fundraising','Fundraising'),('Event Planning','Event Planning'),('Social Media','Social Media'),('Photography','Photography'),('Public Speaking','Public Speaking')]
    impact=[('Low','Low'),('Medium','Medium'),('High','High'),('Very High','Very High')]
    impact = models.CharField(choices=impact, max_length=100, blank=True,null=True)
    status=[('Upcoming','Upcoming'),('Ongoing','Ongoing'),('Completed','Completed'),('Cancelled','Cancelled')]
    status = models.CharField(max_length=20, choices=status, default='Upcoming')

class EventRegistration(models.Model):
    user = models.ForeignKey(customUser, on_delete=models.CASCADE, related_name='registrations')
    event = models.ForeignKey(events, on_delete=models.CASCADE, related_name='registrations')
    registered_at = models.DateTimeField(auto_now_add=True)
    statuses=[('Registered','Registered'),('Cancelled','Cancelled'),('Completed','Completed')]
    
    status = models.CharField(max_length=20, choices=statuses)  # Registered, Cancelled, Completed
    rating = models.IntegerField(null=True, blank=True)  # 1-5 star rating
    review = models.TextField(null=True, blank=True)  # Optional review text
    rated_at = models.DateTimeField(null=True, blank=True)  # When rating was given

    class Meta:
        unique_together = ('user', 'event')  # prevent duplicate registration

    def __str__(self):
        return f"{self.user.username} -> {self.event.title}"


  
# Create your models here.
