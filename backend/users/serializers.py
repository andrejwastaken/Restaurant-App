from .models import User
from rest_framework import serializers

class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, allow_blank = True, required=False, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'phone_number', 'password']

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)

        password = validated_data.get('password')

        if password:
            instance.set_password(password)

        instance.save()
        return instance