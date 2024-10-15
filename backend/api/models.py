from django.db import models
from django.contrib.auth.models import AbstractUser

class Users(AbstractUser):
    codeforces_handle = models.CharField(max_length=100)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.codeforces_handle
