from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    emergency_contact = models.CharField(max_length=100, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s profile"

class Claim(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('settled', 'Settled')
    ]
    
    DISASTER_CHOICES = [
        ('wildfire', 'Wildfire'),
        ('flood', 'Flood'),
        ('earthquake', 'Earthquake'),
        ('hurricane', 'Hurricane'),
        ('tornado', 'Tornado'),
        ('other', 'Other')
    ]
    
    PROPERTY_TYPE_CHOICES = [
        ('automobile', 'Automobile'),
        ('house', 'House'),
        ('business', 'Business'),
        ('other', 'Other')
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    disaster_type = models.CharField(max_length=50, choices=DISASTER_CHOICES)
    property_type = models.CharField(max_length=50, choices=PROPERTY_TYPE_CHOICES)
    description = models.TextField()
    estimated_loss = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    predicted_approval = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    predicted_limit = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Additional fields for better tracking
    documents = models.FileField(upload_to='claim_documents/', null=True, blank=True)
    insurance_policy_number = models.CharField(max_length=50, unique=True, null=True, blank=True)
    claim_number = models.CharField(max_length=50, unique=True, null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.disaster_type} - {self.status}"
    
    class Meta:
        ordering = ['-created_at']

def validate_document_size(file):
    max_size = 5 * 1024 * 1024  # 5MB
    if file.size > max_size:
        raise ValidationError("Max file size is 5MB.")

def user_claim_directory_path(instance, filename):
    return f'user_{instance.claim.user.id}/claims/{instance.claim.id}/{filename}'

class ClaimDocument(models.Model):
    claim = models.ForeignKey('Claim', related_name='claim_documents', on_delete=models.CASCADE)
    file = models.FileField(
        upload_to=user_claim_directory_path,
        validators=[
            FileExtensionValidator(allowed_extensions=['pdf','png','jpg','jpeg','gif','zip']),
            validate_document_size
        ]
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

class DisasterUpdate(models.Model):
    DISASTER_TYPES = [
        ('wildfire', 'Wildfire'),
        ('flood', 'Flood'),
        ('earthquake', 'Earthquake'),
        ('hurricane', 'Hurricane'),
        ('tornado', 'Tornado'),
        ('other', 'Other')
    ]
    
    disaster_type = models.CharField(max_length=50, choices=DISASTER_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    severity = models.IntegerField(choices=[(1, 'Low'), (2, 'Medium'), (3, 'High')])
    source = models.CharField(max_length=100, help_text="Source of the update (e.g., FEMA, local government)")
    url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']

class Notification(models.Model):
    """
    Model for storing user notifications
    """
    NOTIFICATION_TYPES = (
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('info', 'Information'),
        ('danger', 'Danger'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=100)
    message = models.TextField()
    type = models.CharField(max_length=10, choices=NOTIFICATION_TYPES, default='info')
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.title} - {self.user.username}"