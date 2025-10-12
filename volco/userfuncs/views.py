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
from auther.models import customUser,student
from rest_framework.authtoken.models import Token
import json
from rest_framework.permissions import IsAuthenticated

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
        'location': getattr(user, 'location', 'Not Provided'),
        'major': getattr(user, 'major', 'Not Provided'),
        'contact': getattr(user, 'contact', 'Not Provided'),
    })
