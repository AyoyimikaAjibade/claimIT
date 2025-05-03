from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, DisasterUpdate, Claim, ClaimDocument

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

    class Meta:
        model = UserProfile
        fields = ['user', 'phone_number', 'address', 'emergency_contact', 'profile_picture']

class DisasterUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for DisasterUpdate model.
    """
    class Meta:
        model = DisasterUpdate
        fields = '__all__'

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