from django.urls import path
from .views import SubmitHandleView, GenerateProblemView, VerifySolutionView, CreatePasswordView

urlpatterns = [
    path('submit-handle/', SubmitHandleView.as_view(), name='submit_handle'),
    path('generate-problem/', GenerateProblemView.as_view(), name='generate_problem'),
    path('verify-solution/', VerifySolutionView.as_view(), name='verify_solution'),
    path('create-password/', CreatePasswordView.as_view(), name='create_password'),
]
