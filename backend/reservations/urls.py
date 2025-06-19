from django.urls import path
from .views import ReservationCreateAPIView

urlpatterns = [
    path('create-reservation/', ReservationCreateAPIView.as_view(), name='create_reservation'),
    
]
