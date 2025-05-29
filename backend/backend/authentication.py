import jwt
import os
from dotenv import load_dotenv
from django.conf import settings
from rest_framework import authentication, exceptions

load_dotenv()

class JWTUser:
    def __init__(self, payload):
        self.payload = payload
        self.id = payload.get("userId")
        self.email = payload.get("email")
        self.is_authenticated = True  # DRF checks this

    def __str__(self):
        return self.email or "JWTUser"

class CookieJWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get('Authorization')
        if not token:
            return None
        token = token.replace("Bearer%20", "").replace("Bearer ", "")
        if token.startswith("Bearer "):
            token = token.split(" ")[1]
        # print(token)

        try:
            payload = jwt.decode(token, os.getenv('JWT_SECRET_KEY'), algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token expired')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token')

        user = JWTUser(payload)

        return (user, None)
