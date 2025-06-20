from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.db import transaction

from reservations.models import Reservation
from .models import Restaurant, RestaurantSetup, TableType, Table, OperationHours, SpecialDay

from reservations.serializers import ReservationListSerializer


class OperatingHoursNestedSerializer(serializers.ModelSerializer):
    def validate(self, data):
        """Check if opening time is before closing"""
        if data['open_time'] >= data['close_time']:
            raise serializers.ValidationError("Closing time must be after opening time")
        return data

    class Meta:
        model = OperationHours
        fields = ['day_of_week', 'open_time', 'close_time']

class RestaurantSerializer(serializers.ModelSerializer):
    default_slot_duration = serializers.IntegerField(source='setup.default_slot_duration', read_only=True)
    operating_hours = OperatingHoursNestedSerializer(many=True, source='setup.operating_hours', read_only=True)
    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'description', 'is_validated', 'address', 'phone_number',
            'latitude', 'longitude', 'default_slot_duration', 'operating_hours'
        ]

class RestaurantSetupNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantSetup
        fields = ['default_slot_duration']

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
            'radius',
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

class SpecialDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = SpecialDay
        fields = ['id', 'day', 'open_time', 'close_time', 'description']
        read_only_fields = ['id']

    def validate_day(self, value):
        setup = self.context['setup']

        if SpecialDay.objects.filter(setup=setup, day=value).exists():
            raise serializers.ValidationError("Special Day already exists")

        return value

    def create(self, validated_data):
        setup = self.context['setup']

        return SpecialDay.objects.create(setup=setup, **validated_data)

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
            'name', 'description', 'address', 'phone_number', 'latitude', 'longitude',
            'setup',
            'table_types', # The nested list of tables
            'operating_hours'
        ]

    def validate_name(self, value):
        if Restaurant.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("A restaurant with that name already exists!")
        return value

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


class TableBulkCreateSerializer(serializers.ModelSerializer):
    """
    Serializer to handle the bulk creation of tables from a list of data.
    """
    # We accept the name of the table type from the frontend.
    table_type_name = serializers.CharField(write_only=True, source='table_type')

    class Meta:
        model = Table
        fields = [
            'name',
            'table_type_name',  # Input field
            'table_type',  # Output/internal field
            'is_smoking',
            'x_position',
            'y_position',
            'width',
            'height',
            'radius',
            'shape'
        ]
        # table_type is now read_only because we handle it manually.
        read_only_fields = ['id', 'table_type']

    def validate_table_type_name(self, value):
        """
        Validate that the provided table_type_name exists for the current setup.
        """
        # The view will pass the 'setup' object into the serializer's context.
        setup = self.context.get('setup')

        try:
            # Check if a TableType with this name exists for this specific setup.
            table_type = TableType.objects.get(setup=setup, name=value)
        except TableType.DoesNotExist:
            raise serializers.ValidationError(
                f"A table type with the name '{value}' does not exist for this restaurant."
            )

        # Return the actual TableType object, not just its name.
        return table_type

# API CALLING SERIALIZERS
class TableTypeDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableType
        # These are the fields the owner will provide for each type of table they add.
        fields = ['id', 'name', 'capacity']

class TableDetailSerializer(serializers.ModelSerializer):
    """READ-ONLY serializer for displaying individual tables."""
    # Fetches the 'name' field from the related table_type object for display.
    table_type = serializers.CharField(source='table_type.name', read_only=True)

    class Meta:
        model = Table
        fields = [
            'id',
            'name',
            'table_type',
            'is_smoking',
            'shape',
            'x_position',
            'y_position',
            'width',
            'height',
            'radius'
        ]

class OperatingHoursDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationHours
        fields = ['day_of_week', 'open_time', 'close_time']

class RestaurantSetupDetailSerializer(serializers.ModelSerializer):
    """Nests all the setup-related details together for a comprehensive view."""
    operating_hours = OperatingHoursDetailSerializer(many=True, read_only=True)
    table_types = TableTypeDetailSerializer(many=True, read_only=True)
    tables = TableDetailSerializer(many=True, read_only=True)
    special_days = SpecialDaySerializer(many=True, read_only=True)

    reservations = serializers.SerializerMethodField()

    class Meta:
        model = RestaurantSetup
        fields = ['id', 'default_slot_duration', 'operating_hours', 'table_types', 'tables', 'special_days', 'reservations']

    def get_reservations(self, obj):
        """
        Retrieves all reservations for the restaurant associated with this setup.
        It uses the ReservationListSerializer to format the data.
        """
        # obj here is an instance of RestaurantSetup

        # The filter `table__setup=obj` means:
        # "Find all Reservation objects (starting from Reservation.objects)...
        # ...where the 'table' field on that Reservation...
        # ...has a 'setup' field (referring to the RestaurantSetup the table belongs to)...
        # ...and THAT 'setup' object is equal to the current 'obj' (the RestaurantSetup being serialized)."
        queryset = Reservation.objects.filter(
            table__setup=obj  # This correctly filters reservations whose table's setup is the current 'obj'
        ).select_related(
            'table', 'client__user'
        ).order_by('-start_time')

        return ReservationListSerializer(queryset, many=True, context=self.context).data

class OwnedRestaurantDetailSerializer(serializers.ModelSerializer):
    setup = RestaurantSetupDetailSerializer(read_only=True)

    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'description', 'address', 'phone_number', 'latitude', 'longitude', 'is_validated', 'setup']

# EDITING RESTAURANT SERIALIZERS
class RestaurantUpdateSerializer(serializers.ModelSerializer):
    operating_hours = OperatingHoursNestedSerializer(many=True)
    table_types = TableTypeNestedCreateSerializer(many=True)
    default_slot_duration = serializers.IntegerField()

    class Meta:
        model = Restaurant
        fields = [
            'name', 'description', 'address', 'phone_number',
            'is_validated', 'latitude', 'longitude', 'default_slot_duration',
            'operating_hours', 'table_types',
        ]
        read_only_fields = ['is_validated']
        extra_kwargs = {
            'name': {'validators': []},
        }

    @transaction.atomic
    def update(self, instance, validated_data):
        setup = instance.setup

        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.address = validated_data.get('address', instance.address)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.latitude = validated_data.get('latitude', instance.latitude)
        instance.longitude = validated_data.get('longitude', instance.longitude)
        instance.save()

        setup.default_slot_duration = validated_data.get('default_slot_duration', setup.default_slot_duration)
        setup.save()

        # Delete and rewrite Operating Hours
        if 'operating_hours' in validated_data:
            OperationHours.objects.filter(setup=setup).delete()
            hours_data = validated_data.get('operating_hours', [])
            hours_to_create = [OperationHours(setup=setup, **data) for data in hours_data]
            OperationHours.objects.bulk_create(hours_to_create)

        # Delete and rewrite Table Types
        if 'table_types' in validated_data:
            # Important: You must delete tables that depend on these types first!
            Table.objects.filter(setup=setup).delete()
            TableType.objects.filter(setup=setup).delete()  # Delete all old types
            types_data = validated_data.get('table_types', [])
            types_to_create = [TableType(setup=setup, **data) for data in types_data]
            TableType.objects.bulk_create(types_to_create)  # Create all new types

        return instance





