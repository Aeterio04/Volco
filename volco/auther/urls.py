from django.contrib import admin
from django.urls import path,include
from . import views


urlpatterns = [
    path("api/auth/login/",views.loginfunc,name="login"),
    path("api/volunteer/register/",views.signupfunc,name="signup"),
    path("api/auth/ngoregister/",views.signupngofunc,name="ngosignup"),
    path('api/send-otp/', views.send_otp, name='send_otp'),
    path('api/verify-otp/', views.verify_otp, name='verify_otp'),
    
]