from django.urls import path
from .views import RestaurantListDetailAPIView, CreateRestaurantView, OwnedRestaurantsListView, RestaurantAvailabilityAPIView, TimeSlotCreateAPIView

urlpatterns = [
    path('restaurants/', RestaurantListDetailAPIView.as_view(), name='restaurant-list'),
    path('restaurants/<int:pk>/', RestaurantListDetailAPIView.as_view(), name='restaurant-detail'),
    path('add-restaurant/', CreateRestaurantView.as_view(), name='add-restaurant'),
    path('restaurants/<int:setup_id>/table-types/<int:table_type_id>/time-slots/', TimeSlotCreateAPIView.as_view(), name='create-time-slot'),
    path('restaurants/<int:restaurant_id>/availability/', RestaurantAvailabilityAPIView.as_view(), name='restaurant-availability'),
    path('owned-restaurants/', OwnedRestaurantsListView.as_view(), name='owned-restaurants-list'),
]
