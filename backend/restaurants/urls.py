from django.urls import path
from .views import RestaurantListAPIView, CreateRestaurantView, OwnedRestaurantsListView

urlpatterns = [
    path('restaurants/', RestaurantListAPIView.as_view(), name='restaurants-list'),
    path('add-restaurant/', CreateRestaurantView.as_view(), name='add-restaurant'),
    path('owned-restaurants/', OwnedRestaurantsListView.as_view(), name='owned-restaurants-list'),
]
