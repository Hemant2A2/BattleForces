from django.urls import path
from .consumers import *

websocket_urlpatterns = [
    path('ws/participants/<int:contest_id>/', ParticipantsConsumer.as_asgi()),
]
