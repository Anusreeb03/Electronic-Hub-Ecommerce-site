from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, login_view

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    # Custom login route
    path('api/login/', login_view, name='api-login'),
    
    path('api/', include(router.urls)),
]