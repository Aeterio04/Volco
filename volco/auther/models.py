from django.db import models
from django.contrib.auth.models import AbstractUser,BaseUserManager
import datetime
from django.utils.text import slugify


class customUser(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, blank=True, null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    slug = models.SlugField(blank=True, null=False, unique=False,default='def')  # or just blank=True
    usertype=models.CharField(choices=[('user','user'),('ngo','ngo'),('admin','admin')],blank=False,max_length=500  )
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
    interest=[('Education','Education'),('Environment','Environment'),('Health','Health'),('Community Development','Community Development'),('Animal Welfare','Animal Welfare'),('Arts and Culture','Arts and Culture')]
    interests = models.JSONField(default=list, max_length=100, blank=True,null=True)
    skill=[('Programming','Programming'),('Teaching','Teaching'),('Fundraising','Fundraising'),('Event Planning','Event Planning'),('Social Media','Social Media'),('Photography','Photography'),('Public Speaking','Public Speaking')]
    skills = models.JSONField(default=list, blank=True, null=True, max_length=100)
    contact=models.CharField(max_length=12,blank=True)

class ngo(models.Model):
    user= models.OneToOneField(customUser, on_delete=models.CASCADE, primary_key=True)
    ngoid = models.CharField(max_length=100, blank=True, null=True)
    address= models.CharField(max_length=255, blank=True, null=True)
    description= models.TextField(blank=True, null=True)
    contactperson=models.CharField(max_length=100, blank=True, null=True)   
    website=models.URLField(max_length=200, blank=True, null=True)
    
    focusAreas= models.CharField(max_length=255, blank=True, null=True)

class student(models.Model):
    user= models.OneToOneField(customUser, on_delete=models.CASCADE, primary_key=True)
    major= models.CharField(max_length=255, blank=True, null=True)
    college= models.CharField(max_length=255, blank=True, null=True)
    usersince= models.DateField(default=datetime.date.today)
    hoursvolunteered=models.IntegerField(blank=True, null=True)
    year=models.CharField(choices=[('Freshman','Freshman'),('Sophomore','Sophomore'),('Junior','Junior'),('Senior','Senior'),('Graduate','Graduate')],max_length=100, blank=True, null=True)    
    
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import datetime

class EmailOTP(models.Model):
    user = models.ForeignKey(customUser, on_delete=models.CASCADE, null=True, blank=True)
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.created_at + datetime.timedelta(minutes=5)
# Create your models here.
