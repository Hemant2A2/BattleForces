from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from api.models import Contests, Participants, UserProfile
import string
import random



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
       user = request.user
       profile = UserProfile.objects.get(user=user)
       team_name = request.data.get('team_name')
       room_id = request.data.get('room_id')
       contest = Contests.objects.filter(room_id=room_id)[0]
       team = Participants.objects.filter(team_name=team_name, contest=contest)[0]
       if team.user2:
           team.user3 = profile
       else:
            team.user2 = profile

       team.save()
       return Response({"contest_id": contest.contest_id}, status=status.HTTP_200_OK)
    