from django.shortcuts import render
from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse
from django.contrib import messages
from datetime import datetime
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
    print(recommended_events)
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
        'recommended_events': recommended_events,
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

#     {
#     id: 4,
#     title: "Lake Cleanup Day",
#     organization: "Ocean Conservation Society",
#     cause: "Environment",
#     date: "2024-02-10",
#     time: "7:00 AM - 11:00 AM",
#     location: "Pashan Lake",
#     status: "Confirmed",
#     hoursLogged: 4,
#   },

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

    registered_events = EventRegistration.objects.filter(user=user, status="Registered").values_list('event', flat=True)
    available_events = events.objects.exclude(status__in=['Completed', 'Cancelled'])  # only upcoming/ongoing
    available_events =[e for e in available_events if e not in registered_events]
    
    scored_events = []

    for event in available_events:
        skill_match = len(user_skills & set(event.skill)) / len(event.skill)
        cause_match = len(user_interests & set(event.causes)) / len(event.causes)
        score = 0.7 * skill_match + 0.3 * cause_match
        scored_events.append((event, score))

    scored_events.sort(key=lambda x: x[1], reverse=True)
    return [e for e, s in scored_events[:10]]  # top 10
