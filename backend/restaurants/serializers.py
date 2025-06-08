from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import Restaurant, RestaurantSetup

class RestaurantSetupSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantSetup
        fields = ['num_tables', 'timeslots_by_day', 'tables_by_size']
        
class RestaurantSerializer(serializers.ModelSerializer):
    restaurant_setup = RestaurantSetupSerializer(read_only = True)
    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'description', 'is_validated', 'address', 'phone_number', 'restaurant_setup']

class CreateRestaurantSetupSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantSetup
        exclude = ['restaurant']

class CreateRestaurantSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        required=True,
        validators = [UniqueValidator(queryset=Restaurant.objects.all(), message="Restaurant name already exists")]
    )
    restaurant_setup = CreateRestaurantSetupSerializer()

    class Meta:
        model = Restaurant
        fields = ['name', 'description', 'address', 'phone_number', 'restaurant_setup']

    def create(self, validated_data):
        setup_data = validated_data.pop('restaurant_setup')

        owner = self.context['request'].user.ownerprofile

        restaurant = Restaurant.objects.create(
            owner=owner,
            is_validated=False,
            **validated_data
        )

        RestaurantSetup.objects.create(
            restaurant=restaurant,
            **setup_data
        )

        return restaurant


