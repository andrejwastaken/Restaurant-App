from django.contrib import admin
from .models import Reservation

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('id', '__str__', 'status', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at') 
