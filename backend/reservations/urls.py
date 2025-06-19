from django.urls import path
from .views import ReservationCreateAPIView, ReservationListAPIView

urlpatterns = [
    path('create-reservation/', ReservationCreateAPIView.as_view(), name='create_reservation'),
    path('get-reservations/', ReservationListAPIView.as_view(), name='get_reservations'),
    path('get-reservations/<int:pk>/', ReservationListAPIView.as_view(), name='get_reservation_by_id'),
]
