from django.db import models
from django.db.models import F
from django.db.models.fields import DateTimeField
from users.models import User
from restaurants.models import Table
from clients.models import ClientProfile
from django.core.exceptions import ValidationError
from django.db.models import ExpressionWrapper


class Reservation(models.Model):
    STATUS_CHOICES = (
        ('CONFIRMED', 'confirmed'),
        ('CANCELLED', 'cancelled'),
    )

    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, related_name='reservations')
    table = models.ForeignKey(
        Table,
        on_delete=models.CASCADE,
        related_name='reservations',
        help_text="The table being reserved"
    )

    start_time = models.DateTimeField(
        help_text="The date and time the reservation starts."
    )
    duration = models.DurationField(
        help_text="The duration of the reservation (e.g., 2 hours)."
    )

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='CONFIRMED')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def end_time(self):
        """Calculates the reservation end time. This is a property, not a database field."""
        if self.start_time and self.duration:
            return self.start_time + self.duration
        return None

    def clean(self):
        # The logic for an overlapping reservation is:
        # (New Start < Existing End) AND (New End > Existing Start)

        if self.start_time and self.duration:
            new_reservation_end_time = self.start_time + self.duration

            existing_end_time_expression = ExpressionWrapper(
                F('start_time') + F('duration'),
                output_field=DateTimeField()
            )

            conflicting_reservations = Reservation.objects.filter(
                table=self.table,
                status='CONFIRMED'
            ).exclude(pk=self.pk).annotate(
                end_time=existing_end_time_expression
            ).filter(
                start_time__lt=new_reservation_end_time,  # Existing start < New end
                end_time__gt=self.start_time  # Existing end > New start
            )

            if conflicting_reservations.exists():
                raise ValidationError(
                    "This table is already booked for the selected time slot."
                )

    def __str__(self):
        return (f"Reservation for {self.client.user.username} at table '{self.table.name}' "
                f"in {self.table.setup.restaurant.name} on {self.start_time.strftime('%Y-%m-%d %H:%M')}")

    class Meta:
        ordering = ['start_time']
        verbose_name = "Reservation"
        verbose_name_plural = "Reservations"
