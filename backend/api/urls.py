from django.urls import path
from .views import SubmitHandleView, GenerateVerificationProblemView, VerifySolutionView, CreatePasswordView

urlpatterns = [
    path('submit-handle/', SubmitHandleView.as_view(), name='submit_handle'),
    path('generate-verification-problem/', GenerateVerificationProblemView.as_view(), name='generate_verification_problem'),
    path('verify-solution/', VerifySolutionView.as_view(), name='verify_solution'),
    path('create-password/', CreatePasswordView.as_view(), name='create_password'),
]
