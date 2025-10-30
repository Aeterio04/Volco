from django.urls import path
from .views import get_user_data,getstats,getregisteredevents,checkstatus

urlpatterns = [
    path('api/user/', get_user_data, name='get_user_data'),
    path('api/userstats/', getstats, name='getstats'),
    path('api/userregistrations/',getregisteredevents,name='getregistrations'),
    path('api/auth/checkstatus', checkstatus, name='checkstatus'),
]