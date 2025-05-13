from django.urls import path
from .views import UserUpdateView

urlpatterns = [
    path('update/', UserUpdateView.as_view(), name='user-update')
]