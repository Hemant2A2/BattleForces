import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.contrib.auth.models import AnonymousUser
from .models import Participants, Contests, Invites, UserProfile, Users
from django.db.models import F

class ParticipantsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope["user"] == AnonymousUser():
            await self.close()
            return
        # print(self.scope['user'])
        self.contest_id = self.scope['url_route']['kwargs']['contest_id']
        self.group_name = f"contest_{self.contest_id}"
        self.user_group_name = f"user_{self.scope['user'].username}"
        print(self.user_group_name)
        try:
            self.contest = await sync_to_async(Contests.objects.get)(contest_id=self.contest_id)
        except:
            self.contest = None

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )

        await self.accept()

        await self.channel_layer.group_send(
            self.group_name, { 'type': 'get_creator'}
        )
        await self.broadcast_participants_update()

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )
        if hasattr(self, 'user_group_name'):
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )

    async def get_creator(self, event):
        creator = await sync_to_async(lambda: self.contest.creator.username)()
        await self.send(text_data=json.dumps({
            'type': 'get_creator',
            'creator': creator
        }))

    async def broadcast_participants_update(self):
        # participants = await sync_to_async(list)(Participants.objects.filter)(contest_id=self.contest_id)
        print("broadcasting")
        participants = await sync_to_async(list)(
            Participants.objects.filter(contest_id=self.contest_id)
            .annotate(
                user1_username=F("user1__user__username"),
                user2_username=F("user2__user__username"),
                user3_username=F("user3__user__username"),
            )
            .values("team_name", "user1_username", "user2_username", "user3_username")
        )
        print("yaha nhi pahuncha")
        user = self.scope['user']
        profile = await sync_to_async(UserProfile.objects.get)(user=user)
        
        # team = await sync_to_async(Participants.objects.get)(contest_id=self.contest_id, user1=profile)
        team = await sync_to_async(
            lambda: Participants.objects.select_related(
                'user1__user', 'user2__user', 'user3__user'
            ).get(contest_id=self.contest_id, user1=profile)
        )()
        print("buibui")
        team_data = {
            "team_name": team.team_name,
            "user1_username": team.user1.user.username,
            "user2_username": team.user2.user.username if team.user2 else None,
            "user3_username": team.user3.user.username if team.user3 else None,
        }
       
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'update_participants',
                'participants': participants,
                'team': team_data
            }
        )
        print("broadcasted")

    async def update_participants(self, event):
        participants = event['participants']
        team = event['team']

        # Send the participants data to WebSocket
        print("sendig update to frontend")
        await self.send(text_data=json.dumps({
            'type': 'update_participants',
            'participants': participants,
            'team': team
        }))

    async def team_mate_invite_message(self, event):
        sender = event['sender']
        contest_id = event['contest_id']

        # Send the team mate invite data to WebSocket
        print("sending invite to frontend")
        await self.send(text_data=json.dumps({
            'type': 'team_mate_invite_message',
            'sender': sender,
            'contest_id': contest_id
        }))

    async def participant_invite_message(self, event):
        sender = event['sender']
        contest_id = event['contest_id']
        room_id = event['room_id']

        # Send the team mate invite data to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'participant_invite_message',
            'sender': sender,
            'contest_id': contest_id,
            'room_id': room_id
        }))

    async def contest_started_message(self, event):
        # Send the contest started data to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'contest_started_message',
        }))

    async def receive(self, text_data):
        data = json.loads(text_data)
        sender = self.scope["user"]
        contest_id = self.contest_id
        sender_profile = await sync_to_async(UserProfile.objects.get)(user=sender)

        # try:
        #     receiver_username = data['receiver_username']
        #     receiver = await sync_to_async(Users.objects.get)(username=receiver_username)
        #     receiver_profile = await sync_to_async(UserProfile.objects.get)(user=receiver)
        # except:
        #     receiver = None
        
        if data['type'] == 'invite_team_mate':
            print("invite_team_mate")
            receiver_username = data['receiver_username']
            receiver = await sync_to_async(Users.objects.get)(username=receiver_username)
            receiver_profile = await sync_to_async(UserProfile.objects.get)(user=receiver)

            await sync_to_async(Invites.objects.create)(
                contest=self.contest,
                from_user=sender_profile,
                to_user=receiver_profile
            )

            receiver_group_name = f"user_{receiver.username}"
            print(receiver_group_name)
            await self.channel_layer.group_send(
                receiver_group_name, 
                {
                    'type': 'team_mate_invite_message',
                    'sender': sender.username,
                    'contest_id': contest_id
                }
            )
            print("invitation from backend")

        elif data['type'] == 'invite_participant':
            receiver_username = data['receiver_username']
            receiver = await sync_to_async(Users.objects.get)(username=receiver_username)
            receiver_profile = await sync_to_async(UserProfile.objects.get)(user=receiver)
            
            await sync_to_async(Invites.objects.create)(
                contest=self.contest,
                from_user=sender_profile,
                to_user=receiver_profile
            )

            receiver_group_name = f"user_{receiver.username}"
            await self.channel_layer.group_send(
                receiver_group_name, 
                {
                    'type': 'participant_invite_message',
                    'sender': sender.username,
                    'contest_id': contest_id,
                    'room_id': self.contest.room_id 
                }
            )

        elif data['type'] == 'participant_accepted_invite':
            receiver_username = data['receiver_username']
            receiver = await sync_to_async(Users.objects.get)(username=receiver_username)
            receiver_profile = await sync_to_async(UserProfile.objects.get)(user=receiver)

            await sync_to_async(Participants.objects.create)(
                team_name=data['team_name'],
                contest=self.contest,
                user1=receiver_profile,
            )
            await self.broadcast_participants_update()

        elif data['type'] == 'team_mate_invite_accepted':
            print("invite accepted")
            receiver_username = data['receiver_username']
            receiver = await sync_to_async(Users.objects.get)(username=receiver_username)
            receiver_profile = await sync_to_async(UserProfile.objects.get)(user=receiver)

            print("before team")
            team = await sync_to_async(Participants.objects.filter)(contest=self.contest, user1=sender_profile)
            print("after team")
            if team:
                if not team.user2:
                    team.user2 = receiver_profile
                elif not team.user3:
                    team.user3 = receiver_profile
                await sync_to_async(team.save)()
            await self.broadcast_participants_update()

        elif data['type'] == 'contest_started':
            await self.channel_layer.group_send(
                self.group_name, {'type': 'contest_started_message'}
            )