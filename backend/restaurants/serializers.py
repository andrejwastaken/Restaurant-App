from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import Restaurant, RestaurantSetup


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'

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
        fields = ['name', 'description', 'restaurant_setup']

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


