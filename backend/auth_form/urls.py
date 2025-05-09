from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import RegisterView, LoginView, LogoutView

urlpatterns = [
    path('register/', RegisterView.as_view(), name = 'register'),
    path('login/', TokenObtainPairView.as_view(), name = 'token_obtain_pair'),
    path('logout/', LogoutView.as_view(), name = 'logout'),
    path('refresh/', TokenRefreshView.as_view(), name = 'token_refresh'),

]