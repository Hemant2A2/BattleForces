from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from api.models import Contests, Participants, UserProfile


class ParticipantsView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, contest_id):
        user = request.user
        profile = UserProfile.objects.get(user=user)
        contest = Contests.objects.get(contest_id=contest_id)

        team = Participants.objects.filter(
            Q(contest=contest) & 
            (Q(user1=profile) | Q(user2=profile) | Q(user3=profile))
        )

        if not team:
            return Response({"error": "You are not a participant in this contest."}, status=status.HTTP_400_BAD_REQUEST)
                
        teamData = []
        teamImageData = []
        team_name = team[0].team_name
        for t in team:
            teamData.append(t.user1.user.username)
            teamImageData.append(t.user1.image.url)
            if t.user2:
                teamData.append(t.user2.user.username)
                teamImageData.append(t.user2.image.url)
            if t.user3:
                teamData.append(t.user3.user.username)
                teamImageData.append(t.user3.image.url)
        
        # fetch team details of all other paricipants in the contest
        participants = Participants.objects.filter(contest=contest)
        otherParticipantsData = []
        for p in participants:
            if p.team_name != team_name:
                otherParticipantsData.append({
                    "team_name": p.team_name,
                    "user1": p.user1.user.username,
                    "user2": p.user2.user.username if p.user2 else None,
                    "user3": p.user3.user.username if p.user3 else None
                })

        creator = contest.creator.username
        has_started = contest.start_time is not None

        return Response({
            "team_name": team_name,
            "creator": creator,
            "team": teamData,
            "other_participants": otherParticipantsData,
            "has_started": has_started,
            "team_image": teamImageData
        }, status=status.HTTP_200_OK)

    # def put(self, request, contest_id):
    #     pass

    # def delete(self, request, contest_id):
    #     pass