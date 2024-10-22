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
    room_id = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.contest_id
    

class Problems(models.Model):
    contest = models.ForeignKey(Contests, on_delete=models.CASCADE)
    problem_name = models.CharField(max_length=255) # A, B ,C ...
    problem_link = models.URLField()

    class Meta:
        unique_together = ('contest', 'problem_name')

    def __str__(self):
        return self.problem_link
    

class Participants(models.Model):
    team_name = models.CharField(max_length=255)
    contest = models.ForeignKey(Contests, on_delete=models.CASCADE)
    user1 = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='team_member1')
    user2 = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='team_member2', null=True, blank=True)
    user3 = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='team_member3', null=True, blank=True)

    class Meta:
        unique_together = ('user1', 'contest')
    

class Invites(models.Model):
    contest = models.ForeignKey(Contests, on_delete=models.CASCADE)
    from_user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='sent_invites')
    to_user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='received_invites')

    class Meta:
        unique_together = ('contest', 'from_user', 'to_user')
    

class Standings(models.Model):
    contest = models.ForeignKey(Contests, on_delete=models.CASCADE)
    team = models.ForeignKey(Participants, on_delete=models.CASCADE)
    problem_attempted = models.CharField(max_length=255)
    is_it_solved = models.BooleanField(default=False)
    time_of_solve = models.DateTimeField(null=True, blank=True)
    attempts = models.IntegerField(default=0)

    class Meta:
        unique_together = ('contest', 'team', 'problem_attempted')


class Scoreboard(models.Model):
    contest = models.ForeignKey(Contests, on_delete=models.CASCADE)
    team = models.ForeignKey(Participants, on_delete=models.CASCADE)
    penalty = models.IntegerField(default=0)
    solve_count = models.IntegerField(default=0)

    class Meta:
        unique_together = ('contest', 'team')