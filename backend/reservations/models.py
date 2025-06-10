from django.db import models
from users.models import User
from restaurants.models import Restaurant
from clients.models import ClientProfile

# Create your models here.
class Reservation(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'pending'),
        ('CONFIRMED', 'confirmed'),
        ('BLOCKED', 'blocked'),
    )

    # This directly links a booking to a specific, available slot from the inventory.
    # The TimeSlot is now the single source of truth. 
    # A TimeSlot can only ever belong to one RestaurantSetup, which belongs to one Restaurant. 
    # By linking the Reservation to the TimeSlot, it automatically and reliably inherits the correct restaurant. 

    # time_slot = models.ForeignKey(
    #     TimeSlot,
    #     on_delete=models.CASCADE, # When a TimeSlot is deleted, reservations for it are also deleted.
    #     related_name='reservations'
    # )
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE)
    number_of_guests = models.PositiveIntegerField(
        help_text="How many guests are attending (must be less than or equal to the table's capacity)."
    )
    
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    comment = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        # Add validation logic here.
        if self.number_of_guests > self.time_slot.table_type.capacity:
            raise models.ValidationError(
                f"The number of guests ({self.number_of_guests}) exceeds the capacity of the selected table"
                f"({self.time_slot.table_type.capacity})."
            )

    def __str__(self):
        return (f"Booking for {self.client} at {self.time_slot.setup.restaurant.name} "
                f"({self.time_slot.table_type.name}) on {self.time_slot.date} at {self.time_slot.time}")

