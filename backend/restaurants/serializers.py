from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.db import transaction
from .models import Restaurant, RestaurantSetup, TableType, TimeSlot


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'description', 'is_validated', 'address', 'phone_number']

class TableTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableType
        fields = ['id', 'name' ,'capacity', 'is_smoking', 'total_quantity']

class TimeSlotSerializer(serializers.ModelSerializer):
    table_type = TableTypeSerializer(read_only=True)

    class Meta:
        model = TimeSlot
        fields = ['id', 'time', 'quantity_available', 'table_type']

class TableTypeNestedCreateSerializer(serializers.ModelSerializer):
    """A simple serializer for the nested list of table types."""
    class Meta:
        model = TableType
        # These are the fields the owner will provide for each type of table they add.
        fields = ['name', 'capacity', 'is_smoking', 'total_quantity']

class RestaurantCreateWithSetupSerializer(serializers.ModelSerializer):
    """
    This serializer accepts all data needed to create a restaurant and its
    initial table setup in a single API call.
    """
    # This field accepts a LIST of table type objects.
    # `write_only=True` means it's used for input, but not shown in the output response.
    table_types = TableTypeNestedCreateSerializer(many=True, write_only=True)

    class Meta:
        model = Restaurant
        fields = [
            'name', 'description', 'address', 'phone_number',
            'table_types' # The nested list of tables
        ]

    @transaction.atomic # Ensure all database operations succeed or none do.
    def create(self, validated_data):
        # 1. Separate the nested table type data from the main restaurant data.
        table_types_data = validated_data.pop('table_types')
        owner_user = self.context['request'].user

        # 2. Create the main Restaurant object with its base rules.
        restaurant = Restaurant.objects.create(owner=owner_user, **validated_data)

        # 3. Create the linked RestaurantSetup object.
        setup = RestaurantSetup.objects.create(restaurant=restaurant)

        # 4. Loop through the list of table type data and create each one.
        for table_type_data in table_types_data:
            TableType.objects.create(setup=setup, **table_type_data)
        

        return restaurant

class TimeSlotCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        # 'setup' and 'table_type' will be determined by the URL endpoint,
        # e.g., /api/setup/1/table-types/2/timeslots/
        fields = ['date', 'time', 'quantity_available']
