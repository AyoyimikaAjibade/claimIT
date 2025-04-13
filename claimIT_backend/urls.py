from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    RegisterView,
    LogoutView,
    UserProfileViewSet,
    DisasterUpdateViewSet,
    ClaimViewSet,
    CustomTokenObtainPairView
)
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

# Create a router for our viewsets
router = DefaultRouter()
router.register(r'user-profiles', UserProfileViewSet, basename='user-profiles')
router.register(r'claims', ClaimViewSet)
router.register(r'disaster-updates', DisasterUpdateViewSet)

# Define the URL patterns
urlpatterns = [
    # API endpoints
    path('', include(router.urls)),
    
    # Authentication endpoints
    path('auth/register/', RegisterView.as_view({'post': 'create'}), name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', LogoutView.as_view({'post': 'create'}), name='logout'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)