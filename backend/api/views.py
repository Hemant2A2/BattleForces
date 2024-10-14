from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from .models import Users
from .serializers import UsersSerializer
from datetime import datetime, timedelta
from django.contrib.auth.hashers import make_password

class SubmitHandleView(APIView):
    def post(self, request):
        handle = request.data.get('handle')
        user, created = Users.objects.get_or_create(codeforces_handle=handle)
        user.codeforces_handle = handle
        user.save(update_fields=['codeforces_handle'])
        if not created and user.is_verified:
            return Response({"error": "Handle is already verified."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"handle": handle}, status=status.HTTP_200_OK)

class GenerateProblemView(APIView):
    def get(self, request):
        problem_id = "4/A"
        problem = {
            "id": problem_id,
            "problem_url": f"https://codeforces.com/problemset/problem/{problem_id}"
        }
        request.session['problem_id'] = problem_id
        #request.session['start_time'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return Response(problem)

class VerifySolutionView(APIView):
    def post(self, request):
        handle = request.data.get('handle')
        problem_id = request.session.get('problem_id')
        #start_time = request.session.get('start_time')
        
        # # Check if time exceeds 5 minutes
        # if datetime.now() > datetime.strptime(start_time, "%Y-%m-%d %H:%M:%S") + timedelta(minutes=5):
        #     return Response({"error": "Time limit exceeded."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Call Codeforces API to check recent submissions by handle
        api_url = f"https://codeforces.com/api/user.status?handle={handle}&from=1&count=1"
        response = requests.get(api_url).json()

       
        if response['status'] == 'OK':
            latest_submission = response['result'][0]
            # contest_id = latest_submission['problem'].get('contestId')
            # index = latest_submission['problem'].get('index')
            # latest_problem_id = f"{contest_id}/{index}" if contest_id and index else None
            if latest_submission['verdict']:
                # Update the user verification status but DO NOT save the password yet
                user = get_object_or_404(Users, codeforces_handle=handle)
                user.is_verified = True
                user.save(update_fields=['is_verified'])  # Only save the verification status
                request.session['verified_user'] = user.id  # Store user ID in session for password creation step
                return Response({"message": "Handle verified! Proceed to create a password."}, status=status.HTTP_200_OK)
        
        return Response({"error": "Verification failed!"}, status=status.HTTP_400_BAD_REQUEST)


class CreatePasswordView(APIView):
    def post(self, request):
        user_id = request.session.get('verified_user')
        password = request.data.get('password')

        if not user_id:
            return Response({"error": "User is not verified yet."}, status=status.HTTP_400_BAD_REQUEST)

        if len(password) < 8:
            return Response({"error": "Password must be at least 8 characters long."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Fetch the user and set the password
        user = get_object_or_404(Users, id=user_id)
        user.password = make_password(password)  # Hash the password before saving
        user.save(update_fields=['password'])

        # Clear the session data related to verification
        del request.session['verified_user']

        # Use serializer to return the user's data
        serialized_user = UsersSerializer(user)

        return Response({
            "message": "Password created successfully! You can now log in.",
            "user": serialized_user.data  # Return the serialized user data
        })
