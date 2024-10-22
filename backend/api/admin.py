from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Users)
admin.site.register(UserProfile)
admin.site.register(Contests)
admin.site.register(Problems)
admin.site.register(Participants)
admin.site.register(Invites)
admin.site.register(Standings)
admin.site.register(Scoreboard)