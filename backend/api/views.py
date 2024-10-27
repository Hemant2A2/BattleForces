from rest_framework.response import Response
from rest_framework import status, generics
import requests
import random
import string
from .models import *
from .serializers import *
from datetime import datetime, timedelta
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .helper import getRandomProblemsByRating, getprob, check_solved
from django.utils import timezone
import pytz



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer




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
        #request.session['problem_id'] = problem_id
        #request.session['start_time'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return Response(problem)

class VerifySolutionView(generics.CreateAPIView):
    permission_classes = [AllowAny]
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


        # Use serializer to return the user's data
        serialized_user = UsersSerializer(user)

        return Response({
            "message": "Password created successfully! You can now log in.",
            "user": serialized_user.data  
        })

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, username=None):
        if username:
            # Look for the user profile by username provided in the URL parameter
            try:
                user = Users.objects.get(username=username)
            except:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Default to the current authenticated user if no username is provided
            user = request.user

        try:
            profile = UserProfile.objects.get(user=user)
        except:
            profile = UserProfile.objects.create(user=user)

        
        api_url = f"https://codeforces.com/api/user.rating?handle={user.username}"
        response = requests.get(api_url).json()

        if response['status'] == 'OK':
            try :
                profile.rating = response['result'][-1]['newRating']
            except:
                profile.rating = 0
            profile.save(update_fields=['rating'])

        return Response({
            "image": profile.image.url,
            "rating": profile.rating,
            "wins": profile.wins,
            "joined": profile.joined,
            "in_contest": profile.in_contest
        }, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user
        profile = UserProfile.objects.get(user=user)
        # Ensure that only the owner of the profile can update it
        if profile.user != user:
            return Response({"error": "You can only update your own profile."}, status=status.HTTP_403_FORBIDDEN)
        image = request.FILES.get('image')
        if image:
            profile.image = image
            profile.save(update_fields=['image'])
            return Response({"message": "Profile pic updated successfully."}, status=status.HTTP_200_OK)
        



class CreateContestView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        profile = UserProfile.objects.get(user=user)

        # if profile.in_contest:
        #     return Response({"error": "You are already in a contest dumbass."}, status=status.HTTP_400_BAD_REQUEST)
        
        number_of_problems = request.data.get('numberOfProblems')
        duration = request.data.get('duration')
        contest_name = request.data.get('contestName')
        is_public = request.data.get('publicContest')
        min_rating = request.data.get('minRating')
        max_rating = request.data.get('maxRating')
        team_name = request.data.get('teamName')

        characters = string.ascii_letters + string.digits + string.punctuation
        room_id = ''.join(random.choice(characters) for _ in range(10))

        try:
            contest = Contests.objects.create(
                contest_name=contest_name,
                duration=duration,
                number_of_problems=number_of_problems,
                creator=user,
                is_public=is_public,
                is_active=True,
                min_rating=min_rating,
                max_rating=max_rating,
                room_id=room_id
            )

            Participants.objects.create(
                team_name=team_name,
                contest=contest,
                user1=profile
            )
        except:
            return Response({"error": "Error in creating the contest."}, status=status.HTTP_400_BAD_REQUEST)

        # profile.in_contest = True
        # profile.save(update_fields=['in_contest'])
        contest_id = contest.contest_id
        return Response({"contest_id": {contest_id}}, status=status.HTTP_200_OK)
    
class JoinContestView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
       user = request.user
       team_name = request.data.get('teamName')
       received_room_id = request.data.get('roomId')
       # check if the room_id exists in the contests table and that the contest is active
       contest = Contests.objects.get(room_id=received_room_id)
       if not contest:
            return Response({"error": "Contest does not exist."}, status=status.HTTP_400_BAD_REQUEST)
       if not contest.is_active:
            return Response({"error": "Contest is not active."}, status=status.HTTP_400_BAD_REQUEST)
       # if it does add the user to the participants table
       profile = UserProfile.objects.get(user=user)
       Participants.objects.create(
            team_name=team_name,
            contest=contest,
            user1=profile
       )
       return Response({"contest_id": contest.contest_id}, status=status.HTTP_200_OK)
    
class JoinContestAsTeamMateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        pass
    
class GenerateContestProblemsView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, contest_id):
        user = request.user
        profile = UserProfile.objects.get(user=user)

        # if not profile.in_contest:
        #     return Response({"error": "You need to join the contest first bitch"}, status=status.HTTP_400_BAD_REQUEST)

        # extract username of all participants
        participants = Participants.objects.all()
        participant_usernames = []
        for participant in participants:
            if participant.user1:
                profile = participant.user1
                username = profile.user.username
                participant_usernames.append(username)
            if participant.user2:
                profile = participant.user2
                username = profile.user.username
                participant_usernames.append(username)
            if participant.user3:
                profile = participant.user3
                username = profile.user.username
                participant_usernames.append(username)

        contest = Contests.objects.get(contest_id=contest_id)
        timezone = pytz.timezone("UTC")
        current_time = datetime.now(timezone)
        contest.start_time = current_time
        contest.save(update_fields=['start_time'])
        min_rating = contest.min_rating
        max_rating = contest.max_rating
        n = contest.number_of_problems
        
        links = getRandomProblemsByRating(n, min_rating, max_rating, participant_usernames)
        if links['status'] == 'Error':
            return Response({"error": links['message']}, status=status.HTTP_400_BAD_REQUEST)
        
        problems = []
        for i in range(len(links['url'])):
            problems.append({
                "problem_name": string.ascii_uppercase[i],
                "problem_url": links['url'][i]
            })

        if len(problems) < n:
            return Response({"error": "Not enough problems found. Please try again."}, status=status.HTTP_400_BAD_REQUEST)
        
        team = Participants.objects.get(contest=contest, user1=profile)
        Scoreboard.objects.create(
            contest=contest,
            team=team
        )

        for p in problems:
            Problems.objects.create(
                contest=contest,
                problem_name=p['problem_name'],
                problem_link=p['problem_url']
            )
            Standings.objects.create(
                contest=contest,
                team=team,
                problem_attempted=p['problem_name']
            )

        return Response({"message": "Problems generated successfully"}, status=status.HTTP_200_OK)
    
    def get(self, request, contest_id):
        user = request.user
        profile = UserProfile.objects.get(user=user)
        contest = Contests.objects.get(contest_id=contest_id)

        # if the requested user is in the participants table with the given contest_id 
        # return the problems otherwise throw error
        
        # Can this be done in a single query?
        user_contests = Participants.objects.filter(user1=profile)
        is_participant = [True for c in user_contests if c.contest == contest]

        if not is_participant:
            return Response({"error": "You are not a participant in this contest."}, status=status.HTTP_400_BAD_REQUEST)

        p = Problems.objects.filter(contest=contest)
        problems = []

        for problem in p:
            problems.append({
                "problem_name": problem.problem_name,
                "problem_link": problem.problem_link
            })

        return Response(problems)
    


# class ParticipantsView(generics.RetrieveUpdateDestroyAPIView):
#     permission_classes = [IsAuthenticated]
#     def get(self, request, contest_id):
#         pass

#     def put(self, request, contest_id):
#         pass

#     def delete(self, request, contest_id):
#         pass


class StandingsView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, contest_id):
        user = request.user
        profile = UserProfile.objects.get(user=user)
        contest = Contests.objects.get(contest_id=contest_id)
        time_of_start = contest.start_time
        url_list = (Problems.objects.filter(contest = contest))
        ud = []
        for i in url_list:
            ud.append(i.problem_link)
        url_list = ud
        problem_data = getprob(url_list)
        teams = Participants.objects.filter(contest = contest)
        # add start_time as variable 
        ret_obj = []
        for i in teams:

            users = [ i.user1.user.username ]
            if(i.user2):
                users.append(i.user2.user.username)
            
            if(i.user3):
                users.append(i.user3.user.username) 
            
            penalty = 0
            scored = 0
            teamid = i.id 
            sbd_obj = (Scoreboard.objects.filter(contest = contest , team = teamid))[0]
            record = []
            record.append(i.team_name)
            for j in range(len(problem_data)):
                ws , fact , tim = check_solved(users,problem_data[j])
                print(ws,fact,tim)
                c = string.ascii_uppercase[j]
                stand_obj = (Standings.objects.filter(contest = contest, team = teamid, problem_attempted = c))[0]
                if(fact):
                    record.append(1)
                    scored+=1


                    tim_delta = tim - time_of_start

                    minutes = (tim_delta.total_seconds())/60
                    penalty+= (10*ws + minutes)
                    stand_obj.is_it_solved = True
                    stand_obj.time_of_solve = tim
                    stand_obj.attempts = ws
                else :
                    record.append(0)
                    stand_obj.attempts = ws
                    stand_obj.is_it_solved = False
                stand_obj.save()
            record.append(scored)
            record.append(penalty)
            ret_obj.append(record)
            sbd_obj.penalty = penalty
            sbd_obj.solve_count = scored
            sbd_obj.save()
        xo = len(problem_data) + 1
        ret_obj.sort(key=lambda y:(y[xo],y[xo+1]))
        robj = []
        print(ret_obj)
        for value in ret_obj:
            team_name = value[0]
            itm = {}
            itm['team_name']= team_name
            solutions =[]
            for i in range(len(problem_data)):
                solutions.append(value[i+1])
            itm['solve_count'] = value[xo]
            itm['penalty'] = value[xo+1]
            itm['solutions'] = solutions
            robj.append(itm)
        print(robj)
        return Response(robj)