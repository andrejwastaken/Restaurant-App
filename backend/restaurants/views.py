from rest_framework import permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Restaurant, RestaurantSetup, TableType, Table, OperationHours, SpecialDay, FavouriteRestaurant
from .serializers import RestaurantSerializer, RestaurantCreateWithSetupSerializer, TableBulkCreateSerializer, \
    OwnedRestaurantDetailSerializer, RestaurantUpdateSerializer, TableSerializer, SpecialDaySerializer, \
    FavouriteRestaurantListSerializer
from datetime import datetime, timedelta
from django.shortcuts import get_object_or_404
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderUnavailable
from reservations.models import Reservation
from django.db.models import F, ExpressionWrapper, DateTimeField
from django.utils.dateparse import parse_time
from datetime import datetime, timedelta
from django.utils import timezone

class RestaurantListDetailAPIView(APIView):
    def get(self, request, pk=None):
        if pk:
            try:
                restaurant = Restaurant.objects.get(pk=pk)
                serializer = RestaurantSerializer(restaurant)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Restaurant.DoesNotExist:
                return Response({"error": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            restaurants = Restaurant.objects.all()
            serializer = RestaurantSerializer(restaurants, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)


class CreateRestaurantView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = RestaurantCreateWithSetupSerializer(data=request.data, context = {'request': request})

        if serializer.is_valid():
            restaurant = serializer.save()

            return Response({"message": "Restaurant created successfully", 'id': restaurant.id}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SetupRestaurantTablesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, restaurant_id):
        try:
            restaurant = Restaurant.objects.get(pk=restaurant_id, owner=self.request.user)
            return restaurant.setup
        except Restaurant.DoesNotExist:
            return None

    def post(self, request, restaurant_id, *args, **kwargs):
        setup = self.get_object(restaurant_id)

        if not setup:
            return Response(
                {"detail": "Restaurant not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = TableBulkCreateSerializer(
            data = request.data,
            context = {'setup': setup},
            many = True
        )

        if serializer.is_valid():
            # The serializer validation already transformed 'table_type_name' into an object.
            # We can now save it directly.
            tables_to_create = []
            for table_data in serializer.validated_data:
                tables_to_create.append(Table(setup=setup, **table_data))

            Table.objects.bulk_create(tables_to_create)

            return Response({"message": "Floor plan saved successfully."}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateRestaurantView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, restaurant_id):
        # Find the restaurant and ensure the requester is the owner in one step.
        restaurant = get_object_or_404(Restaurant, pk=restaurant_id, owner=request.user)

        # Instantiate the serializer with the instance to update and the new data.
        serializer = RestaurantUpdateSerializer(
            instance=restaurant,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()  # This calls the .update() method in the serializer
            return Response({"message": "Restaurant profile updated successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OwnedRestaurantsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        restaurants = Restaurant.objects.filter(owner=request.user)
        restaurants = Restaurant.objects.filter(owner=request.user)
        serializer = RestaurantSerializer(restaurants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class OwnedRestaurantDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, restaurant_id):
        restaurant = Restaurant.objects.get(pk=restaurant_id, owner=request.user)

        if request.user != restaurant.owner:
            return Response(
                {"detail": "Not found."},
                status = status.HTTP_404_NOT_FOUND
            )

        serializer = OwnedRestaurantDetailSerializer(restaurant)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GeocodeView(APIView):
    def post(self, request, *args, **kwargs):
        address = request.data.get('address')
        if not address:
            return Response({'error': 'Address is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Since your app is only for Skopje, adding it to the query improves results
        geolocator = Nominatim(user_agent="skopje_restaurant_app")
        try:
            location = geolocator.geocode(f"{address}, Skopje, North Macedonia")
            if location:
                return Response({
                    'latitude': location.latitude,
                    'longitude': location.longitude
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ReverseGeocodeView(APIView):
    def post(self, request, *args, **kwargs):
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')

        if not latitude or not longitude:
            return Response(
                {'error': 'Latitude and Longitude are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        geolocator = Nominatim(user_agent="skopje_restaurant_app_reverse")
        
        try:
            location = geolocator.reverse(
                f"{latitude}, {longitude}",
                exactly_one=True,
                language='mk,en' 
            )

            if not location:
                return Response(
                    {'error': 'Address not found for these coordinates'},
                    status=status.HTTP_404_NOT_FOUND
                )

            address_parts = location.raw.get('address', {})
            city_keys = ['city', 'town', 'county', 'municipality']
            skopje_names = {'Skopje', 'Скопје'}

            is_in_skopje = any(
                address_parts.get(key) in skopje_names for key in city_keys
            )

            if not is_in_skopje:
                return Response(
                    {'error': 'The selected location is outside Skopje.'},
                    status=status.HTTP_400_BAD_REQUEST 
                )

            return Response({'address': location.address}, status=status.HTTP_200_OK)

        except GeocoderUnavailable:
            return Response(
                {'error': 'Geocoding service is unavailable. Please try again later.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            return Response(
                {'error': 'An unexpected error occurred.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )        
        
class RestaurantAvailabilityAPIView(APIView):
    """
    Checks table availability, correctly handling both special day schedules and
    regular weekly hours with different weekday conventions.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, restaurant_id):
        date_str = request.query_params.get('date')
        time_str = request.query_params.get('time') 
        party_size_str = request.query_params.get('party_size')
        duration_str = request.query_params.get('duration', '120') 
        is_smoker_str = request.query_params.get('is_smoker', 'false')

        if not all([date_str, time_str, party_size_str]):
            return Response({'error': 'Missing required parameters: date, time, party_size'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            naive_start_time = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
            start_time = timezone.make_aware(naive_start_time, timezone.get_current_timezone())
            duration = timedelta(minutes=int(duration_str))
            end_time = start_time + duration
            party_size = int(party_size_str)
            is_smoker = True if is_smoker_str.lower() == 'true' else False
        except (ValueError, TypeError):
            return Response({'error': 'Invalid format for parameters.'}, status=status.HTTP_400_BAD_REQUEST)

        restaurant = get_object_or_404(Restaurant, pk=restaurant_id)
        setup = get_object_or_404(RestaurantSetup, restaurant=restaurant)
        request_date = start_time.date()
        
        effective_op_hours = None

        special_day = SpecialDay.objects.filter(setup=setup, day=request_date).first()

        if special_day:
            effective_op_hours = special_day
        else:
            python_weekday = request_date.weekday()  # Monday=0, ..., Sunday=6
            weekday_map = {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 0}
            db_day_of_week = weekday_map[python_weekday]

            try:
                effective_op_hours = OperationHours.objects.get(setup=setup, day_of_week=db_day_of_week)
            except OperationHours.DoesNotExist:
                return Response({'error': 'The restaurant is not open on the selected day.'}, status=status.HTTP_400_BAD_REQUEST)

        if not effective_op_hours:
            return Response({'error': 'The restaurant is not open on the selected day.'}, status=status.HTTP_400_BAD_REQUEST)
        
        current_tz = timezone.get_current_timezone()

        naive_open_datetime = datetime.combine(request_date, effective_op_hours.open_time)
        naive_close_datetime = datetime.combine(request_date, effective_op_hours.close_time)

        open_datetime = timezone.make_aware(naive_open_datetime, current_tz)
        close_datetime = timezone.make_aware(naive_close_datetime, current_tz)

        if close_datetime < open_datetime:
            close_datetime += timedelta(days=1)

        if not (start_time >= open_datetime and end_time <= close_datetime):
            return Response({'error': 'Requested time is outside operational hours.'}, status=status.HTTP_400_BAD_REQUEST)
        
        existing_end_time_expression = ExpressionWrapper(F('start_time') + F('duration'), output_field=DateTimeField())

        conflicting_reservations = Reservation.objects.filter(
            table__setup__restaurant_id=restaurant_id,
            status='CONFIRMED'
        ).annotate(
            end_time=existing_end_time_expression
        ).filter(
            start_time__lt=end_time,  
            end_time__gt=start_time  
        )

        booked_table_ids = set(conflicting_reservations.values_list('table_id', flat=True))

        all_restaurant_tables = Table.objects.filter(setup=setup).select_related('table_type')
        
        available_tables = []
        unavailable_tables = []

        for table in all_restaurant_tables:
            is_not_booked = table.id not in booked_table_ids
            has_enough_capacity = table.table_type.capacity >= party_size
            matches_smoking_pref = table.is_smoking == is_smoker

            if is_not_booked and has_enough_capacity and matches_smoking_pref:
                available_tables.append(table)
            else:
                unavailable_tables.append(table)

        available_serializer = TableSerializer(available_tables, many=True)
        unavailable_serializer = TableSerializer(unavailable_tables, many=True)

        return Response({
            'tables': available_serializer.data,
            'unavailable': unavailable_serializer.data,
        }, status=status.HTTP_200_OK)
class SpecialDayAddAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, restaurant_id):
        restaurant = get_object_or_404(Restaurant, pk=restaurant_id, owner=request.user)

        setup = restaurant.setup

        if not setup:
            return Response({"error": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = SpecialDaySerializer(
            data=request.data,
            context={'setup': setup }
        )

        if serializer.is_valid():
            serializer.save()  # This calls the .update() method in the serializer
            return Response({"message": "Special day added successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SpecialDayGetAPIView(APIView):
    permissions_classes = [permissions.IsAuthenticated]

    def get(self, restaurant_id):
        restaurant = get_object_or_404(Restaurant, pk=restaurant_id)
        setup = restaurant.setup

        if not setup:
            return Response({"error": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)

        special_days = SpecialDay.objects.filter(setup=setup)

        serializer = SpecialDaySerializer(special_days, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class SpecialDayDeleteAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, restaurant_id, special_day_id, *args, **kwargs):
        """
        Handles DELETE requests to delete a specific SpecialDay.
        """
        # Manually perform the security check and get the object
        special_day = get_object_or_404(
            SpecialDay,
            id=special_day_id,
            setup__restaurant__id=restaurant_id,
            setup__restaurant__owner=request.user
        )

        # Delete the object
        special_day.delete()

        # Return a success response. HTTP 204 means "No Content" and is standard for successful deletes.
        return Response({"message": "Special day deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class ToggleFavouriteRestaurantView(APIView):
    """
    A view to add or remove a restaurant from a user's favourites.
    - POST: Adds the restaurant to favourites.
    - DELETE: Removes the restaurant from favourites.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, restaurant_id):
        """Check if restaurant is favourited by user"""
        restaurant = get_object_or_404(Restaurant, pk=restaurant_id)
        is_favorited = FavouriteRestaurant.objects.filter(
            user=request.user,
            restaurant=restaurant
        ).exists()

        return Response({
            'is_favorited': is_favorited,
            'restaurant_id': restaurant_id
        })

    def post(self, request, restaurant_id):
        """Add to favourites"""
        user = request.user
        restaurant = get_object_or_404(Restaurant, pk=restaurant_id)

        favourite, created = FavouriteRestaurant.objects.get_or_create(
            user=user,
            restaurant=restaurant
        )

        return Response({
            'is_favorited': True,
            'message': "Restaurant added to favourites."
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def delete(self, request, restaurant_id):
        """Remove from favourites"""
        user = request.user
        restaurant = get_object_or_404(Restaurant, pk=restaurant_id)

        deleted_count, _ = FavouriteRestaurant.objects.filter(
            user=user,
            restaurant=restaurant
        ).delete()

        if deleted_count > 0:
            return Response({
                'is_favorited': False,
                'message': "Restaurant removed from favourites."
            }, status=status.HTTP_200_OK)

        return Response({
            'is_favorited': False,
            'message': "Restaurant was not in favourites."
        }, status=status.HTTP_404_NOT_FOUND)


class ListUserFavouritesView(APIView):
    """
    Returns a list of all favourite restaurants for the currently
    authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        This view should return a list of all the favourites
        for the currently authenticated user.
        """
        favourite_restaurants = FavouriteRestaurant.objects.filter(
            user=request.user
        )

        serializer = FavouriteRestaurantListSerializer(favourite_restaurants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

