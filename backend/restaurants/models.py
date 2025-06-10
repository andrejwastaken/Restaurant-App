from django.db import models
from users.models import User

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
        related_name='table_types',
        help_text="The restaurant setup this table type belongs to."
    )
    name= models.CharField(
        max_length=100, 
        help_text="A descriptive name for this table type (e.g., '2-person table', '4-person booth')."
    )
    capacity = models.PositiveIntegerField(
        default=2,
        help_text="The maximum number of guests this type of table can accomodate"
    )

    class Meta:
        unique_together = ('setup', 'name')
        verbose_name='Table Type'
        verbose_name_plural='Table Types'

    def __str__(self):
        return f'{self.name} ({self.capacity}-person) for {self.setup.restaurant.name}'

class Table(models.Model):
    SHAPE_CHOICES = (
        ('RECTANGLE', 'Rectangle'),
        ('CIRCLE', 'Circle'),
    )

    setup = models.ForeignKey(
        RestaurantSetup,
        on_delete=models.CASCADE,
        related_name='tables',
        help_text="The restaurant setup this table belongs to."
    )
    table_type = models.ForeignKey(
        TableType,
        on_delete=models.CASCADE,
        related_name='tables',
        help_text="The table type this table belongs to."
    )
    name = models.CharField(max_length=50)
    is_smoking = models.BooleanField(
        default=False,
        help_text="Is smoking allowed on this table"
    )

    #CANVAS POSITIONING LOGIC
    x_position = models.PositiveIntegerField()
    y_position = models.PositiveIntegerField()
    width = models.PositiveIntegerField()
    height = models.PositiveIntegerField()
    shape = models.CharField(
        max_length = 10,
        choices=SHAPE_CHOICES,
        default='RECTANGLE',
        help_text="The shape this table has on canvas"
    )

    class Meta:
        unique_together = ('setup', 'name')
        verbose_name='Table'
        verbose_name_plural='Tables'

    def __str__(self):
        return f"Table {self.name} for type {self.table_type.name} in {self.setup.restaurant.name}"

# OPERATION HOURS MODEL FOR DEFAULT BEHAVIOUR FOR A RESTAURANT
class OperationHours(models.Model):
    DAY_CHOICES = (
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    )

    setup = models.ForeignKey(
        RestaurantSetup, 
        on_delete=models.CASCADE, 
        related_name='operating_hours'
    )
    day_of_week = models.IntegerField(
        choices=DAY_CHOICES,
        help_text="The day of the week this table belongs to."
    )
    open_time = models.TimeField()
    close_time = models.TimeField()

    class Meta:
        # A specific table type can only have one entry for a given date and time.
        unique_together = ('setup', 'day_of_week', 'open_time', 'close_time')
        ordering = ['day_of_week', 'open_time']
        verbose_name='Operating Hour'
        verbose_name_plural='Operating Hours'

    def __str__(self):
        return (f'{self.get_day_of_week_display()}: '
                f'{self.open_time.strftime("%H:%M")} - '
                f'{self.close_time.strftime("%H:%M")}')
