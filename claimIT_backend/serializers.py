from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, DisasterUpdate, Claim, ClaimDocument, Notification
import re

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        # Create UserProfile for the new user
        UserProfile.objects.create(user=user)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for UserProfile model.
    """
    user = UserSerializer(read_only=True)
    full_address = serializers.ReadOnlyField()

    class Meta:
        model = UserProfile
        fields = [
            'user', 
            'phone_number', 
            'street_address',
            'city',
            'state',
            'country',
            'postal_code',
            'full_address',
            'emergency_contact', 
            'profile_picture'
        ]

    def validate_state(self, value):
        """Validate state code format for US addresses"""
        if self.initial_data.get('country') == 'United States':
            if not re.match(r'^[A-Z]{2}$', value):
                raise serializers.ValidationError(
                    "For US addresses, state must be a valid 2-letter state code (e.g., CA for California)"
                )
        return value.upper() if value else value

    def validate_postal_code(self, value):
        """Validate postal code format"""
        if value and not re.match(r'^\d{5}(-\d{4})?$', value) and self.initial_data.get('country') == 'United States':
            raise serializers.ValidationError("US postal codes must be in the format 12345 or 12345-6789")
        return value

    def validate_phone_number(self, value):
        """Validate phone number format"""
        if value and not re.match(r'^\+?1?\d{9,15}$', value):
            raise serializers.ValidationError("Phone number must be entered in the format: '+1234567890'. Up to 15 digits allowed.")
        return value

    def validate(self, data):
        """Validate that all required address fields are provided"""
        required_fields = ['street_address', 'city', 'state', 'country', 'postal_code']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            raise serializers.ValidationError({
                field: "This field is required" for field in missing_fields
            })
        
        return data

class DisasterUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for DisasterUpdate model.
    """
    updated_at_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = DisasterUpdate
        fields = [
            'id', 
            'title', 
            'location', 
            'disaster_type', 
            'severity', 
            'declaration_type',
            'declaration_display',
            'assistance_available',
            'source', 
            'url', 
            'updated_at',
            'updated_at_formatted'
        ]
    
    def get_updated_at_formatted(self, obj):
        """Return formatted date for frontend display"""
        return obj.updated_at.strftime('%Y-%m-%d') if obj.updated_at else ''

class ClaimDocumentSerializer(serializers.ModelSerializer):
    """Serializer for uploaded claim documents"""
    class Meta:
        model = ClaimDocument
        fields = ['id', 'file', 'uploaded_at']

class ClaimSerializer(serializers.ModelSerializer):
    # Expect list of files under 'documents' key
    documents = serializers.ListField(
        child=serializers.FileField(), write_only=True, required=False
    )
    # Nested read-only list of saved documents
    claim_documents = ClaimDocumentSerializer(many=True, read_only=True)
    """
    Serializer for Claim model.
    """
    class Meta:
        model = Claim
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'predicted_approval', 'predicted_limit', 'claim_number', 'insurance_policy_number']
        
    def create(self, validated_data):
        # Extract files and remove from data
        
        document_files = validated_data.pop('documents', [])
        # Associate user and create claim
        validated_data['user'] = self.context['request'].user
        claim = super().create(validated_data)
        # Save each uploaded file
        for f in document_files:
            ClaimDocument.objects.create(claim=claim, file=f)
        # Build and save identifiers
        from datetime import date
        year = date.today().year
        suffix = claim.id
        claim.claim_number = f"CLM-{year}{suffix}"
        claim.insurance_policy_number = f"POL{year}{suffix}"
        claim.save()
        return claim

class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for Notification model.
    """
    created_at_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = ['id', 'user', 'title', 'message', 'type', 'read', 'created_at', 'created_at_formatted']
        read_only_fields = ['created_at']
    
    def get_created_at_formatted(self, obj):
        """Return formatted date for frontend display"""
        return obj.created_at.strftime('%Y-%m-%d')