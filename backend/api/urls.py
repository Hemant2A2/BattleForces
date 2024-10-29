from django.urls import path
from api.views.register import (
    SubmitHandleView, 
    GenerateVerificationProblemView, 
    CreatePasswordView,
    VerifySolutionView,
)
from api.views.contest import (
    CreateContestView,
    JoinContestView,
    JoinContestAsTeamMateView,
)
from api.views.profile import UserProfileView
from api.views.invitation import SendInviteToParticipant, SendInviteToTeamMateView
from api.views.problems import GenerateContestProblemsView
from api.views.participants import ParticipantsView
from api.views.standings import StandingsView



urlpatterns = [
    path('submit-handle/', SubmitHandleView.as_view(), name='submit_handle'),
    path('generate-verification-problem/', GenerateVerificationProblemView.as_view(), name='generate_verification_problem'),
    path('verify-solution/', VerifySolutionView.as_view(), name='verify_solution'),
    path('create-password/', CreatePasswordView.as_view(), name='create_password'),
    path('view-profile/<str:username>/', UserProfileView.as_view(), name='view_profile'),
    path('update-profile/', UserProfileView.as_view(), name='update_profile'),
    path('create-contest/', CreateContestView.as_view(), name='create_contest'),
    path('contest/problems/<int:contest_id>', GenerateContestProblemsView.as_view(), name='generate_contest_problems'),
    path('join-contest/', JoinContestView.as_view(), name='join_contest'),
    path('join-contest-team-mate/', JoinContestAsTeamMateView.as_view(), name='join_contest-team-mate'),
    path('contest/standings/<int:contest_id>', StandingsView.as_view(), name='standings'),
    path('contest/participants/<int:contest_id>', ParticipantsView.as_view(), name='contest_participants'),
    path('invite-participant/', SendInviteToParticipant.as_view(), name='invite_participant'),
    path('invite-team-mate/', SendInviteToTeamMateView.as_view(), name='invite_team_mate'),
] 
