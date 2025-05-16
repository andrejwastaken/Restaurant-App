from .models import User
from rest_framework import serializers

class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, allow_blank = True, required=False, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'password']

    def update(self, instance, validated_data):
        username = validated_data.get('username', instance.username)
        password = validated_data.get('password')

        if 'username' in validated_data:
            instance.username = username
        if password and password != "":
            instance.set_password(password)

        instance.save()
        return instance