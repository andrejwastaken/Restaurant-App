from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
# Create your models here.

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The email field must be set")
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setDefault("is_staff", True)
        extra_fields.setDefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

class BaseUser(AbstractBaseUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length = 30)
    last_name = models.CharField(max_length = 30)
    phone_number = models.CharField(max_length = 20)
    password = models.charField(max_length = 255)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number']

    objects = CustomUserManager()

    class Meta:
        abstract = True

    def __str__(self):
        return self.email

class Client(BaseUser):
    is_smoker = models.BooleanField(default=False)

    def __str__(self):
        return f"Client: {self.email} - {self.first_name} {self.last_name}"

class RestaurantOwner(BaseUser):
    restaurant_name = models.CharField(max_length=255)
    
    def __str__(self):
        return f"Restaurant Owner: {self.email} - {self.restaurant_name}"
