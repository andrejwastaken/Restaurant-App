from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import User
from .models import OwnerProfile

@receiver(post_save, sender=User)
def create_owner_profile(sender, instance, created, **kwargs):
    if created and instance.role in ['OWNER', 'ADMIN']:
        OwnerProfile.objects.create(user=instance)
