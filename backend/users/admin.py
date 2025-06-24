from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
class CustomUserAdmin(BaseUserAdmin):
    model = User
    list_display = (
        'email',
        'username',
        'phone_number',
        'is_staff',
        'is_active',
    )
    search_fields = (
        'email',
        'username',
        'phone_number',
    )
    ordering = ('email',)
admin.site.register(User, CustomUserAdmin)