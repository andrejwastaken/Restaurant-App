from django.db import transaction
from restaurants.models import TimeSlot
from .models import Reservation
from django.core.exceptions import ValidationError

@transaction.atomic # Ensure that all operations are atomic (all or nothing)
def create_reservation(request_data):
    time_slot_id = request_data.get('time_slot_id')
    client_profile = request_data.get('client')
    num_guests = request_data.get('number_of_guests')

    if not time_slot_id or not client_profile or not num_guests:
        raise ValueError("Missing required fields: time_slot_id, client, or number_of_guests")
    
    try:
        slot_to_book = TimeSlot.objects.select_for_update().get(id=time_slot_id)
    except TimeSlot.DoesNotExist:
        raise ValueError("Time slot does not exist")

    if slot_to_book.quantity_available <= 0:
        raise ValueError("No available slots for this time slot.")

    if num_guests > slot_to_book.table_type.capacity:
        raise ValueError(f"Number of guests ({num_guests}) exceeds the capacity of the selected table ({slot_to_book.table_type.capacity}).")
    

    new_reservation = Reservation.objects.create(
        time_slot=slot_to_book, 
        client=client_profile, 
        number_of_guests=num_guests, 
        comment=request_data.get('comment', ''),
        )

    slot_to_book.quantity_available -= 1
    slot_to_book.save()

    return new_reservation

def update_reservation(reservation_id, user_id, request_data):
    try:
        reservation = Reservation.objects.get(id=reservation_id, client__user_id=user_id)
    except Reservation.DoesNotExist:
        raise ValueError("Reservation does not exist")

    # Get the proposed new number of guests from the request. If not provided, it defaults to the current number.
    new_guest_count = request_data.get('number_of_guests', reservation.number_of_guests)

    # Check if the new guest count is valid for the booked table type.
    if new_guest_count > reservation.time_slot.table_type.capacity:
        raise ValueError(
            f"The new number of guests ({new_guest_count}) exceeds the capacity "
            f"of the selected table ({reservation.time_slot.table_type.capacity})."
        )
    
    reservation.number_of_guests = new_guest_count
    reservation.comment = request_data.get('comment', reservation.comment)
    
    try:
        reservation.full_clean()
    except ValidationError as e:
        raise ValueError(f"Invalid data: {e}")

    reservation.save()
    return reservation

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