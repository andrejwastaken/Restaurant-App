from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.db import transaction
from .models import Restaurant, RestaurantSetup, TableType, Table, OperationHours


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'description', 'is_validated', 'address', 'phone_number']

class RestaurantSetupNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantSetup
        fields = ['default_slot_duration']

class TableTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableType
        fields = ['id', 'name' ,'capacity']

class TableTypeNestedCreateSerializer(serializers.ModelSerializer):
    """A simple serializer for the nested list of table types."""
    class Meta:
        model = TableType
        # These are the fields the owner will provide for each type of table they add.
        fields = ['name', 'capacity']

class TableSerializer(serializers.ModelSerializer):
    table_type = serializers.PrimaryKeyRelatedField(
        queryset=TableType.objects.all(),
        write_only=True,
    )

    class Meta:
        model = Table
        fields = [
            'id',
            'name',
            'table_type',
            'is_smoking',
            'x_position',
            'y_position',
            'width',
            'height',
            'shape'
        ]
        read_only_fields = ['id']

    def validate(self, data):
        """
        Custom validation to ensure the provided TableType belongs to the
        correct RestaurantSetup.
        """
        # The view will pass the 'setup' object into the serializer's context.
        setup = self.context.get('setup')
        table_type = data.get('table_type')

        if table_type.setup != setup:
            raise serializers.ValidationError(
                "The selected Table Type does not belong to this restaurant's setup."
            )

        return data

class OperatingHoursNestedSerializer(serializers.ModelSerializer):
    def validate(self, data):
        """Check if opening time is before closing"""
        if data['open_time'] >= data['close_time']:
            raise serializers.ValidationError("Closing time must be after opening time")
        return data

    class Meta:
        model = OperationHours
        fields = ['day_of_week', 'open_time', 'close_time']

class RestaurantCreateWithSetupSerializer(serializers.ModelSerializer):
    """
    This serializer accepts all data needed to create a restaurant and its
    initial table setup in a single API call.
    """
    setup = RestaurantSetupNestedSerializer(write_only=True)
    # This field accepts a LIST of table type objects.
    # `write_only=True` means it's used for input, but not shown in the output response.
    table_types = TableTypeNestedCreateSerializer(many=True, write_only=True)

    operating_hours = OperatingHoursNestedSerializer(many=True, write_only=True)

    class Meta:
        model = Restaurant
        fields = [
            'name', 'description', 'address', 'phone_number',
            'setup',
            'table_types', # The nested list of tables
            'operating_hours'
        ]

    def validate_operating_hours(self, data):
        days_seen = set()
        for day in data:
            current_day = data.get('day_of_week')
            if current_day in days_seen:
                raise serializers.ValidationError("Please make sure you add each day only once")
            days_seen.add(current_day)
        return data

    @transaction.atomic # Ensure all database operations succeed or none do.
    def create(self, validated_data):
        # 1. Separate the nested table type data from the main restaurant data.
        setup_data = validated_data.pop('setup')
        table_types_data = validated_data.pop('table_types')
        operating_hours_data = validated_data.pop('operating_hours')
        owner_user = self.context['request'].user

        # 2. Create the main Restaurant object with its base rules.
        restaurant = Restaurant.objects.create(owner=owner_user, **validated_data)

        # 3. Create the linked RestaurantSetup object.
        setup = RestaurantSetup.objects.create(restaurant=restaurant, **setup_data)

        # 4. Loop through the list of table type data and create each one.
        for table_type_data in table_types_data:
            TableType.objects.create(setup=setup, **table_type_data)

        for operating_hour_data in operating_hours_data:
            OperationHours.objects.create(setup=setup, **operating_hour_data)

        return restaurant

