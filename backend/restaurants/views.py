from rest_framework import permissions, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Restaurant, RestaurantSetup, TableType, Table, OperationHours, SpecialDay
from .serializers import RestaurantSerializer, RestaurantCreateWithSetupSerializer, TableBulkCreateSerializer, \
    OwnedRestaurantDetailSerializer, RestaurantUpdateSerializer, TableSerializer, SpecialDaySerializer
from datetime import datetime, timedelta
from collections import defaultdict
from django.shortcuts import get_object_or_404
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderUnavailable
from reservations.models import Reservation
from django.db.models import F, ExpressionWrapper, DateTimeField

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
            print(serializer.validated_data)
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


# class TimeSlotCreateAPIView(APIView):
#     permission_classes = [permissions.IsAuthenticated]
#
#     def post(self, request, setup_id, table_type_id, *args, **kwargs):
#         # 1. Verify that the owner making the request owns this setup.
#         setup = get_object_or_404(RestaurantSetup, id=setup_id, restaurant__owner=request.user)
#         table_type = get_object_or_404(TableType, id=table_type_id, setup=setup)
#
#         serializer = TimeSlotCreateSerializer(data=request.data, many=isinstance(request.data, list))
#
#         if serializer.is_valid():
#             slots_data = serializer.validated_data
#
#             slots_to_create = []
#             for slot_data in (slots_data if isinstance(slots_data, list) else [slots_data]):
#                 # Validation: Ensure quantity doesn't exceed the total tables of this type.
#                 if slot_data['quantity_available'] > table_type.total_quantity:
#                     return Response(
#                         {"error": f"Quantity ({slot_data['quantity_available']}) cannot exceed the total available tables of this type ({table_type.total_quantity})."},
#                         status=status.HTTP_400_BAD_REQUEST
#                     )
#
#                 slots_to_create.append(
#                     TimeSlot(
#                         setup=setup,
#                         table_type=table_type,
#                         date=slot_data['date'],
#                         time=slot_data['time'],
#                         quantity_available=slot_data['quantity_available']
#                     )
#                 )
#
#             # Use `bulk_create` for efficiency if creating multiple slots.
#             TimeSlot.objects.bulk_create(slots_to_create)
#
#             return Response({"message": f"{len(slots_to_create)} time slot(s) created successfully."}, status=status.HTTP_201_CREATED)
#
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
            print(f"Error during reverse geocoding: {e}")
            return Response(
                {'error': 'An unexpected error occurred.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )        
        
class RestaurantAvailabilityAPIView(APIView):
    """
    Checks table availability, now including conflicts with existing reservations.
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
            start_time = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
            duration = timedelta(minutes=int(duration_str))
            end_time = start_time + duration
            party_size = int(party_size_str)
            is_smoker = True if is_smoker_str.lower() == 'true' else False
        except (ValueError, TypeError):
            return Response({'error': 'Invalid format for parameters.'}, status=status.HTTP_400_BAD_REQUEST)

        restaurant = get_object_or_404(Restaurant, pk=restaurant_id)
        setup = get_object_or_404(RestaurantSetup, restaurant=restaurant)
        day_of_week = start_time.weekday() # Monday=0, Sunday=6

        try:
            op_hours = OperationHours.objects.get(setup=setup, day_of_week=day_of_week)
            if not (op_hours.open_time <= start_time.time() and end_time.time() <= op_hours.close_time):
                 return Response({'error': 'Requested time is outside operational hours.'}, status=status.HTTP_400_BAD_REQUEST)
        except OperationHours.DoesNotExist:
            return Response({'error': 'The restaurant is not open on the selected day.'}, status=status.HTTP_400_BAD_REQUEST)

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
            # A table is available if it meets all criteria:
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
            context={'setup': setup}
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

        