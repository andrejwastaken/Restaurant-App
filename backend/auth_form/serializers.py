from rest_framework import serializers
from django.contrib.auth import get_user_model
from users.models import User
from clients.models import ClientProfile
from restaurants.models import OwnerProfile

User = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True)

    class Meta:
        model = User
        fields = ['email', 'username', 'phone_number', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        # Create user
        user = User.objects.create_user(
            email = validated_data['email'],
            username = validated_data['username'],
            phone_number = validated_data.get('phone_number', ''),
            password = validated_data['password']
        )

        # Create Client/Owner
        ClientProfile.objects.create(user = user)
        OwnerProfile.objects.create(user = user)

        return user

