from rest_framework import serializers
from .models import Users
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token
    
class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        token = RefreshToken(data['refresh'])
        data['access'] = str(token.access_token)
        token['username'] = token.payload.get('username')
        return data

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['username', 'codeforces_handle', 'password', 'is_verified']
        extra_kwargs = {
            'password': {'write_only': True}
        }

