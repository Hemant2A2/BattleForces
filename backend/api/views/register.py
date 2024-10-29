from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import make_password
from api.models import Users, UserProfile
from api.serializers import UsersSerializer
import requests


class SubmitHandleView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    def post(self, request):
        handle = request.data.get('handle')
        user, created = Users.objects.get_or_create(username=handle)
        if not created:
            user.username = handle
            user.save(update_fields=['username'])
        # else: 
        #     return Response({"message": "Handle already exists"}, status=status.HTTP_400_BAD_REQUEST)
        if user.is_verified:
            return Response({"error": "Handle is already verified."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"handle": handle}, status=status.HTTP_200_OK)

class GenerateVerificationProblemView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    def get(self, request):
        problem_id = "4/A"
        problem = {
            "id": problem_id,
            "problem_url": f"https://codeforces.com/problemset/problem/{problem_id}"
        }
        return Response(problem)

class VerifySolutionView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    def post(self, request):
        handle = request.data.get('handle')
        problem_id = request.data.get('problem_id')
        
        api_url = f"https://codeforces.com/api/user.status?handle={handle}&from=1&count=1"
        response = requests.get(api_url).json()

        if response['status'] == 'OK':
            latest_submission = response['result'][0]
            if latest_submission['verdict'] == "COMPILATION_ERROR":
                return Response({"message": "Handle verified! Proceed to create a password."}, status=status.HTTP_200_OK)
        
        user = Users.objects.get(username=handle)
        if user:
            user.delete()
        return Response({"error": "Verification failed!"}, status=status.HTTP_400_BAD_REQUEST)

class CreatePasswordView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    def post(self, request):
        cf_handle = request.data.get('handle')
        verified = request.data.get('verified')
        password = request.data.get('password')

        user = Users.objects.get(username=cf_handle)

        if not verified:
            user.delete()
            return Response({"error": "User is not verified yet."}, status=status.HTTP_400_BAD_REQUEST)

        # if len(password) < 8:
        #     return Response({"error": "Password must be at least 8 characters long."}, status=status.HTTP_400_BAD_REQUEST)
        
        # set the password
        user.codeforces_handle = cf_handle
        user.is_verified = True
        user.password = make_password(password)  # Hash the password before saving
        user.save(update_fields=['password', 'is_verified', 'codeforces_handle'])

        UserProfile.objects.create(user = user)

        # Use serializer to return the user's data
        serialized_user = UsersSerializer(user)

        return Response({
            "message": "Password created successfully! You can now log in.",
            "user": serialized_user.data  
        })