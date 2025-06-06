from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate 
from .serializers import UserUpdateSerializer

# Create your views here.
class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserUpdateSerializer(instance=request.user)
        return Response(serializer.data)
    
    def put(self, request):
        serializer = UserUpdateSerializer(instance=request.user, data=request.data, partial=True)

        if serializer.is_valid():
            # go zacuvuvam prvo, deka mozebi nema da se promeni passwordot
            user = serializer.save()

            if 'password' in request.data and request.data['password']:
                user = request.user
                user.set_password(request.data['password'])
                user.save()

                if user is None:
                    return Response({"message": "Password update failed!"})
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)

                return Response({
                    "message": "User updated successfully!",
                    "access_token": access_token
                })

            return Response({"message": "User updated successfully!"})

        return Response(serializer.errors, status=400)