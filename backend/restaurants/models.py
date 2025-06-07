from django.db import models
from users.models import User

# Create your models here.

class OwnerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

class Restaurant(models.Model):
    owner = models.ForeignKey(OwnerProfile, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank = True, null = True)
    is_validated = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class RestaurantSetup(models.Model):
    restaurant = models.OneToOneField(Restaurant, on_delete=models.CASCADE, related_name='restaurant_setup')

    num_tables = models.IntegerField(default=0)

    timeslots_by_day = models.JSONField(default=dict)

    tables_by_size = models.JSONField(default=dict)

    def __str__(self):
        return f'Setup for {self.restaurant.name}'
    