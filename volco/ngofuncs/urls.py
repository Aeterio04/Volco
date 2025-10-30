from django.urls import path
from .views import createEventfunc,get_user_data,getstats,getregisteredevents,setevent

urlpatterns = [
  path('api/ngo/createevent',createEventfunc, name='createevent'),
  path('api/ngo/',get_user_data, name='getngodetails'),
  path('api/ngostats/', getstats, name='getngostats'),
  path('api/ngoregistrations/',getregisteredevents,name='getngoregistrations'),
  path('api/setevent/',setevent,name='setevent'),
]