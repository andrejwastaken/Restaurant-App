from django.db import models
from users.models import User
# Create your models here.

class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    # potentially can add more fields in the future, such as descriptions/preferences

    def __str__(self):
        return self.user.email
    
