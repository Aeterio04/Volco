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
from django.db.models import Avg


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

    # Clean up arrays - remove empty strings
    if cause:
        cause = [c for c in cause if c and c.strip()]
    if skills:
        skills = [s for s in skills if s and s.strip()]

    # Remove emojis from title and description to avoid database encoding issues
    import re
    if title:
        title = re.sub(r'[^\x00-\x7F]+', '', title).strip()  # Remove non-ASCII characters
    if description:
        description = re.sub(r'[^\x00-\x7F]+', '', description).strip()

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
    
    # Calculate average rating
    avg_rating_result = EventRegistration.objects.filter(
        event__organization=user,
        rating__isnull=False
    ).aggregate(Avg('rating'))
    
    avgrating = round(avg_rating_result['rating__avg'], 1) if avg_rating_result['rating__avg'] else 0
    
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
    
    for event in event1:
        
        if event.end_datetime < timezone.now():
            event.status = "Completed"
            event.save()
        elif event.start_datetime <= timezone.now() < event.end_datetime:
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
            'date': event.start_datetime.date(),
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_ngo_volunteers(request):
    """Get all volunteers who have registered for this NGO's events"""
    user = request.user
    
    # Get all registrations for events created by this NGO
    registrations = EventRegistration.objects.filter(
        event__organization=user
    ).select_related('user', 'event').distinct()
    
    # Group by user to avoid duplicates
    volunteers_dict = {}
    for reg in registrations:
        volunteer = reg.user
        if volunteer.id not in volunteers_dict:
            # Get student profile
            from auther.models import student
            student_profile = student.objects.filter(user=volunteer).first()
            
            # Count events for this volunteer with this NGO
            events_count = EventRegistration.objects.filter(
                user=volunteer,
                event__organization=user
            ).count()
            
            volunteers_dict[volunteer.id] = {
                'id': volunteer.id,
                'name': volunteer.username,
                'email': volunteer.email,
                'college': student_profile.college if student_profile else 'N/A',
                'major': student_profile.major if student_profile else 'N/A',
                'skills': ', '.join(volunteer.skills) if volunteer.skills else 'N/A',
                'events_joined': events_count,
                'contact': volunteer.contact if volunteer.contact else 'N/A'
            }
    
    volunteers_list = list(volunteers_dict.values())
    
    return Response(volunteers_list)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_event_details(request, event_id):
    """Get detailed event information including all registered volunteers"""
    user = request.user
    
    try:
        event = events.objects.get(eventid=event_id, organization=user)
    except events.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Event not found or you do not have permission to view it'
        }, status=404)
    
    # Get all volunteers registered for this event
    registrations = EventRegistration.objects.filter(event=event).select_related('user')
    
    volunteers_list = []
    for reg in registrations:
        volunteer = reg.user
        from auther.models import student
        student_profile = student.objects.filter(user=volunteer).first()
        
        volunteers_list.append({
            'id': volunteer.id,
            'name': volunteer.username,
            'email': volunteer.email,
            'college': student_profile.college if student_profile else 'N/A',
            'major': student_profile.major if student_profile else 'N/A',
            'skills': ', '.join(volunteer.skills) if volunteer.skills else 'N/A',
            'contact': volunteer.contact if volunteer.contact else 'N/A',
            'registered_at': reg.registered_at,
            'status': reg.status
        })
    
    # Return event details with volunteers
    event_data = {
        'eventid': event.eventid,
        'title': event.title,
        'description': event.description,
        'start_datetime': event.start_datetime,
        'end_datetime': event.end_datetime,
        'location': event.location,
        'address': event.address,
        'hours': float(event.hours) if event.hours else 0,
        'volunteers_needed': event.volunteers_needed,
        'volunteers_registered': event.volunteers_registered,
        'causes': event.causes,
        'skills': event.skills,
        'status': event.status,
        'volunteers': volunteers_list
    }
    
    return Response(event_data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_event(request, event_id):
    """Update event details and notify volunteers if critical fields change"""
    user = request.user
    
    try:
        event = events.objects.get(eventid=event_id, organization=user)
    except events.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Event not found or you do not have permission to modify it'
        }, status=404)
    
    # Store old values to check if critical fields changed
    old_address = event.address
    old_start = event.start_datetime
    old_end = event.end_datetime
    
    # Update fields
    title = request.data.get('title')
    description = request.data.get('description')
    address = request.data.get('address')
    date = request.data.get('date')
    start_time = request.data.get('start_time')
    end_time = request.data.get('end_time')
    volunteers_needed = request.data.get('volunteers_needed')
    
    # Remove emojis from title and description
    import re
    if title:
        event.title = re.sub(r'[^\x00-\x7F]+', '', title).strip()
    if description:
        event.description = re.sub(r'[^\x00-\x7F]+', '', description).strip()
    if address:
        event.address = address
    if volunteers_needed:
        event.volunteers_needed = int(volunteers_needed)
    
    # Update datetime if provided
    if date and start_time and end_time:
        year, month, day = map(int, date.split("-"))
        startHour, startMinute = map(int, start_time.split(":"))
        endHour, endMinute = map(int, end_time.split(":"))
        
        unawarestart = datetime(year, month, day, startHour, startMinute)
        unawareend = datetime(year, month, day, endHour, endMinute)
        
        event.start_datetime = timezone.make_aware(unawarestart, timezone.get_current_timezone())
        event.end_datetime = timezone.make_aware(unawareend, timezone.get_current_timezone())
        
        # Recalculate hours
        event.hours = (datetime.strptime(end_time, '%H:%M') - datetime.strptime(start_time, '%H:%M')).seconds / 3600
    
    event.save()
    
    # Check if critical fields changed
    critical_change = (
        old_address != event.address or
        old_start != event.start_datetime or
        old_end != event.end_datetime
    )
    
    # Send email notifications if critical fields changed
    if critical_change:
        registrations = EventRegistration.objects.filter(event=event, status='Registered')
        
        for reg in registrations:
            volunteer = reg.user
            send_event_update_email(volunteer.email, event, old_start, old_end, old_address)
    
    return Response({
        'success': True,
        'message': 'Event updated successfully',
        'notifications_sent': critical_change
    })


def send_event_update_email(email, event, old_start, old_end, old_address):
    """Send email notification about event changes"""
    from django.core.mail import send_mail
    from django.conf import settings
    
    subject = f"Event Update: {event.title}"
    
    # Format changes
    changes = []
    if old_address != event.address:
        changes.append(f"Address: {old_address} → {event.address}")
    if old_start != event.start_datetime:
        changes.append(f"Start Time: {old_start.strftime('%Y-%m-%d %H:%M')} → {event.start_datetime.strftime('%Y-%m-%d %H:%M')}")
    if old_end != event.end_datetime:
        changes.append(f"End Time: {old_end.strftime('%Y-%m-%d %H:%M')} → {event.end_datetime.strftime('%Y-%m-%d %H:%M')}")
    
    message = f"""
Hello,

The event "{event.title}" has been updated with the following changes:

{chr(10).join(changes)}

Updated Event Details:
- Title: {event.title}
- Date: {event.start_datetime.strftime('%Y-%m-%d')}
- Time: {event.start_datetime.strftime('%H:%M')} - {event.end_datetime.strftime('%H:%M')}
- Location: {event.location}
- Address: {event.address}

Please make note of these changes. If you have any questions, please contact the organization.

Thank you,
VolunteerConnect Team
    """
    
    try:
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )
        print(f"Email sent to {email}")
    except Exception as e:
        print(f"Failed to send email to {email}: {str(e)}")
