from datetime import datetime, timedelta
from django.db import transaction
from django.utils import timezone 
from .serializers import ReservationListSerializer
from restaurants.models import Restaurant
from .models import Reservation, Table, ClientProfile
from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework import permissions
from django.shortcuts import get_object_or_404

class ReservationCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # The 'with transaction.atomic()' block ensures that all database
        # operations within it are either all committed or all rolled back.
        try:
            with transaction.atomic():
                date_str = request.data.get("date")
                table_id = request.data.get("table_id")
                start_time_str = request.data.get("start_time")
                duration_str = request.data.get("duration")
                client_id = request.user.id  
                if not all([table_id, start_time_str, duration_str, client_id]):
                    raise ValidationError("Missing required fields. Required: table_id, start_time, duration, number_of_guests. client_id")
                client_profile = ClientProfile.objects.get(user_id=client_id)
                try:
                    full_datetime_str = f"{date_str} {start_time_str}"
                    datetime_format = "%Y-%m-%d %H:%M"
                    naive_start_time = datetime.strptime(full_datetime_str, datetime_format)
                    aware_start_time = timezone.make_aware(naive_start_time, timezone.get_current_timezone())                    
                    duration_obj = timedelta(minutes=int(duration_str))
                except (TypeError, ValueError):
                    raise ValidationError("Invalid format for start_time, duration")
                
                existing_cancelled_reservation = Reservation.objects.select_for_update().filter(
                    client=client_profile,
                    table_id=table_id,
                    start_time=aware_start_time,
                    duration=duration_obj,
                    status='CANCELLED'
                ).first()

                if existing_cancelled_reservation:
                    existing_cancelled_reservation.status = 'CONFIRMED'
                    existing_cancelled_reservation.save()
                    
                    success_response = {
                        "message": "Your previously cancelled reservation has been successfully re-confirmed!",
                        "reservation_id": existing_cancelled_reservation.id,
                        "restaurant_id": existing_cancelled_reservation.table.setup.restaurant.id,
                    }
                    return Response(success_response, status=status.HTTP_200_OK)
                
                # Fetch the table and lock the row for the duration of the transaction
                # to prevent race conditions from other simultaneous requests.
                table_to_book = Table.objects.select_for_update().get(id=table_id)
                new_reservation = Reservation(
                    table=table_to_book,
                    client=client_profile,
                    start_time=aware_start_time,
                    duration=duration_obj,
                )

                new_reservation.full_clean()
                new_reservation.save()

                success_response = {
                    "message": "Reservation confirmed successfully!",
                    "reservation_id": new_reservation.id,
                    "restaurant_id": table_to_book.setup.restaurant.id,
                }
                return Response(success_response, status=status.HTTP_201_CREATED)

        except Table.DoesNotExist:
            return Response({"success": False, "error": "The selected table does not exist."}, status=status.HTTP_404_NOT_FOUND)
        except ClientProfile.DoesNotExist:
             return Response({"success": False, "error": "No valid client profile found for the logged-in user."}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            error_message = e.messages[0] if isinstance(e.messages, list) else str(e)
            return Response({"success": False, "error": error_message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Unexpected error during reservation creation: {e}")
            return Response(
                {"success": False, "error": "An unexpected server error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ReservationListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        user = request.user
        if pk:
            try:
                restaurant = Restaurant.objects.get(pk=pk, owner=user)
            except Restaurant.DoesNotExist:
                return Response(
                    {"error": "You do not have permission to view reservations for this restaurant."},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            queryset = Reservation.objects.filter(
                table__setup__restaurant=restaurant
            ).select_related(
                'table', 'client__user' 
            ).order_by('-start_time')

        else:
            queryset = Reservation.objects.filter(
                client__user=user
            ).select_related(
                'table', 'client__user' 
            ).order_by('-start_time')

        serializer = ReservationListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ReservationCancelAPIView(APIView):
    """
    Handles cancellation of a reservation.
    This single view serves two URL patterns:
    1. By a client (e.g., /reservations/{res_id}/cancel/)
    2. By a restaurant owner (e.g., /restaurants/{rest_id}/reservations/{res_id}/cancel/)
    """
    permission_classes = [permissions.IsAuthenticated]
    def delete(self, request, reservation_id, restaurant_id=None):
        
        reservation = get_object_or_404(
            Reservation.objects.select_related('client__user', 'table__setup__restaurant__owner'),
            pk=reservation_id
        )
        if restaurant_id is not None:
            if reservation.table.setup.restaurant.id != restaurant_id:
                return Response(
                    {'error': 'This reservation does not belong to the specified restaurant.'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            if reservation.table.setup.restaurant.owner != request.user:
                return Response(
                    {'error': 'You do not have permission to manage this restaurant.'},
                    status=status.HTTP_403_FORBIDDEN
                )
            

        else:
            if reservation.client.user != request.user:
                return Response(
                    {'error': 'You do not have permission to cancel this reservation.'},
                    status=status.HTTP_403_FORBIDDEN
                )

        if reservation.status != 'CONFIRMED':
            return Response(
                {'error': f'This reservation cannot be cancelled as its status is already {reservation.status}.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reservation.status = 'CANCELLED'
        reservation.save()
        
        return Response(
            {'message': 'Reservation has been successfully cancelled.'},
            status=status.HTTP_200_OK
        )