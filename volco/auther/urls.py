from django.contrib import admin
from django.urls import path,include
from . import views


urlpatterns = [
    path("api/auth/login/",views.loginfunc,name="login"),
    path("api/volunteer/register/",views.signupfunc,name="signup"),
    
]