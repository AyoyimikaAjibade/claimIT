from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from .models import Claim, UserProfile, DisasterUpdate, ClaimDocument, Notification
from .serializers import UserSerializer, UserProfileSerializer, DisasterUpdateSerializer, ClaimSerializer, ClaimDocumentSerializer, NotificationSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, permissions, status
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from .utils.fema_scraper import scrape_fema_disasters
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.decorators import action
from rest_framework.exceptions import NotAuthenticated, PermissionDenied, NotFound, APIException, ValidationError

class RegisterView(viewsets.ViewSet):
    """
    API endpoint for user registration.
    """
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_description="Register a new user",
        request_body=UserSerializer,
        responses={
            201: openapi.Response(
                description="Successfully registered",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'user': openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'username': openapi.Schema(type=openapi.TYPE_STRING),
                                'email': openapi.Schema(type=openapi.TYPE_STRING),
                            }
                        ),
                        'refresh': openapi.Schema(type=openapi.TYPE_STRING),
                        'access': openapi.Schema(type=openapi.TYPE_STRING),
                    }
                )
            ),
            400: "Bad Request"
        }
    )
    def create(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': serializer.data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(viewsets.ViewSet):
    """
    API endpoint for user logout.
    """
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Logout the current user",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'refresh_token': openapi.Schema(type=openapi.TYPE_STRING, description='Refresh token to blacklist'),
            },
            required=['refresh_token']
        ),
        responses={
            200: "Successfully logged out",
            400: "Bad Request",
            401: "Unauthorized"
        }
    )
    def create(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            # Add token to blacklist
            token.blacklist()
            
            # Return success response
            return Response(
                {"message": "Successfully logged out"}, 
                status=status.HTTP_200_OK
            )
        except KeyError:
            return Response(
                {"error": "Refresh token is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Obtain JWT token for authentication.
    """
    @swagger_auto_schema(
        operation_description="Obtain JWT token for authentication",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='Username'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='Password'),
            },
            required=['username', 'password']
        ),
        responses={
            200: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'access': openapi.Schema(type=openapi.TYPE_STRING, description='Access token'),
                    'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='Refresh token'),
                }
            ),
            401: "Invalid credentials"
        }
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoints for managing users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoints for managing user profiles.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Check if user is authenticated before filtering
        if self.request.user.is_authenticated:
            try:
                # If admin user, allow access to all profiles
                if self.request.user.is_staff or self.request.user.is_superuser:
                    return UserProfile.objects.all()
                # Regular users can only see their own profile
                return UserProfile.objects.filter(user=self.request.user)
            except Exception as e:
                # Log the error for debugging
                print(f"Error in get_queryset: {str(e)}")
                # Return empty queryset on error
                return UserProfile.objects.none()
        # Return empty queryset for anonymous users
        return UserProfile.objects.none()

    def get_object(self):
        try:
            # Check if user is authenticated    
            if not self.request.user.is_authenticated:
                raise NotAuthenticated("Authentication credentials were not provided")
                
            # Get the requested profile ID from the URL
            lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
            
            # If we're using a detail URL with a specific ID
            if lookup_url_kwarg in self.kwargs:
                # Admin can access any profile
                if self.request.user.is_staff or self.request.user.is_superuser:
                    return super().get_object()
                
                # Regular users can only access their own profile
                obj = super().get_object()
                if obj.user != self.request.user:
                    self.permission_denied(
                        self.request, 
                        message="You don't have permission to access this profile"
                    )
                return obj
            
            # If no specific ID, return the user's own profile
            profile = UserProfile.objects.get(user=self.request.user)
            return profile
            
        except UserProfile.DoesNotExist:
            # Handle case where profile doesn't exist
            raise NotFound(f"User profile for {self.request.user.username} not found")
        except PermissionDenied as pd:
            # Re-raise permission errors
            raise pd
        except Exception as e:
            # Log the error and return a generic error
            print(f"Error in get_object: {str(e)}")
            raise APIException(f"Error retrieving user profile: {str(e)}")
    
    @swagger_auto_schema(
        operation_description="Update user profile",
        request_body=UserProfileSerializer,
        responses={
            200: UserProfileSerializer(),
            400: "Bad Request",
            401: "Unauthorized"
        }
    )
    def update(self, request, *args, **kwargs):
        profile = self.get_object()
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
class ClaimViewSet(viewsets.ModelViewSet):
    """
    API endpoints for managing insurance claims.
    """
    queryset = Claim.objects.all()
    serializer_class = ClaimSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Check if user is authenticated before filtering
        if self.request.user.is_authenticated:
            return Claim.objects.filter(user=self.request.user)
        # Return empty queryset for anonymous users (for Swagger)
        return Claim.objects.none()

    @swagger_auto_schema(
        operation_description="Create a new insurance claim",
        request_body=ClaimSerializer,
        responses={
            201: ClaimSerializer(),
            400: "Bad Request",
            401: "Unauthorized"
        }
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
             
class ClaimListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        claims = Claim.objects.filter(user=request.user)
        serializer = ClaimSerializer(claims, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ClaimSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ClaimDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ClaimSerializer
    queryset = Claim.objects.all()
    
    def get_queryset(self):
        # Ensure users access only their own claims
        return self.queryset.filter(user=self.request.user)

class DisasterUpdateViewSet(viewsets.ModelViewSet):
    """
    API endpoints for managing disaster updates.
    """
    queryset = DisasterUpdate.objects.all()
    serializer_class = DisasterUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # For Swagger documentation, return all disaster updates
        # This is safe since disaster updates are not user-specific
        return DisasterUpdate.objects.all()
    
    def list(self, request, *args, **kwargs):
        # refresh DB before returning
        try:
            scrape_fema_disasters(start_year=2019, end_year=2025, incident_type='earthquake', states=['CA'])
        except Exception:
            pass  # swallow scraper errors
        return super().list(request, *args, **kwargs)

class NotificationViewSet(viewsets.ModelViewSet):
    """
    API endpoints for managing user notifications.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        """
        Override permissions:
        - Only admins can create notifications
        - Users can view, mark as read, and delete their own notifications
        """
        if self.action == 'create':
            return [permissions.IsAdminUser()]
        return super().get_permissions()
    
    def get_queryset(self):
        """
        Return only notifications for the current user.
        Admin users can see all notifications.
        """
        if not self.request.user.is_authenticated:
            return Notification.objects.none()
            
        # Admin users can see all notifications
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Notification.objects.all().order_by('-created_at')
            
        # Regular users can only see their own notifications
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        """
        When admin creates a notification, ensure it's properly saved
        """
        try:
            # Validate that the user exists
            user_id = self.request.data.get('user')
            if not user_id:
                raise ValidationError({"user": "User ID is required"})
                
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                raise ValidationError({"user": f"User with ID {user_id} does not exist"})
                
            serializer.save()
            
        except ValidationError as ve:
            # Re-raise validation errors
            raise ve
        except Exception as e:
            # Log the error for debugging
            print(f"Error creating notification: {str(e)}")
            raise APIException(f"Failed to create notification: {str(e)}")
    
    @swagger_auto_schema(
        operation_description="List all notifications for the current user",
        responses={
            200: NotificationSerializer(many=True),
            401: "Authentication credentials were not provided"
        }
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_description="Create a new notification (Admin only)",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['user', 'title', 'message', 'type'],
            properties={
                'user': openapi.Schema(type=openapi.TYPE_INTEGER, description='User ID to send notification to'),
                'title': openapi.Schema(type=openapi.TYPE_STRING, description='Notification title'),
                'message': openapi.Schema(type=openapi.TYPE_STRING, description='Notification message'),
                'type': openapi.Schema(type=openapi.TYPE_STRING, description='Notification type (success, warning, info, danger)'),
                'read': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Whether notification is read (default: false)')
            }
        ),
        responses={
            201: NotificationSerializer(),
            400: "Bad request - Invalid data",
            401: "Authentication credentials were not provided",
            403: "Permission denied - Admin access required"
        }
    )
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {"error": f"Failed to create notification: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @swagger_auto_schema(
        operation_description="Mark a notification as read",
        responses={
            200: NotificationSerializer(),
            404: "Notification not found",
            403: "Permission denied"
        }
    )
    @action(detail=True, methods=['patch'])
    def mark_as_read(self, request, pk=None):
        """Mark a notification as read"""
        notification = self.get_object()
        notification.read = True
        notification.save()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)
    
    @swagger_auto_schema(
        operation_description="Mark all notifications as read",
        responses={
            200: "All notifications marked as read",
            403: "Permission denied"
        }
    )
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all notifications as read"""
        notifications = self.get_queryset()
        notifications.update(read=True)
        return Response({'status': 'All notifications marked as read'}, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(
        operation_description="Get count of unread notifications",
        responses={
            200: openapi.Response(
                description="Unread notification count",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'count': openapi.Schema(type=openapi.TYPE_INTEGER)
                    }
                )
            ),
            403: "Permission denied"
        }
    )
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications"""
        count = self.get_queryset().filter(read=False).count()
        return Response({'count': count})
