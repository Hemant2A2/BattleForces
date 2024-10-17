from django.db import models
from django.contrib.auth.models import AbstractUser

class Users(AbstractUser):
    codeforces_handle = models.CharField(max_length=100)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.codeforces_handle

class UserProfile(models.Model):
    user = models.OneToOneField(Users, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='profile_pics', default='default_user.png', blank=True)
    rating = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    joined = models.DateTimeField(auto_now_add=True)
    in_contest = models.BooleanField(default=False) 

    def __str__(self):
        return self.user.codeforces_handle