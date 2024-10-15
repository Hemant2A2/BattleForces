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
        user, created = Users.objects.get_or_create(username=handle)
        if not created:
            user.username = handle
            user.save(update_fields=['username'])
        # else: 
        #     return Response({"message": "Handle already exists"}, status=status.HTTP_400_BAD_REQUEST)
        if user.is_verified:
            return Response({"error": "Handle is already verified."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"handle": handle}, status=status.HTTP_200_OK)

class GenerateVerificationProblemView(APIView):
    def get(self, request):
        problem_id = "4/A"
        problem = {
            "id": problem_id,
            "problem_url": f"https://codeforces.com/problemset/problem/{problem_id}"
        }
        #request.session['problem_id'] = problem_id
        #request.session['start_time'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return Response(problem)

class VerifySolutionView(APIView):
    def post(self, request):
        handle = request.data.get('handle')
        problem_id = request.data.get('problem_id')
        #start_time = request.session.get('start_time')
        
        # # Check if time exceeds 5 minutes
        # if datetime.now() > datetime.strptime(start_time, "%Y-%m-%d %H:%M:%S") + timedelta(minutes=5):
        #     return Response({"error": "Time limit exceeded."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Call Codeforces API to check recent submissions by handle
        api_url = f"https://codeforces.com/api/user.status?handle={handle}&from=1&count=1"
        response = requests.get(api_url).json()

        # latest_submission['verdict'] == "COMPILATION_ERROR"
       
        if response['status'] == 'OK':
            latest_submission = response['result'][0]
            # contest_id = latest_submission['problem']['contestId']
            # index = latest_submission['problem']['index']
            # latest_problem_id = f"{contest_id}/{index}" if contest_id and index else None
            if latest_submission['verdict'] == "COMPILATION_ERROR":
                # user = get_object_or_404(Users, codeforces_handle=handle)
                # user.is_verified = True
                # user.save(update_fields=['is_verified']) 
                return Response({"message": "Handle verified! Proceed to create a password."}, status=status.HTTP_200_OK)
        
        user = Users.objects.get(username=handle)
        if user:
            user.delete()
        # if(request.session['verified_user']):
        #     del request.session['verified_user']
        return Response({"error": "Verification failed!"}, status=status.HTTP_400_BAD_REQUEST)


class CreatePasswordView(APIView):
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


        # Use serializer to return the user's data
        serialized_user = UsersSerializer(user)

        return Response({
            "message": "Password created successfully! You can now log in.",
            "user": serialized_user.data  
        })
