import jwt
import os
from dotenv import load_dotenv
from django.conf import settings
from rest_framework import authentication, exceptions
from urllib.parse import unquote

load_dotenv()

class JWTUser:
    def __init__(self, payload):
        self.payload = payload
        self.id = payload.get("userId")
        self.email = payload.get("email")
        self.is_authenticated = True

    def __str__(self):
        return self.email or "JWTUser"

class CookieJWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        token = None
        
        if auth_header:
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
            else:
                token = auth_header
        else:
            token = request.COOKIES.get('Authorization')
            if token:
                token = unquote(token)
                if token.startswith('Bearer '):
                    token = token.replace('Bearer ', '')
                elif token.startswith('Bearer%20'):
                    token = token.replace('Bearer%20', '')

        if not token:
            print("No token found in request")
            return None

        print(f"Extracted token: {token[:20]}...")

        try:
            payload = jwt.decode(token, os.getenv('JWT_SECRET_KEY'), algorithms=["HS256"])
            print(f"Decoded payload: {payload}")
        except jwt.ExpiredSignatureError:
            print("Token expired")
            raise exceptions.AuthenticationFailed('Token expired')
        except jwt.InvalidTokenError as e:
            print(f"Invalid token: {e}")
            raise exceptions.AuthenticationFailed('Invalid token')

        user = JWTUser(payload)
        print(f"Authenticated user: {user}")
        return (user, None)