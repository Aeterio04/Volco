from django.urls import path
from .views import get_user_data,getstats,getregisteredevents,checkstatus,getevents,get_achievements,get_activity_history,rate_event,filter_events

urlpatterns = [
    path('api/user/', get_user_data, name='get_user_data'),
    path('api/userstats/', getstats, name='getstats'),
    path('api/userregistrations/',getregisteredevents,name='getregistrations'),
    path('api/auth/checkstatus', checkstatus, name='checkstatus'),
    path('api/user/events/', getevents,name='getevents'),
    path('api/user/achievements/', get_achievements, name='get_achievements'),
    path('api/user/activity-history/', get_activity_history, name='get_activity_history'),
    path('api/user/rate-event/', rate_event, name='rate_event'),
    path('api/user/filter-events/', filter_events, name='filter_events'),
]