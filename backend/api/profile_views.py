from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes, permission_classes
import logging

logger = logging.getLogger(__name__)

@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    인증된 사용자의 프로필 정보를 업데이트합니다.
    비밀번호 변경 시 현재 비밀번호 확인이 필요합니다.
    """
    try:
        user = request.user
        logger.info(f"Attempting to update profile for user: {user.email}")

        # 비밀번호를 변경하는 경우 현재 비밀번호 확인
        current_password = request.data.get('current_password')
        new_password = request.data.get('password')

        if new_password: # 새 비밀번호가 제공된 경우에만 현재 비밀번호 확인 로직 실행
            if not current_password:
                logger.warning(f"Profile update failed for {user.email}: Current password not provided for password change.")
                return Response({
                    'success': False,
                    'message': '비밀번호 변경을 위해서는 현재 비밀번호를 입력해주세요.'
                }, status=status.HTTP_400_BAD_REQUEST)

            if not user.check_password(current_password):
                logger.warning(f"Profile update failed for {user.email}: Incorrect current password provided for password change.")
                return Response({
                    'success': False,
                    'message': '현재 비밀번호가 일치하지 않습니다.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # 새 비밀번호 설정
            user.set_password(new_password)
            logger.info(f"New password set for user: {user.email}")

        # 사용자 정보 업데이트 (partial=True는 부분 업데이트를 허용)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save() # serializer.save()가 사용자 인스턴스를 반환

            if new_password:
                user.save() # set_password 호출 후에는 save를 명시적으로 호출해야 합니다.

            response_message = '프로필이 성공적으로 업데이트되었습니다.'
            if new_password:
                response_message = '비밀번호와 프로필이 성공적으로 업데이트되었습니다.'
                logger.info(f"Password and profile updated successfully for user: {user.email}")
            else:
                logger.info(f"Profile updated successfully for user: {user.email}")

            return Response({
                'success': True,
                'message': response_message,
                'data': {
                    'id': user.id,
                    'email': user.email,
                    'name': user.name
                }
            }, status=status.HTTP_200_OK)

        logger.warning(f"Profile update failed for {user.email}: Invalid data - {serializer.errors}")
        return Response({
            'success': False,
            'message': '유효하지 않은 데이터입니다.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.critical(f"Error during profile update for user {request.user.email if request.user.is_authenticated else 'anonymous'}: {e}", exc_info=True)
        return Response({
            'success': False,
            'message': '프로필 업데이트 중 오류가 발생했습니다.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)