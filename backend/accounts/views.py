from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import now
from .models import User
from .serializers import RegisterSerializer, UserSerializer
from .utils import generate_jwt, decode_jwt
import re
import os

EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    data = request.data
    email = data.get('email', '').lower().strip()
    full_name = data.get('full_name', '').strip()
    password = data.get('password', '')

    if not email or not password or not full_name:
        return Response({'message': 'All fields are required.', 'success': False}, status=400)

    if not EMAIL_REGEX.match(email):
        return Response({'message': 'Please provide a valid email address.', 'success': False}, status=400)

    if len(password) < 6:
        return Response({'message': 'Password must be at least 6 characters long.', 'success': False}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({'message': 'User already exists with this email.', 'success': False}, status=400)

    hashed_password = make_password(password)

    serializer = RegisterSerializer(data={
        'email': email,
        'full_name': full_name,
        'password': hashed_password
    })

    if serializer.is_valid():
        user = serializer.save()
        token = generate_jwt(user)

        response = Response({
            'message': 'Account created successfully.',
            'success': True,
            'user': UserSerializer(user).data,
            'token': token
        }, status=201)

        response.set_cookie(
            key='Authorization',
            value='Bearer ' + token,
            httponly=True,
            secure=os.environ.get('DJANGO_ENV') == 'production'
        )
        return response

    return Response({'message': 'Invalid data.', 'success': False}, status=400)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    data = request.data
    email = data.get('email', '').lower().strip()
    password = data.get('password', '')

    if not email or not password:
        return Response({'message': 'Email and password are required.', 'success': False}, status=400)

    if not EMAIL_REGEX.match(email):
        return Response({'message': 'Please provide a valid email address.', 'success': False}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'message': 'Invalid email or password.', 'success': False}, status=400)

    if not check_password(password, user.password):
        return Response({'message': 'Invalid email or password.', 'success': False}, status=400)

    token = generate_jwt(user)

    response = Response({
        'message': 'Logged in successfully.',
        'success': True,
        'user': UserSerializer(user).data,
        'token': token
    })

    response.set_cookie(
        key='Authorization',
        value='Bearer ' + token,
        httponly=True,
        secure=os.environ.get('DJANGO_ENV') == 'production'
    )
    return response


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    response = Response({
        'message': 'Logged out successfully.',
        'success': True
    }, status=status.HTTP_200_OK)
    response.delete_cookie('Authorization')
    return response

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_premium_status(request):
    user = request.user

    if not user or not user.id:
        return Response({
            "message": "Authentication required.",
            "success": False,
            "error": "UNAUTHORIZED"
        }, status=status.HTTP_401_UNAUTHORIZED)

    user_id = str(user.id)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        print(f"Premium update attempted for non-existent user: {user_id}")
        return Response({
            "message": "User not found.",
            "success": False,
            "error": "USER_NOT_FOUND"
        }, status=status.HTTP_404_NOT_FOUND)

    if user.premium_user:
        return Response({
            "message": "User is already a premium member.",
            "success": True,
            "data": {
                "premium_status": True,
                "message": "No changes made"
            }
        }, status=status.HTTP_200_OK)

    user.premium_user = True
    user.save()

    print(f"Premium status updated successfully for user: {user_id}")

    return Response({
        "message": "Premium status updated successfully.",
        "success": True,
        "data": {
            "premium_status": user.premium_user,
            "updated_at": now().isoformat()
        }
    }, status=status.HTTP_200_OK)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serialized = UserSerializer(user)
        return Response(serialized.data)

def get_user_from_token(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ')[1]
    payload = decode_jwt(token)
    if not payload:
        return None
    try:
        return User.objects.get(id=payload['user_id'])
    except User.DoesNotExist:
        return None
