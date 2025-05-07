from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import User
from .models import ClientProfile

@receiver(post_save, sender=User)
def create_client_profile(sender, instance, created, **kwargs):
    if created:
        ClientProfile.objects.create(user=instance)
