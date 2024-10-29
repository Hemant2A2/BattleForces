from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from api.models import Invites, Contests, Participants, UserProfile


class SendInviteToTeamMateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        contest_id = request.data.get('contest_id')
        sender_profile = UserProfile.objects.get(user=user)
        receiver_username = request.data.get('teamMate')
        receiver_profile = UserProfile.objects.get(user__username=receiver_username)
        contest = Contests.objects.get(contest_id=contest_id)

        try:
            Invites.objects.create(
                contest=contest,
                from_user=sender_profile,
                to_user=receiver_profile,
                for_team=True
            )
        except:
            return Response({"error": "Error in sending invite."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"message": "Invite sent successfully."}, status=status.HTTP_200_OK)

    
    def get(self, request):
        user = request.user
        profile = UserProfile.objects.get(user=user)
        invites = Invites.objects.filter(to_user=profile, for_team=True)

        messages = []
        room_id = []
        team_name = []
        for i in invites:
            room_id.append(Contests.objects.get(contest_id=i.contest_id).room_id)
            messages.append({
                "message": f"You have been invited to contest {i.contest_id} by {i.from_user.user.username}: "
            })
            teams = Participants.objects.filter(
                Q(user1=i.from_user) | Q(user2=i.from_user) | Q(user3=i.from_user)
            )
            for team in teams:
                team_name.append(team.team_name)
        
        return Response({
            "messages": messages,
            "team_name": team_name,
            "room_id"  : room_id
        }, status=status.HTTP_200_OK)

class SendInviteToParticipant(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        contest_id = request.data.get('contest_id')
        sender_profile = UserProfile.objects.get(user=user)
        receiver_username = request.data.get('toUser')
        receiver_profile = UserProfile.objects.get(user__username=receiver_username)
        contest = Contests.objects.get(contest_id=contest_id)

        try:
            Invites.objects.create(
                contest=contest,
                from_user=sender_profile,
                to_user=receiver_profile
            )
        except:
            return Response({"error": "Error in sending invite."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"message": "Invite sent successfully."}, status=status.HTTP_200_OK)

    def get(self, request):
        user = request.user
        profile = UserProfile.objects.get(user=user)
        invites = Invites.objects.filter(to_user=profile, for_team=False)
        room_id = []
        messages = []
        r_id = []
        for i in invites:
            room_id.append(Contests.objects.get(contest_id=i.contest_id).room_id)
            messages.append({
                "message": f"You have been invited to contest {i.contest_id} by {i.from_user.user.username} with room_id: "
            })
            r_id.append(room_id[-1])
        
        return Response({
            "messages": messages,
            "room_id": r_id
        }, status=status.HTTP_200_OK)