from rest_framework import serializers
from reservations.models import Reservation
from restaurants.serializers import TableSerializer
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
    table = TableSerializer(
        read_only=True, 
        help_text="Details of the table being reserved."
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
        ]
