from django.urls import path
from .views import RestaurantListAPIView, CreateRestaurantView

urlpatterns = [
    path('restaurants/', RestaurantListAPIView.as_view(), name='restaurant-list'),
    path('add-restaurant/', CreateRestaurantView.as_view(), name='add-restaurant'),
]
