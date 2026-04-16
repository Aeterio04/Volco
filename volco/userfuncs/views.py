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
from django.utils import timezone
from django.db.models import Avg, Q

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
        
        if reg.event.end_datetime < timezone.now():
            reg.event.status = "Completed"
            reg.event.save()
        elif reg.event.start_datetime <= timezone.now() < reg.event.end_datetime:
            reg.event.status = "Ongoing"
            reg.event.save()
        
            
        registered_event = {
            'eventid': reg.event.eventid,
            'title': reg.event.title,
            'date': reg.event.start_datetime.date(),
            'time': reg.event.start_datetime.time().strftime("%H:%M") + " - " + reg.event.end_datetime.time().strftime("%H:%M"),
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
            'date': e.start_datetime.date(),
            'time': e.start_datetime.time().strftime("%H:%M") + " - " + e.end_datetime.time().strftime("%H:%M"),
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

def calculate_achievements(user):
    """Calculate user achievements based on volunteer hours and activities"""
    student_profile = student.objects.filter(user=user).first()
    hours = student_profile.hoursvolunteered if student_profile and student_profile.hoursvolunteered else 0
    
    completed_events = EventRegistration.objects.filter(user=user, status="Completed").count()
    organizations_helped = EventRegistration.objects.filter(user=user, status="Completed").values('event__organization').distinct().count()
    
    achievements = []
    
    # Hours-based achievements
    if hours >= 1:
        achievements.append({
            'id': 'first_hour',
            'title': 'First Step',
            'description': 'Completed your first volunteer hour',
            'icon': '🎉',
            'earned': True,
            'category': 'hours'
        })
    
    if hours >= 10:
        achievements.append({
            'id': 'ten_hours',
            'title': 'Dedicated Volunteer',
            'description': 'Volunteered for 10 hours',
            'icon': '⭐',
            'earned': True,
            'category': 'hours'
        })
    
    if hours >= 25:
        achievements.append({
            'id': 'twentyfive_hours',
            'title': 'Community Champion',
            'description': 'Volunteered for 25 hours',
            'icon': '🏆',
            'earned': True,
            'category': 'hours'
        })
    
    if hours >= 50:
        achievements.append({
            'id': 'fifty_hours',
            'title': 'Impact Maker',
            'description': 'Volunteered for 50 hours',
            'icon': '💎',
            'earned': True,
            'category': 'hours'
        })
    
    if hours >= 100:
        achievements.append({
            'id': 'hundred_hours',
            'title': 'Volunteer Legend',
            'description': 'Volunteered for 100 hours',
            'icon': '👑',
            'earned': True,
            'category': 'hours'
        })
    
    # Event-based achievements
    if completed_events >= 1:
        achievements.append({
            'id': 'first_event',
            'title': 'First Event',
            'description': 'Completed your first volunteer event',
            'icon': '🎊',
            'earned': True,
            'category': 'events'
        })
    
    if completed_events >= 5:
        achievements.append({
            'id': 'five_events',
            'title': 'Event Enthusiast',
            'description': 'Completed 5 volunteer events',
            'icon': '🌟',
            'earned': True,
            'category': 'events'
        })
    
    if completed_events >= 10:
        achievements.append({
            'id': 'ten_events',
            'title': 'Event Master',
            'description': 'Completed 10 volunteer events',
            'icon': '🎯',
            'earned': True,
            'category': 'events'
        })
    
    # Organization-based achievements
    if organizations_helped >= 3:
        achievements.append({
            'id': 'three_orgs',
            'title': 'Organization Explorer',
            'description': 'Helped 3 different organizations',
            'icon': '🌍',
            'earned': True,
            'category': 'organizations'
        })
    
    if organizations_helped >= 5:
        achievements.append({
            'id': 'five_orgs',
            'title': 'Community Builder',
            'description': 'Helped 5 different organizations',
            'icon': '🏘️',
            'earned': True,
            'category': 'organizations'
        })
    
    # Add locked achievements (not yet earned)
    if hours < 100:
        achievements.append({
            'id': 'hundred_hours',
            'title': 'Volunteer Legend',
            'description': 'Volunteer for 100 hours',
            'icon': '👑',
            'earned': False,
            'category': 'hours',
            'progress': hours,
            'target': 100
        })
    
    if completed_events < 10:
        achievements.append({
            'id': 'ten_events',
            'title': 'Event Master',
            'description': 'Complete 10 volunteer events',
            'icon': '🎯',
            'earned': False,
            'category': 'events',
            'progress': completed_events,
            'target': 10
        })
    
    return achievements

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_achievements(request):
    """Get user achievements"""
    user = request.user
    achievements = calculate_achievements(user)
    
    return Response({
        'achievements': achievements,
        'total_earned': len([a for a in achievements if a['earned']]),
        'total_available': len(achievements)
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_activity_history(request):
    """Get complete activity history including completed events"""
    user = request.user
    all_registrations = EventRegistration.objects.filter(user=user).order_by('-registered_at')
    
    history = []
    for reg in all_registrations:
        # Update status based on datetime
        if reg.event.end_datetime < timezone.now() and reg.status == "Registered":
            reg.status = "Completed"
            reg.save()
        
        event_data = {
            'eventid': reg.event.eventid,
            'title': reg.event.title,
            'organization': reg.event.organization.username if reg.event.organization else None,
            'organization_id': reg.event.organization.id if reg.event.organization else None,
            'cause': ", ".join([item for item in reg.event.causes if item]),
            'date': reg.event.start_datetime.date(),
            'time': reg.event.start_datetime.time().strftime("%H:%M") + " - " + reg.event.end_datetime.time().strftime("%H:%M"),
            'location': reg.event.address,
            'status': reg.status,
            'registered_at': reg.registered_at,
            'hours': float(reg.event.hours) if reg.event.hours else 0,
            'rating': reg.rating,
            'review': reg.review,
            'can_rate': reg.status == "Completed" and reg.rating is None
        }
        history.append(event_data)
    
    return Response(history)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_event(request):
    """Rate an event/NGO after completion"""
    user = request.user
    event_id = request.data.get('event_id')
    rating = request.data.get('rating')
    review = request.data.get('review', '')
    
    if not event_id or not rating:
        return Response({'success': False, 'message': 'Event ID and rating are required'}, status=400)
    
    if not (1 <= int(rating) <= 5):
        return Response({'success': False, 'message': 'Rating must be between 1 and 5'}, status=400)
    
    try:
        registration = EventRegistration.objects.get(user=user, event_id=event_id, status="Completed")
        
        if registration.rating is not None:
            return Response({'success': False, 'message': 'You have already rated this event'}, status=400)
        
        registration.rating = int(rating)
        registration.review = review
        registration.rated_at = timezone.now()
        registration.save()
        
        # Update student hours
        student_profile = student.objects.filter(user=user).first()
        if student_profile and registration.event.hours:
            if student_profile.hoursvolunteered:
                student_profile.hoursvolunteered += int(registration.event.hours)
            else:
                student_profile.hoursvolunteered = int(registration.event.hours)
            student_profile.save()
        
        return Response({
            'success': True,
            'message': 'Rating submitted successfully'
        })
    
    except EventRegistration.DoesNotExist:
        return Response({'success': False, 'message': 'Event registration not found or not completed'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def filter_events(request):
    """Filter events based on query parameters"""
    user = request.user
    
    # Get filter parameters
    cause = request.GET.get('cause', None)
    city = request.GET.get('city', None)
    difficulty = request.GET.get('difficulty', None)
    search = request.GET.get('search', None)
    
    # Start with all active events
    filtered_events = events.objects.filter(status__in=['Upcoming', 'Ongoing'])
    
    # Exclude events user is already registered for
    registered_event_ids = EventRegistration.objects.filter(
        user=user, 
        status="Registered"
    ).values_list('event_id', flat=True)
    filtered_events = filtered_events.exclude(eventid__in=registered_event_ids)
    
    # Apply filters
    if cause and cause != 'All':
        filtered_events = filtered_events.filter(causes__contains=[cause])
    
    if city and city != 'All':
        filtered_events = filtered_events.filter(location=city)
    
    if difficulty and difficulty != 'All':
        filtered_events = filtered_events.filter(impact=difficulty)
    
    if search:
        filtered_events = filtered_events.filter(
            Q(title__icontains=search) | 
            Q(description__icontains=search) |
            Q(organization__username__icontains=search)
        )
    
    # Build response
    events_list = []
    for e in filtered_events:
        if e.volunteers_needed == 0:
            continue
        eventobj = {
            'id': e.eventid,
            'title': e.title,
            'organization': e.organization.username if e.organization else None,
            'organizationLogo': "🏢",
            'cause': ", ".join([item for item in e.causes if item]),
            'date': e.start_datetime.date(),
            'time': e.start_datetime.time().strftime("%H:%M") + " - " + e.end_datetime.time().strftime("%H:%M"),
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
