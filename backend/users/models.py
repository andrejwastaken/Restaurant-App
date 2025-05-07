from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    ROLE_CHOICES = (
        ('CLIENT', 'client'),
        ('OWNER', 'owner'),
        ('ADMIN', 'admin')
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    phone_number = models.CharField(max_length=20, blank=True)

    email = models.EmailField(unique=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'role', 'phone_number']

    def __str__(self):
        return f"{self.email} - {self.role}"
    
    class Meta:
        db_table= 'users'