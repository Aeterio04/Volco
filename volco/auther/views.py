from django.shortcuts import render
from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse
from django.contrib import messages
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
from .models import customUser,student,ngo
from rest_framework.authtoken.models import Token
import json


@api_view(['POST'])
@permission_classes([AllowAny])
def loginfunc(request):
    print('login API called')

    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'success': False, 'message': 'Email and password are required.'}, status=400)

    # Fetch user
    user = customUser.objects.filter(email=email).first()
    if user is None:
        return Response({'success': False, 'message': 'User with this email does not exist.'}, status=400)

    # Validate password
    if not check_password(password, user.password):
        return Response({'success': False, 'message': 'Invalid Credentials'}, status=400)

    # Login session (optional, for session-based dashboard)
    auth.login(request, user)

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    # Return tokens + user info
    return Response({
        'success': True,
        'user': user.usertype,
        'access': access_token,
        'refresh': refresh_token,
        
    })
@api_view(['POST'])
@permission_classes([AllowAny])
def signupfunc(request):
    if request.method == "POST":
        data = json.loads(request.body)

        print(data)

        # Save to DB, e.g. Volunteer.objects.create(**data)
        
        new_user = customUser(email=data['email'], username=data['fullName'],password=make_password(data['password']), usertype='user', location=data['location'], contact=data['contact'], interests=data['interests'], skills=data['skills'])
        new_user.save()
         # Generate slug after saving to get the ID
        new_user.slug = slugify(data['fullName'] + '-' + str(new_user.id))
        new_user.save()
        student_profile = student(user=new_user, major=data['major'],year=data['year'], college="Pune Institute of Computer Technology")
        student_profile.save()
        return JsonResponse({"message": "Volunteer registered successfully!"})
    return JsonResponse({"error": "Invalid request"}, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def signupngofunc(request):
    if request.method == "POST":
        data = json.loads(request.body)

        print(data)
        # Save to DB, e.g. Volunteer.objects.create(**data)
        new_user = customUser(
            email=data['email'],
            username=data['organizationName'],
            password=make_password(data['password']), 
            usertype='ngo', 
            location=data['location'], 
            contact=data['phone'])
            
        
        new_user.save()
        print(new_user.id)
        #  # Generate slug after saving to get the ID
        new_user.slug = slugify(data['organizationName'] + '-' + str(new_user.id))
        new_user.save()
        ngo_profile = ngo(user=new_user, address=data['address'],description=data['description'], focusAreas=data["focusAreas"],ngoid=data['darpanId'],contactperson=data['contactPerson'],website=data['website'])
        ngo_profile.save()
        return JsonResponse({"message": "Volunteer registered successfully!"})
    return JsonResponse({"error": "Invalid request"}, status=400)

# Create your views here.
