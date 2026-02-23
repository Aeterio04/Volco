from django.shortcuts import render
from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse
from django.contrib import messages
from datetime import datetime
from datetime import date as date_cls
from django.contrib.auth.models import User,auth
from django.contrib.auth import authenticate,logout
from django.contrib.auth.hashers import make_password
from django.utils.text import slugify
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from auther.models import customUser,student
from django.utils import timezone
from rest_framework.authtoken.models import Token
import json
from rest_framework.permissions import IsAuthenticated
from userfuncs.models import events,EventRegistration


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createEventfunc(request):
    print('create event API called')

    print(request.data)
    title = request.data.get('title')
    description = request.data.get('description')  
    date = request.data.get('date')
    start_time = request.data.get('start_time')
    end_time = request.data.get('end_time')
    location = request.data.get('location')
    address = request.data.get('address')
    cause = request.data.get('cause')
    volunteers_needed = request.data.get('volunteers_needed')
    skills = request.data.get('skills')
    organization = request.user  # Assuming the user is authenticated and is an NGO
    status = 'Upcoming'  # Default status
    print(date,start_time,end_time)

    year, month, day = map(int, date.split("-"))
    event_date = date_cls(year, month, day)
    startHour, startMinute = map(int, start_time.split(":"))
    endHour, endMinute = map(int, end_time.split(":"))
    unawarestart=datetime(year, month, day, startHour, startMinute)
    unawareend=datetime(year, month, day, endHour, endMinute)

    start_datetime=timezone.make_aware(unawarestart,timezone.get_current_timezone())
    end_datetime=timezone.make_aware(unawareend,timezone.get_current_timezone())

    if not all([title, description, date, start_time, end_time, location, volunteers_needed, cause, skills]):
        return Response({'success': False, 'message': 'All fields are required.'}, status=400)
    elif datetime.strptime(end_time, '%H:%M') <= datetime.strptime(start_time, '%H:%M'):
        return Response({'success': False, 'message': 'End time must be after start time.'}, status=400)
    hours= (datetime.strptime(end_time, '%H:%M') - datetime.strptime(start_time, '%H:%M')).seconds / 3600
    event=events.objects.create(
        title=title,
        description=description,
        start_datetime=start_datetime,
        end_datetime=end_datetime,
        location=location,
        address=address,
        hours=hours,
        volunteers_needed=volunteers_needed,
        volunteers_registered=0,
        causes=cause,
        skills=skills,
        organization=organization,
        status=status
    )
    event.save()
    return Response({
        'success': True,
        'message': 'Event created successfully'
    })
# Create your views here.



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    user = request.user  # Automatically set by JWT authentication
    
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'slug': user.slug,
        'usertype': user.usertype,
        'interests': user.interests,
        'skills': user.skills,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getstats(request):
    user=request.user
    total_events = events.objects.filter(organization=user).count()
    volunteers=EventRegistration.objects.filter(event__organization=user).count()
    completed_events = events.objects.filter(organization=user,status='Completed').count()
    avgrating=0
    print(total_events,volunteers,completed_events,avgrating)


    return JsonResponse({
        'total_events': total_events,
        'volunteers': volunteers,
        'completed_events': completed_events,
        'avgrating': avgrating
    })


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def getvolunteers(request):
#     user=request.user
#     volunteers=EventRegistration.objects.filter(event__organization=user)
#     registrations=EventRegistration.objects.filter(event=event)
#     volunteers=[]
#     for reg in registrations:
#         volunteer={
#             'id':reg.user.id,
#             'username':reg.user.username,
#             'email':reg.user.email,
#             'registered_at':reg.registered_at,
#             'status':reg.status
#         }
#         volunteers.append(volunteer)
#     return Response(volunteers)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getregisteredevents(request):
    user=request.user
    event1=events.objects.filter(organization=user)
    registered_events = []
    print(date_cls.today())
    for event in event1:
        
        if event.end_datetime.time() <timezone.now():
            event.status = "Completed"
            
            event.save()
        elif event.end_datetime.time()> timezone.now() and event.start_datetime.time()<=timezone.now():
            
            print(event.title,event.date)
            event.status = "Ongoing"
            event.save()
        
    #     id: 1,
    # title: "Community Garden Cleanup",
    # cause: "Environment",
    # date: "2024-02-15",
    # location: "Aga Khan Palace Community Garden",
    # volunteersNeeded: 15,
    # volunteersRegistered: 12,
    # status: "Published",
        registered_event = {
            'eventid': event.eventid,
            'title': event.title,
            'date': event.date,
            'location': event.address,
            'status': event.status,
            'volunteersNeeded': event.volunteers_needed,
            'volunteersRegistered': event.volunteers_registered,
            'cause': " , ".join(event.causes),
            } 
        registered_events.append(registered_event)
    return Response(registered_events)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def setevent(request):
    print(request.data)
    user = request.user  # Automatically set by JWT authentication
    data = request.data
    event_id = data.get('id')
    
    print("set event API called", event_id)
    event = events.objects.filter(eventid=event_id).first()
        
    try:
        # Here you can set any additional fields or perform actions as needed
        print("Event found:", event.title)
        eventregister=EventRegistration.objects.create(
            user=user,
            event=event,
            status='Registered'
        )
        print("Event registration created for user:", user.username)
        eventregister.save()
        event.volunteers_registered += 1
        event.save()
        event.volunteers_needed -= 1
        event.save()
        

        return Response({
            'success': True,
            'message': 'Event status updated successfully'
        })
    except events.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Event not found or you do not have permission to modify it'
        }, status=404)