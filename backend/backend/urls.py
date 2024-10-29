from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from api.views.auth import CustomTokenObtainPairView, CustomTokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

def home_view(request):
    return HttpResponse("Welcome to the BattleForces API")


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', CustomTokenRefreshView.as_view(), name='refresh_token'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include('api.urls')),
    path('', home_view, name='home'),
]

if settings.DEBUG:  # Only serve media files during development
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
