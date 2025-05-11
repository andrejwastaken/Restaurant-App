from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.validators import UniqueValidator
from django.core.validators import RegexValidator
from users.models import User
from clients.models import ClientProfile
from restaurants.models import OwnerProfile

User = get_user_model()

phone_number_regex = RegexValidator(
    regex=r'^\+389\s\d{2}-\d{3}-\d{3}$',
    message = "Phone number must be in the format: '+389 XX-XXX-XXX"
)
class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required = True,
        validators = [UniqueValidator(queryset=User.objects.all(), message = "Email already exists")],
    )
    username = serializers.CharField(
        min_length = 4,
        validators= [UniqueValidator(queryset=User.objects.all(), message = "Username already exists")],
    )
    phone_number = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Phone number already exists"),
                    phone_number_regex],
    )
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'phone_number', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))

        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email = validated_data['email'],
            username = validated_data['username'],
            phone_number = validated_data.get('phone_number', ''),
            password = validated_data['password']
        )

        ClientProfile.objects.get_or_create(user = user)
        OwnerProfile.objects.get_or_create(user = user)

        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required = True)
    password = serializers.CharField(required = True, write_only = True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(username = email, password = password)

            if user is None:
                raise AuthenticationFailed(detail = 'Invalid email or password.')
            if not user.is_active:
                raise AuthenticationFailed(detail = 'User inactive or deleted.')

            data['user'] = user
            return data
        else:
            serializers.ValidationError(detail = 'Must include email and password.')

