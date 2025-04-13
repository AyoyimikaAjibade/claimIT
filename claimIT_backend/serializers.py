from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, DisasterUpdate, Claim

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

class ClaimSerializer(serializers.ModelSerializer):
    """
    Serializer for Claim model.
    """
    class Meta:
        model = Claim
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'predicted_approval', 'predicted_limit']
        
    def create(self, validated_data):
        # Auto-generate claim number if not provided
        if 'claim_number' not in validated_data:
            import datetime
            import random
            today = datetime.date.today()
            random_num = random.randint(1000, 9999)
            validated_data['claim_number'] = f"CLM-{today.year}-{random_num}"
        
        # Set the user from the request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)