from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import BasePermission, SAFE_METHODS
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Product
from .serializers import ProductSerializer

# Custom Permission: Read-only for everyone, Write/Delete only for Admin
class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        # SAFE_METHODS are GET, HEAD, OPTIONS (allowed for everyone)
        if request.method in SAFE_METHODS:
            return True
        # Write operations require the user to be authenticated and staff/admin
        return request.user and request.user.is_authenticated and request.user.is_staff

from rest_framework.authentication import SessionAuthentication

class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # To not enforce CSRF key checking in development API

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-id')
    serializer_class = ProductSerializer
    authentication_classes = (CsrfExemptSessionAuthentication,)

    def get_serializer_context(self):
        # Passes the request context so serializer generates full image URLs
        return {'request': self.request}

# Login View remains a simple function-based view
@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        user_obj = User.objects.get(email=email)
        user = authenticate(username=user_obj.username, password=password)
    except User.DoesNotExist:
        user = None

    if user is not None:
        return Response({
            "message": "Login successful",
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_staff
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST)