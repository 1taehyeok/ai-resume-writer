from rest_framework.exceptions import ValidationError
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializer import RegisterSerializer
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes, permission_classes
import logging
from django.conf import settings
from .models import User

logger = logging.getLogger(__name__)

# User 모델을 파일 상단에 한 번만 정의하여 사용
User = get_user_model()

def set_jwt_cookies(response, user):
    """
    주어진 응답 객체에 access_token과 refresh_token HttpOnly 쿠키를 설정합니다.
    """
    #refresh = user._generate_jwt_token()
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    response.set_cookie(
        key='access_token',
        value=access_token,
        httponly=True,
        secure=settings.DEBUG is False,
        samesite='Lax',
        # max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds() # 필요시 주석 해제
    )
    response.set_cookie(
        key='refresh_token',
        value=refresh_token,
        httponly=True,
        secure=settings.DEBUG is False,
        samesite='Lax',
        # max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds() # 필요시 주석 해제
    )
    return response

@api_view(['POST'])
@permission_classes([AllowAny])
def test_api(request):
    """
    제공된 JWT 토큰을 디코딩하여 정보를 테스트하는 API입니다.
    """
    try:
        # 요청 바디에서 토큰 추출
        token = request.data.get('token')
        if not token:
            logger.warning("test_api: No token provided in request data.")
            return Response({
                'message': 'No token provided',
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)

        # 토큰 디코딩
        try:
            decoded_token = AccessToken(token)
            token_info = {
                'user_id': decoded_token.get('user_id'),
                'email': decoded_token.get('email'),
                'name': decoded_token.get('name'),
                'exp': decoded_token.get('exp'),
                'iat': decoded_token.get('iat'),
                'token_type': decoded_token.get('token_type'),
                'jti': decoded_token.get('jti')
            }
            logger.info(f"test_api: Token successfully decoded for user_id: {token_info.get('user_id')}")
            return Response({
                'message': 'Token Decoded for Test',
                'status': 'success',
                'token_info': token_info
            })
        except Exception as e:
            logger.error(f"test_api: Token decoding error - {e}", exc_info=True)
            return Response({
                'message': 'Token decoding error',
                'error': str(e),
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.critical(f"test_api: Unexpected internal server error - {e}", exc_info=True)
        return Response({
            'message': 'Internal server error',
            'error': str(e),
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    새로운 사용자를 등록합니다.
    성공 시 JWT 토큰과 사용자 정보를 HttpOnly 쿠키로 반환합니다.
    """
    serializer = RegisterSerializer(data=request.data)
    try:
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        logger.info(f"사용자 등록 성공: {user.email}")

        response = Response({
            'success': True,
            'data': {
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email
                }
            }
        }, status=status.HTTP_201_CREATED)

        # 헬퍼 함수 호출로 쿠키 설정
        response = set_jwt_cookies(response, user)

        return response
    except ValidationError as e:
        logger.warning(f"사용자 등록 유효성 검사 실패: {e.detail}")
        return Response({
            'success': False,
            'message': '제출된 데이터에 오류가 있습니다.',
            'errors': e.detail
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.critical(f"사용자 등록 중 예상치 못한 서버 오류 발생: {e}", exc_info=True)
        return Response({
            'success': False,
            'message': '서버 오류가 발생했습니다.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    사용자를 이메일과 비밀번호로 인증하고 JWT 토큰을 HttpOnly 쿠키로 발급합니다.
    """
    email = request.data.get('email')
    password = request.data.get('password')

    logger.info(f"로그인 시도 - 이메일: {email}")

    if not email or not password:
        logger.warning("로그인 실패: 이메일 또는 비밀번호가 제공되지 않았습니다.")
        return Response({
            'success': False,
            'message': '이메일과 비밀번호가 필요합니다.'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Django의 authenticate 함수를 사용하여 사용자 인증 시도
        user = authenticate(request, username=email, password=password)

        if user is None:
            logger.warning(f"로그인 실패: 잘못된 자격 증명 (이메일: {email})")
            return Response({
                'success': False,
                'message': '이메일 또는 비밀번호가 잘못되었습니다.'
            }, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            logger.warning(f"로그인 실패: 비활성화된 계정 (이메일: {user.email})")
            return Response({
                'success': False,
                'message': '계정이 비활성화되어 있습니다. 관리자에게 문의해주세요.'
            }, status=status.HTTP_403_FORBIDDEN)


        logger.info(f"사용자 등록 성공: {user.email}")

        response = Response({
            'success': True,
            'data': {
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email
                }
            }
        }, status=status.HTTP_201_CREATED)

        # 헬퍼 함수 호출로 쿠키 설정
        response = set_jwt_cookies(response, user)

        return response

    except Exception as e:
        logger.critical(f"로그인 처리 중 예상치 못한 서버 오류 발생: {e}", exc_info=True)
        return Response({
            'success': False,
            'message': '로그인 중 서버 오류가 발생했습니다.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    """
    Google OAuth2 코드를 사용하여 사용자를 인증하고 JWT 토큰을 HttpOnly 쿠키로 발급합니다.
    """
    try:
        # 1. Google OAuth2 코드 검증
        code = request.data.get('code')
        if not code:
            logger.warning("Google login failed: No authorization code provided.")
            return Response({
                'success': False,
                'message': '인증 코드가 필요합니다.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # 2. Google API로 토큰 교환
        token_response = requests.post(
            'https://oauth2.googleapis.com/token',
            data={
                'code': code,
                'client_id': settings.GOOGLE_CLIENT_ID,
                'client_secret': settings.GOOGLE_CLIENT_SECRET,
                'redirect_uri': settings.GOOGLE_REDIRECT_URI,
                'grant_type': 'authorization_code'
            }
        )

        if token_response.status_code != 200:
            logger.error(f"Google token exchange failed: {token_response.text}")
            return Response({
                'success': False,
                'message': 'Google 인증 실패'
            }, status=status.HTTP_401_UNAUTHORIZED)

        # 3. Google 사용자 정보 가져오기
        user_info_response = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            headers={
                'Authorization': f'Bearer {token_response.json()["access_token"]}'
            }
        )

        if user_info_response.status_code != 200:
            logger.error(f"Failed to fetch Google user info: {user_info_response.text}")
            return Response({
                'success': False,
                'message': 'Google 사용자 정보 가져오기 실패'
            }, status=status.HTTP_401_UNAUTHORIZED)

        user_info = user_info_response.json()
        logger.info(f"Google user info fetched for email: {user_info.get('email')}")

        # 4. 사용자 검증 및 생성
        try:
            user = User.objects.get(email=user_info['email'])
            logger.info(f"Existing user found for Google login: {user.email}")
        except User.DoesNotExist:
            # 새로운 사용자 생성
            logger.info(f"Creating new user from Google login: {user_info['email']}")
            user = User.objects.create_user(
                email=user_info['email'],
                name=user_info.get('name', ''),
                password=None # 구글 로그인은 비밀번호 필요 없음
            )


        logger.info(f"사용자 등록 성공: {user.email}")

        response = Response({
            'success': True,
            'data': {
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email
                }
            }
        }, status=status.HTTP_201_CREATED)

        # 헬퍼 함수 호출로 쿠키 설정
        response = set_jwt_cookies(response, user)

        return response

    except Exception as e:
        logger.critical(f"Google login error: {e}", exc_info=True)
        return Response({
            'success': False,
            'message': '서버 오류가 발생했습니다.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def logout(request):
    """
    사용자를 로그아웃하고 HttpOnly 쿠키에 있는 리프레시 토큰을 블랙리스트에 추가합니다.
    """
    # HttpOnly 쿠키에서 refresh_token 가져오기
    refresh_token = request.COOKIES.get('refresh_token')

    if not refresh_token:
        logger.warning("로그아웃 실패: HttpOnly 쿠키에 리프레시 토큰이 없습니다.")
        return Response({
            'success': False,
            'message': '로그아웃을 위한 리프레시 토큰(쿠키)이 없습니다.'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        token = RefreshToken(refresh_token)
        token.blacklist() # JWT 블랙리스트에 토큰 추가
        logger.info("리프레시 토큰이 성공적으로 블랙리스트에 추가되었습니다.")

        response = Response({
            'success': True,
            'message': '로그아웃되었습니다.'
        })

        # HttpOnly 쿠키 삭제
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        logger.info("사용자 로그아웃 및 클라이언트 쿠키 삭제 지시 완료.")

        return response

    except TokenError as e:
        logger.warning(f"로그아웃 실패: 유효하지 않거나 이미 블랙리스트에 있는 리프레시 토큰 - {e}")
        return Response({
            'success': False,
            'message': '유효하지 않은 토큰입니다. 이미 로그아웃되었을 수 있습니다.'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.critical(f"로그아웃 처리 중 예상치 못한 서버 오류 발생: {e}", exc_info=True)
        return Response({
            'success': False,
            'message': '로그아웃 중 서버 오류가 발생했습니다.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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