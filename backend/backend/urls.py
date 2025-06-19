from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('restaurants.urls')),
    path('api/reservations/', include('reservations.urls')),
    path('auth/', include('auth_form.urls')),
    path('api/user/', include('users.urls'))
]
