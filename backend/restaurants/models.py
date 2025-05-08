from django.db import models
from users.models import User

# Create your models here.

class OwnerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

class Restaurant(models.Model):
    owner = models.ForeignKey(OwnerProfile, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank = True, null = True)

    def __str__(self):
        return self.name
    