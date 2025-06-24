from rest_framework import serializers
from reservations.models import Reservation
from users.serializers import NestedUserSerializer

class ReservationListSerializer(serializers.ModelSerializer):
    """
    Serializes a Reservation object for list views.
    Includes nested details for the client (user) and the table.
    """
    client_user = NestedUserSerializer(
        source='client.user', 
        read_only=True, 
        help_text="Details of the user who made the reservation."
    )

    table = serializers.SerializerMethodField()

    restaurant_id = serializers.IntegerField(
        source='table.setup.restaurant.id',
        read_only=True,
        help_text="ID of the restaurant where the table is located."
    )
    restaurant_name = serializers.CharField(
        source='table.setup.restaurant.name',
        read_only=True,
        help_text="Name of the restaurant where the table is located."
    )
    # For both views, we want to know which table was booked.
    
    class Meta:
        model = Reservation
        fields = [
            'id',
            'status',
            'start_time',
            'duration',
            'client_user',
            'table',
            'restaurant_id',
            'restaurant_name',
        ]

    def get_table(self, obj):
        """
        Retrieves and serializes the related Table object.
        Performs a local import of TableSerializer to break circular dependencies.
        """
        # LOCAL IMPORT OF TABLESERIALIZER TO BREAK CIRCULAR DEPENDENCY
        # This import only happens when get_table is called,
        # ensuring restaurants.serializers is fully loaded.
        from restaurants.serializers import TableSerializer

        # obj.table is the actual Table model instance
        return TableSerializer(obj.table, context=self.context).data
