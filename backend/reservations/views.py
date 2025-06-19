from datetime import datetime, date, time, timedelta
from django.db import transaction

from .serializers import ReservationListSerializer
from restaurants.models import Restaurant
from .models import Reservation, Table, ClientProfile
from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from restaurants.serializers import TableSerializer

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
                    start_time_obj = datetime.strptime(full_datetime_str, datetime_format)                    
                    duration_obj = timedelta(minutes=int(duration_str))
                except (TypeError, ValueError):
                    raise ValidationError("Invalid format for start_time, duration")

                # Fetch the table and lock the row for the duration of the transaction
                # to prevent race conditions from other simultaneous requests.
                table_to_book = Table.objects.select_for_update().get(id=table_id)
                new_reservation = Reservation(
                    table=table_to_book,
                    client=client_profile,
                    start_time=start_time_obj,
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
            return Response({"success": False, "error": e.messages[0]}, status=status.HTTP_400_BAD_REQUEST)
        
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

        # --- Use Case 1: Fetching reservations for a restaurant owner ---
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



@transaction.atomic # Ensure that all operations are atomic (all or nothing)
def cancel_reservation(reservation_id, client_id):
    try:
        # Ensure the user cancelling is the one who owns the reservation.
        reservation = Reservation.objects.get(id=reservation_id, client__user_id=client_id)
    except Reservation.DoesNotExist:
        raise ValueError("Reservation not found or you do not have permission to cancel it.")

    # Do not cancel already-cancelled reservations.
    if reservation.status == Reservation.ReservationStatus.CANCELLED:
        raise ValueError("This reservation has already been cancelled.")
    
    reservation.status = Reservation.ReservationStatus.CANCELLED
    reservation.save()

    time_slot = reservation.time_slot
    time_slot.quantity_available += 1
    time_slot.save()

    return reservation 

@transaction.atomic # This is critical for managing inventory correctly.
def update_reservation_status_by_owner(reservation_id, owner_id, new_status):
    try:
        # Fetch reservation, ensuring the owner is the one managing this restaurant.
        reservation = Reservation.objects.select_related('time_slot').get(
            id=reservation_id, 
            time_slot__setup__restaurant__owner_id=owner_id
        )
    except Reservation.DoesNotExist:
        raise ValueError("Reservation not found or you do not manage this restaurant.")
    
    # Validate that the new status is a valid choice.
    valid_statuses = [choice[0] for choice in Reservation.STATUS_CHOICES]
    if new_status not in valid_statuses:
        raise ValueError(f"'{new_status}' is not a valid reservation status.")

    old_status = reservation.status
    
    # If the status isn't changing, do nothing.
    if old_status == new_status:
        return reservation

    # If an active reservation ('PENDING' or 'CONFIRMED') is being blocked, we need to return the spot to the inventory.
    if new_status == 'BLOCKED' and old_status != 'BLOCKED':
        reservation.time_slot.quantity_available += 1
        reservation.time_slot.save()
        print("The reservation is being blocked for the first time.")
    
    elif old_status == 'BLOCKED' and new_status != 'BLOCKED':
        reservation.time_slot.quantity_available -= 1
        reservation.time_slot.save()
        print("The reservation is being unblocked, returning the spot to the inventory.")
    
    
    reservation.status = new_status
    reservation.save()
    
    return reservation