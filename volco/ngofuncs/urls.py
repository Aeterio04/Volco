from django.urls import path
from .views import createEventfunc,get_user_data,getstats,getregisteredevents,setevent,get_ngo_volunteers,get_event_details,update_event

urlpatterns = [
  path('api/ngo/createevent',createEventfunc, name='createevent'),
  path('api/ngo/',get_user_data, name='getngodetails'),
  path('api/ngostats/', getstats, name='getngostats'),
  path('api/ngoregistrations/',getregisteredevents,name='getngoregistrations'),
  path('api/setevent/',setevent,name='setevent'),
  path('api/ngo/volunteers/',get_ngo_volunteers,name='get_ngo_volunteers'),
  path('api/ngo/event/<int:event_id>/',get_event_details,name='get_event_details'),
  path('api/ngo/event/<int:event_id>/update/',update_event,name='update_event'),
]