from django.urls import path
from .views import RestaurantListDetailAPIView, CreateRestaurantView, OwnedRestaurantsListView, \
    SetupRestaurantTablesView, OwnedRestaurantDetailView
from .views import RestaurantListDetailAPIView, CreateRestaurantView, OwnedRestaurantsListView, SetupRestaurantTablesView, GeocodeView

urlpatterns = [
    path('restaurants/', RestaurantListDetailAPIView.as_view(), name='restaurant-list'),
    path('restaurants/<int:pk>/', RestaurantListDetailAPIView.as_view(), name='restaurant-detail'),
    path('add-restaurant/', CreateRestaurantView.as_view(), name='add-restaurant'),
    path('restaurants/<int:restaurant_id>/setup-tables/', SetupRestaurantTablesView.as_view(), name='restaurant-setup-tables'),
    # path('restaurants/<int:setup_id>/table-types/<int:table_type_id>/time-slots/', TimeSlotCreateAPIView.as_view(), name='create-time-slot'),
    # path('restaurants/<int:restaurant_id>/availability/', RestaurantAvailabilityAPIView.as_view(), name='restaurant-availability'),
    path('owned-restaurants/', OwnedRestaurantsListView.as_view(), name='owned-restaurants-list'),
    path('owned-restaurants/<int:restaurant_id>/', OwnedRestaurantDetailView.as_view(), name='owned-restaurant-detail'),
    path('geocode/', GeocodeView.as_view(), name='geocode-restaurant')
]
