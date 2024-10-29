from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from api.models import Users, UserProfile
import requests

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, username=None):
        if username:
            # Look for the user profile by username provided in the URL parameter
            try:
                user = Users.objects.get(username=username)
            except:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Default to the current authenticated user if no username is provided
            user = request.user

        try:
            profile = UserProfile.objects.get(user=user)
        except:
            profile = UserProfile.objects.create(user=user)

        
        api_url = f"https://codeforces.com/api/user.rating?handle={user.username}"
        response = requests.get(api_url).json()

        if response['status'] == 'OK':
            try :
                profile.rating = response['result'][-1]['newRating']
            except:
                profile.rating = 0
            profile.save(update_fields=['rating'])

        return Response({
            "image": profile.image.url,
            "rating": profile.rating,
            "wins": profile.wins,
            "joined": profile.joined,
            "in_contest": profile.in_contest
        }, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user
        profile = UserProfile.objects.get(user=user)
        # Ensure that only the owner of the profile can update it
        if profile.user != user:
            return Response({"error": "You can only update your own profile."}, status=status.HTTP_403_FORBIDDEN)
        image = request.FILES.get('image')
        if image:
            profile.image = image
            profile.save(update_fields=['image'])
            return Response({"message": "Profile pic updated successfully."}, status=status.HTTP_200_OK)
        