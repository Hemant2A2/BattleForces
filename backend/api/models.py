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
    
class Contests(models.Model):
    contest_id = models.AutoField(primary_key=True)
    contest_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_public = models.BooleanField(default=True)
    duration = models.IntegerField()  # in hours
    start_time = models.DateTimeField(default=None, null=True, blank=True)
    creator = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='created_contests')
    number_of_problems = models.IntegerField()
    min_rating = models.IntegerField(default=800)
    max_rating = models.IntegerField(default=3500)

    def __str__(self):
        return self.contest_id
    

class Problems(models.Model):
    contest_id = models.ForeignKey(Contests, on_delete=models.CASCADE)
    problem_name = models.CharField(max_length=255) # A, B ,C ...
    problem_link = models.URLField()

    class Meta:
        unique_together = ('contest_id', 'problem_name')

    def __str__(self):
        return self.problem_link
    

class Participants(models.Model):
    team_name = models.CharField(max_length=255)
    contest_id = models.ForeignKey(Contests, on_delete=models.CASCADE)
    user1 = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='team_member1')
    user2 = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='team_member2', null=True, blank=True)
    user3 = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='team_member3', null=True, blank=True)

    class Meta:
        unique_together = ('team_name', 'contest_id')

    def __str__(self):
        return self.user1.codeforces_handle
    

class Invites(models.Model):
    contest_id = models.ForeignKey(Contests, on_delete=models.CASCADE)
    from_user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='sent_invites')
    to_user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='received_invites')

    class Meta:
        unique_together = ('contest_id', 'from_user', 'to_user')

    def __str__(self):
        return f"Invite from {self.from_user} to {self.to_user} for contest {self.contest.name}"
    