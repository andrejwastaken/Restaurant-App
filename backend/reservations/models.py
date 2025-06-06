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
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, limit_choices_to={'is_client': True})
    restaurant = models.ForeignKey(Restaurant, on_delete = models.CASCADE)
    date_time = models.DateTimeField()
    number_of_people = models.IntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    comment = models.TextField(blank=True, null=True)
    is_smoker = models.BooleanField(default = False)
    
    def __str__(self):
        return f"{self.client.user.email} - {self.restaurant.name} at {self.date_time}"

    
