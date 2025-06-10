# api/authentication.py
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.authentication import default_user_authentication_rule
import logging

logger = logging.getLogger(__name__)

def custom_user_authentication_rule(token):
    try:
        # 토큰에서 user_id 추출
        user_id = token.get('user_id')
        logger.info(f"Token user_id: {user_id}")
        
        if user_id is None:
            logger.error("No user_id in token")
            return None
        
        User = get_user_model()
        
        # 토큰의 user_id로 사용자 찾기
        user = User.objects.get(id=user_id)
        logger.info(f"Found user: {user.email}")
        
        if user.is_active:
            return user
        logger.error(f"User {user_id} is inactive")
        return None
        
    except User.DoesNotExist:
        logger.error(f"User {user_id} not found")
        return None
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        return None