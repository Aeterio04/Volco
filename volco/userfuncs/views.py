from django.shortcuts import render
from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse
from django.contrib import messages
import datetime
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
from .models import events,EventRegistration
from rest_framework.authtoken.models import Token
import json
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    user = request.user  # Automatically set by JWT authentication
    student_profile = student.objects.filter(user=user).first()
    if student_profile is None:
        print("No student profile found for user:", user.email)
    recommended_events=recommend_events(user)

    events=[]
    for e in recommended_events:
        if e.volunteers_needed==0:
            continue
        eventobj={
            'eventid': e.eventid,
            'title': e.title,
            'organization': e.organization.username if e.organization else None,
            'cause': ", ".join([item for item in e.causes if item]),
            'date': e.start_datetime.date(),
            'time': e.start_datetime.time().strftime("%H:%M") + " - " + e.end_datetime.time().strftime("%H:%M"),
            'location': e.address,
            'volunteersNeeded': e.volunteers_needed,
            'volunteersRegistered': e.volunteers_registered,
            'description': e.description,
            'skills': e.skills,
            "difficulty": e.impact,

            }
        events.append(eventobj)
    
#     {
#     id: 1,
#     title: "Community Garden Cleanup",
#     organization: "Green Earth Initiative",
#     cause: "Environment",
#     date: "2024-02-15",
#     time: "9:00 AM - 1:00 PM",
#     location: "Aga Khan Palace Community Garden",
#     volunteersNeeded: 15,
#     volunteersRegistered: 12,
#     description:
#       "Help clean and maintain our community garden. No experience needed!",
#     skills: ["Gardening", "Physical Labor"],
#     difficulty: "Easy",

#   },
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'slug': user.slug,
        'usertype': user.usertype,
        'interests': user.interests,
        'skills': user.skills,
        'year': getattr(student_profile, 'year', 'Not Provided'),
        
        'location': getattr(user, 'location', 'Not Provided'),
        'major': getattr(student_profile, 'major', 'Not Provided'),
        'college': getattr(student_profile, 'college', 'Not Provided'),
        'usersince': getattr(student_profile, 'usersince', 'Not Provided'),
        'contact': getattr(user, 'contact', 'Not Provided'),
        'recommended_events': events,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getstats(request):
    user=request.user
    total_events = events.objects.count()
    userevents = EventRegistration.objects.filter(user=user)
    organizations_helped = userevents.values('event__organization').distinct().count()
    completed_events=userevents.filter(status="Completed").count()
    userevents= userevents.count()


    return JsonResponse({
        'total_events': total_events,
        'user_events': userevents,
        'completed_events': completed_events,
        'organizations_helped': organizations_helped,
        'impactLevel': 'Intermediate' if completed_events >= 5 else 'Beginner'
    })



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getregisteredevents(request):
    user=request.user
    registrations = EventRegistration.objects.filter(user=user, status="Registered")

    

    registered_events = []
    for reg in registrations:
        
        if reg.event.date < datetime.date.today():
            reg.event.status = "Completed"
            reg.save()
        elif reg.event.date==datetime.date.today():
            reg.event.status = "Ongoing"
            reg.save()
        
            
        registered_event = {
            'eventid': reg.event.eventid,
            'title': reg.event.title,
            'date': reg.event.date,
            'time': reg.event.time,
            'organization': reg.event.organization.username if reg.event.organization else None,
            'location': reg.event.location,
            'status': reg.event.status,
            'registered_at': reg.registered_at,
            'registration_status': reg.status
        } 
        registered_events.append(registered_event)
    return Response(registered_events)

def recommend_events(user):
    user_skills = set(user.skills)
    user_interests = set(user.interests)

    registered_events = EventRegistration.objects.filter(user=user, status="Registered")
    registered_events = [reg.event for reg in registered_events]
    active_events = events.objects.exclude(status__in=['Completed', 'Cancelled'])  # only upcoming/ongoing
    available_events=[]
    for i in registered_events:
        print("Registered event ID:", i)
    for a in active_events:
        if a not in registered_events:
            available_events.append(a)
            print("Available event:", a.title)
        else:
            print("Skipping registered event:", a.title)

    scored_events = []

    for event in available_events:
        skill_match = len(user_skills & set(event.skill)) / len(event.skill)
        cause_match = len(user_interests & set(event.causes)) / len(event.causes)
        score = 0.7 * skill_match + 0.3 * cause_match
        scored_events.append((event, score))

    scored_events.sort(key=lambda x: x[1], reverse=True)
    return [e for e, s in scored_events[:10]]  # top 10

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # ✅ ensures only JWT-authenticated users reach here
def checkstatus(request):
    user = request.user
    print("Checking user authentication status for:", user.username)
    return JsonResponse({
        'status': 'authenticated',
        'username': user.username,
        'usertype': user.usertype
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getevents(request):
    user = request.user
    recommended_events = recommend_events(user)

    
    events_list = []
    for e in recommended_events:
        if e.volunteers_needed == 0:
            continue
        eventobj = {
            'id': e.eventid,
            'title': e.title,
            'organization': e.organization.username if e.organization else None,
            'organizationLogo' : "🏢",
            'cause': ", ".join([item for item in e.causes if item]),
            'date': e.date,
            'time': e.time,
            'location': e.address,
            'city': e.location,
            'volunteersNeeded': e.volunteers_needed,
            'volunteersRegistered': e.volunteers_registered,
            'description': e.description,
            'skills': e.skills,
            "difficulty": e.impact,
        }
        events_list.append(eventobj)

    return Response(events_list)
