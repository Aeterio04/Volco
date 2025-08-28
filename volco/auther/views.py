from django.shortcuts import render
from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse
from django.contrib import messages
from django.contrib.auth.models import User,auth
from django.contrib.auth import authenticate,logout

from django.utils.text import slugify
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from .models import customUser
from rest_framework.authtoken.models import Token

@api_view(['POST'])
@permission_classes([AllowAny])
def loginfunc(request):
    print('login api called')
    email = request.data.get('email')
    password = request.data.get('password')
    user=customUser.objects.filter(email=email).first()

    if user is None:
        print('no user found')
        return Response({'success': False, 'message': 'User with this email does not exist.'}, status=400)
    
    print(email,password)

    if not email or not password:
        return Response({'success': False, 'message': 'Email and password are required.'}, status=400)

    if user.usertype=="admin" and check_password(password,user.password):
        auth.login(request,user)
        token, _ = Token.objects.get_or_create(user=user)
        print("user correct ", user.email,user.username)
        return Response({
            'success': True,
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.username,
                'slug': user.slug,
                'type': user.usertype
            }

        })
        
    if user.password==password:
        auth.login(request,user)
        token, _ = Token.objects.get_or_create(user=user)
        print("user correct ", user.email,user.username)
        return Response({
            'success': True,
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.username,
                'slug': user.slug,
                'type': user.usertype
            }

        })
    else:
        return Response({'success': False, 'message': 'Invalid Credentials'}, status=400)



# Create your views here.
