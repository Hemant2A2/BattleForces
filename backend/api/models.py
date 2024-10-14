from django.db import models
from django.contrib.auth.models import AbstractUser

class Users(AbstractUser):
    codeforces_handle = models.CharField(max_length=100, unique=True)
    is_verified = models.BooleanField(default=False)
