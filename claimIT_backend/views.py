from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from .models import Claim
from .serializers import ClaimSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, UserProfileSerializer, DisasterUpdateSerializer, ClaimSerializer
from rest_framework import viewsets, permissions, status
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from .models import UserProfile, DisasterUpdate, Claim
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

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
            return UserProfile.objects.filter(user=self.request.user)
        # Return empty queryset for anonymous users (for Swagger)
        return UserProfile.objects.none()

    def get_object(self):
        # Check if user is authenticated
        if not self.request.user.is_authenticated:
            raise NotAuthenticated("Authentication required")
        return UserProfile.objects.get(user=self.request.user)

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
        print('request.data1', request.data)
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
