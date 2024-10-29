from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from api.models import Contests, Participants, Problems, Scoreboard, Standings
import string
from api.helper import getprob, check_solved


class StandingsView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, contest_id):
        # user = request.user
        # profile = UserProfile.objects.get(user=user)
        contest = Contests.objects.get(contest_id=contest_id)
        time_of_start = contest.start_time
        url_list = (Problems.objects.filter(contest = contest))
        ud = []
        for i in url_list:
            ud.append(i.problem_link)
        url_list = ud
        problem_data = getprob(url_list)
        teams = Participants.objects.filter(contest = contest) 
        ret_obj = []
        for i in teams:
            users = [ i.user1.user.username ]
            if(i.user2):
                users.append(i.user2.user.username)
            
            if(i.user3):
                users.append(i.user3.user.username) 
            
            penalty = 0
            scored = 0
            teamid = i.id 
            sbd_obj = (Scoreboard.objects.filter(contest = contest , team = teamid))[0]
            record = []
            record.append(i.team_name)
            for j in range(len(problem_data)):
                ws , fact , tim = check_solved(users,problem_data[j])
                c = string.ascii_uppercase[j]
                stand_obj = (Standings.objects.filter(contest = contest, team = teamid, problem_attempted = c))[0]
                if(fact):
                    record.append(1)
                    scored+=1
                    tim_delta = tim - time_of_start
                    minutes = (tim_delta.total_seconds())/60
                    minutes = (int)(minutes)
                    penalty+= (10*ws + minutes)
                    stand_obj.is_it_solved = True
                    stand_obj.time_of_solve = tim
                    stand_obj.attempts = ws
                else :
                    record.append(0)
                    stand_obj.attempts = ws
                    stand_obj.is_it_solved = False
                stand_obj.save()
            record.append(scored)
            record.append(penalty)
            ret_obj.append(record)
            sbd_obj.penalty = penalty
            sbd_obj.solve_count = scored
            sbd_obj.save()
        xo = len(problem_data) + 1
        ret_obj.sort(key=lambda y:(-y[xo],y[xo+1]))
        robj = []
        for value in ret_obj:
            team_name = value[0]
            itm = {}
            itm['team_name']= team_name
            solutions =[]
            for i in range(len(problem_data)):
                solutions.append(value[i+1])
            itm['solve_count'] = value[xo]
            itm['penalty'] = value[xo+1]
            itm['solutions'] = solutions
            robj.append(itm)
        return Response(robj)