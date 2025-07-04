from django.urls import path
from .views import RestaurantListDetailAPIView, CreateRestaurantView, OwnedRestaurantsListView, \
    SetupRestaurantTablesView, OwnedRestaurantDetailView, UpdateRestaurantView, SpecialDayAddAPIView, \
    SpecialDayGetAPIView, SpecialDayDeleteAPIView, ToggleFavouriteRestaurantView, ListUserFavouritesView
from .views import RestaurantListDetailAPIView, CreateRestaurantView, OwnedRestaurantsListView, \
    SetupRestaurantTablesView, GeocodeView, ReverseGeocodeView, RestaurantAvailabilityAPIView

urlpatterns = [
    path('restaurants/', RestaurantListDetailAPIView.as_view(), name='restaurant-list'),
    path('restaurants/<int:pk>/', RestaurantListDetailAPIView.as_view(), name='restaurant-detail'),
    path('add-restaurant/', CreateRestaurantView.as_view(), name='add-restaurant'),
    path('restaurants/<int:restaurant_id>/setup-tables/', SetupRestaurantTablesView.as_view(),
         name='restaurant-setup-tables'),
    path('owned-restaurants/', OwnedRestaurantsListView.as_view(), name='owned-restaurants-list'),
    path('owned-restaurants/<int:restaurant_id>/', OwnedRestaurantDetailView.as_view(), name='owned-restaurant-detail'),
    path(
        'owned-restaurants/<int:restaurant_id>/update-profile/',
        UpdateRestaurantView.as_view(),
        name='owned-restaurant-update-profile'
    ),
    path('restaurants-availability/<int:restaurant_id>/', RestaurantAvailabilityAPIView.as_view(), name='restaurant-availability'),
    path('owned-restaurant/<int:restaurant_id>/add-special-day/', SpecialDayAddAPIView.as_view(), name='add-special-day'),
    path('owned-restaurant/<int:restaurant_id>/get-special-days/', SpecialDayGetAPIView.as_view(), name='get-special-days'),
    path('owned-restaurant/<int:restaurant_id>/special-day/<int:special_day_id>/delete/', SpecialDayDeleteAPIView.as_view(), name='special-day-delete'),
    path('favourite-restaurant/toggle/<int:restaurant_id>/', ToggleFavouriteRestaurantView.as_view(), name="favourite-restaurant-toggle"),
    path('favourite-restaurants/list/', ListUserFavouritesView.as_view(), name="get-user-favourites"),
    path('geocode/', GeocodeView.as_view(), name='geocode-restaurant'),
    path('reverse-geocode/', ReverseGeocodeView.as_view(), name='reverse-geocode-restaurant')
]
