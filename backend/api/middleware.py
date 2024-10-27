from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from urllib.parse import parse_qs
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import AccessToken
from api.models import Users as User
from asgiref.sync import sync_to_async
import logging

# Set up logging
logger = logging.getLogger(__name__)

@sync_to_async
def get_user_from_token(token):
    try:
        access_token = AccessToken(token)
        user = User.objects.get(id=access_token["user_id"])
        return user
    except User.DoesNotExist:
        logger.warning("User with given token does not exist.")
        return AnonymousUser()
    except TokenError as e:
        logger.warning(f"TokenError: {str(e)}")
        return AnonymousUser()
    except Exception as e:
        logger.error(f"Unexpected error in token processing: {str(e)}")
        return AnonymousUser()

class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope["query_string"].decode())
        token = query_string.get("token")

        if token:
            scope["user"] = await get_user_from_token(token[0])
        else:
            logger.warning("No token found in query string; setting AnonymousUser.")
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)
