from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static

schema_view = get_schema_view(
   openapi.Info(
      title="claimIT API",
      default_version='v1',
      description="API documentation for claimIT disaster insurance claims management system",
      terms_of_service="",
      contact=openapi.Contact(email="contact@claimit.com"),
      license=openapi.License(name="MIT License"),
   ),
   public=True,
   authentication_classes=[],
   permission_classes=(permissions.AllowAny,),
   url=getattr(settings, 'SWAGGER_URL', None)
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('claimIT_backend.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)