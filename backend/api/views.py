from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Experience # Experience 모델 import 필요
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes, permission_classes
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def save_experiences(request):
    """
    인증된 사용자의 경험 데이터를 저장합니다.
    기존 경험은 삭제하고 새로운 경험으로 대체합니다.
    """
    try:
        user = request.user
        experiences_data = request.data.get('experiences', [])
        logger.info(f"Attempting to save experiences for user: {user.email}, {len(experiences_data)} items received.")

        # 기존 경험 삭제
        Experience.objects.filter(user=user).delete()
        logger.info(f"Existing experiences deleted for user: {user.email}")

        # 새로운 경험 저장
        for exp_data in experiences_data:
            # title과 description이 필수로 필요하다고 가정하고, 없으면 빈 문자열로 처리
            title = exp_data.get('title', '')
            description = exp_data.get('description', '')

            # 최소한 하나라도 값이 있어야 저장
            if title or description:
                Experience.objects.create(
                    user=user,
                    title=title,
                    description=description
                )
        logger.info(f"New experiences saved successfully for user: {user.email}")

        return Response({
            'success': True,
            'message': 'Experiences saved successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.critical(f"Error saving experiences for user {request.user.email if request.user.is_authenticated else 'anonymous'}: {e}", exc_info=True)
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_experiences(request):
    """
    인증된 사용자의 모든 경험 데이터를 조회합니다.
    """
    try:
        user = request.user
        experiences = Experience.objects.filter(user=user)
        data = []
        for exp in experiences:
            data.append({
                'id': exp.id,
                'title': exp.title,
                'description': exp.description
            })
        logger.info(f"Successfully retrieved {len(data)} experiences for user: {user.email}")

        return Response({
            'success': True,
            'data': data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.critical(f"Error retrieving experiences for user {request.user.email if request.user.is_authenticated else 'anonymous'}: {e}", exc_info=True)
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)