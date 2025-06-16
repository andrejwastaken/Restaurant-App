from rest_framework import permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Restaurant, RestaurantSetup, TableType, Table
from .serializers import RestaurantSerializer, RestaurantCreateWithSetupSerializer, TableBulkCreateSerializer
from datetime import datetime
from collections import defaultdict
from django.shortcuts import get_object_or_404
from geopy.geocoders import Nominatim


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
        serializer = RestaurantSerializer(restaurants, many=True)
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
        
# class RestaurantAvailabilityAPIView(APIView):
#     """
#     Handles GET requests for a restaurant's real-time availability on a specific date.
#     """
#     permission_classes = [permissions.IsAuthenticated]
#
#     def get(self, request, restaurant_id):
#         # 1. Get and validate the date from query parameters
#         date_str = request.query_params.get('date')
#         if not date_str:
#             return Response({"error": "A 'date' query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
#
#         try:
#             requested_date = datetime.strptime(date_str, '%d-%m-%Y').date()
#         except ValueError:
#             return Response({"error": "Invalid date format. Use DD-MM-YYYY."}, status=status.HTTP_400_BAD_REQUEST)
#
#         # 2. Fetch all available time slots for that restaurant and date from the database
#         time_slots = TimeSlot.objects.filter(
#             setup__restaurant_id=restaurant_id,
#             date=requested_date,
#             quantity_available__gt=0  # Only fetch slots that have at least 1 table available
#         ).select_related('table_type').order_by('time')
#
#         # 3. Group the flat list of slots into a nested structure by time
#         grouped_slots = defaultdict(list)
#         for slot in time_slots:
#             # We use strftime to get a consistent key like "19:00:00"
#             grouped_slots[slot.time.strftime('%H:%M:%S')].append(slot)
#
#         # 4. Format the response
#         response_data = []
#         for time, slots_at_time in grouped_slots.items():
#             response_data.append({
#                 'time': time,
#                 'available_tables': TimeSlotSerializer(slots_at_time, many=True).data
#             })
#
#         return Response(response_data)