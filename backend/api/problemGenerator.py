import requests
import random

def getRandomProblemByRating(rating):
    url = "https://codeforces.com/api/problemset.problems"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        
        if data['status'] == 'OK':
            problems = data['result']['problems']
            filtered_problems = [p for p in problems if p.get('rating') == rating]

            if filtered_problems:
                random_problem = random.choice(filtered_problems)
                return {
                    "status": "OK",
                    "url": f"https://codeforces.com/contest/{random_problem['contestId']}/problem/{random_problem['index']}"
                }
            else:
                return {"status": "Error", "message": "No problems found with the given rating."}
        else:
            return {"status": "Error", "message": "Error in fetching data from the API."}
    else:
        return {"status": "Error", "message": f"HTTP Error: {response.status_code}"}
