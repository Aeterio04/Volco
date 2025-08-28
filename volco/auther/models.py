from django.db import models
from django.contrib.auth.models import AbstractUser,BaseUserManager
import datetime
from django.utils.text import slugify


class customUser(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, blank=True, null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    slug = models.SlugField(blank=True, null=False, unique=True,default='def')  # or just blank=True
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
    contact=models.CharField(max_length=12,blank=True)

class ngo(models.Model):
    user= models.OneToOneField(customUser, on_delete=models.CASCADE, primary_key=True)
    ngoid = models.CharField(max_length=100, blank=True, null=True)
    address= models.CharField(max_length=255, blank=True, null=True)

# Create your models here.
