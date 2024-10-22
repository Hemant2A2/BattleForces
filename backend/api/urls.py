from django.urls import path
from .views import *

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
] 
