from django.core.management.base import BaseCommand
from restaurants.models import Restaurant
from users.models import User

class Command(BaseCommand):
    help = 'Populate the database with sample restaurant data'

    def handle(self, *args, **kwargs):
        try:
            # This should be done automatically when a new owner is created
            owner_user = User.objects.get(username='aristikj')

            restaurant_data = [
                {'name': 'Restaurant A', 'description': 'A nice place to eat. Good for families.'},
                {'name': 'Restaurant B', 'description': 'A quick place to grab lunch.'},
                {'name': 'Restaurant C', 'description': 'Fine dining with a variety of options.'},
            ]

            for data in restaurant_data:
                restaurant = Restaurant.objects.create(
                    owner=owner_user,
                    name=data['name'],
                    description=data['description']
                )
                self.stdout.write(self.style.SUCCESS(f"Restaurant created: {restaurant.name}"))
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR("Owner user does not extst."))
