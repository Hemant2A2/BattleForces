from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from datetime import datetime
import pytz
import string
from api.models import Contests, Participants, Problems, Scoreboard, Standings, UserProfile
from api.helper import getRandomProblemsByRating


class GenerateContestProblemsView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, contest_id):
        user = request.user
        profile = UserProfile.objects.get(user=user)

        # if not profile.in_contest:
        #     return Response({"error": "You need to join the contest first bitch"}, status=status.HTTP_400_BAD_REQUEST)

        # Extract usernames of all participants
        participants = Participants.objects.all()
        participant_usernames = [
            user_profile.user.username
            for participant in participants
            for user_profile in [participant.user1, participant.user2, participant.user3]
            if user_profile
        ]

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
        
        for p in participants:
            profile = p.user1
            if profile:
                team = Participants.objects.get(contest=contest, user1=profile)
                Scoreboard.objects.create(
                    contest=contest,
                    team=team
                )
                for p in problems:
                    Standings.objects.create(
                        contest=contest,
                        team=team,
                        problem_attempted=p['problem_name']
                    )
       
        for p in problems:
            Problems.objects.create(
                contest=contest,
                problem_name=p['problem_name'],
                problem_link=p['problem_url']
            )
            
        return Response({"message": "Problems generated successfully"}, status=status.HTTP_200_OK)
    
    def get(self, request, contest_id):
        user = request.user
        profile = UserProfile.objects.get(user=user)
        contest = Contests.objects.get(contest_id=contest_id)

        # if the requested user is in the participants table with the given contest_id 
        # return the problems otherwise throw error
        
        is_participant = Participants.objects.filter(
            Q(contest=contest) & (Q(user1=profile) | Q(user2=profile) | Q(user3=profile))
        ).exists()

        if not is_participant:
            return Response({"error": "You are not a participant in this contest."}, status=status.HTTP_400_BAD_REQUEST)

        p = Problems.objects.filter(contest=contest)
        problems = []

        for problem in p:
            problems.append({
                "problem_name": problem.problem_name,
                "problem_link": problem.problem_link
            })

        return Response({
            "problems": problems,
            "start_time": contest.start_time,
            "duration": contest.duration
        }, status=status.HTTP_200_OK)
    