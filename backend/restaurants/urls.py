from django.urls import path
from .views import RestaurantListAPIView

urlpatterns = [
    path('restaurants/', RestaurantListAPIView.as_view(), name='restaurant-list')
]
