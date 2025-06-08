from django.db import models
from users.models import User
from datetime import time

class OwnerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

# MODEL 1: RESTAURANT (For lightweight API call)
# This model only holds basic, mostly static information.
class Restaurant(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    # main_image_url = models.URLField(blank=True, null=True) maybe we can use this later
    is_validated = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    
# MODEL 2: RESTAURANT SETUP (The hub for your heavy, real-time API call)
# This links all the complex configuration to a restaurant.
class RestaurantSetup(models.Model):
    restaurant = models.OneToOneField(
        Restaurant, 
        on_delete=models.CASCADE, 
        related_name='setup'
    )
    default_slot_duration = models.PositiveIntegerField(
        default=60, 
        help_text="Default duration for a reservation slot in minutes."
    )

    def __str__(self):
        return f'Setup for {self.restaurant.name}'
    
# MODEL 3: TABLE TYPE (Defines the restaurant's resources)
# An owner first defines the types of tables they have.
class TableType(models.Model):
    setup = models.ForeignKey(
        RestaurantSetup, 
        on_delete=models.CASCADE, 
        related_name='table_types'
    )
    capacity = models.PositiveIntegerField(default=2)
    is_smoking = models.BooleanField(default=False)
    # The total number of tables of this type the restaurant has.
    total_quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f'{self.name} ({self.capacity}-person) for {self.setup.restaurant.name}'

# MODEL 4: TIME SLOTS
# An owner creates these records to make a specific table type available at a specific time.
class TimeSlot(models.Model):
    setup = models.ForeignKey(
        RestaurantSetup, 
        on_delete=models.CASCADE, 
        related_name='time_slots'
    )
    table_type = models.ForeignKey(
        TableType, 
        on_delete=models.CASCADE, 
        related_name='time_slots'
    )
    date = models.DateField()
    time = models.TimeField()
    
    # This is how many tables of this type are available for this specific slot.
    # It can be pre-filled by the owner. The reservation app will then decrement this.
    quantity_available = models.PositiveIntegerField()

    class Meta:
        # A specific table type can only have one entry for a given date and time.
        unique_together = ('table_type', 'date', 'time')
        ordering = ['date', 'time']

    def __str__(self):
        return f'{self.quantity_available} x {self.table_type.name} available at {self.time} on {self.date}'
    