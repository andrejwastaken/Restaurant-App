from rest_framework import serializers
from reservations.models import Reservation
# from restaurants.serializers import TableSerializer
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
    # table = TableSerializer(
    #     read_only=True,
    #     help_text="Details of the table being reserved."
    # )
    table = serializers.SerializerMethodField()
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
        # Pass the current serializer's context to the nested serializer
        return TableSerializer(obj.table, context=self.context).data
