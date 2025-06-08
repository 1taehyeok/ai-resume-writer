from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import RegisterSerializer, UserSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Experience
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny

@api_view(['GET'])
def test_api(request):
    return Response({
        'message': 'Hello from Django Backend!',
        'status': 'success'
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    error_messages = []
    for field, errors in serializer.errors.items():
        error_messages.extend(errors)

    return Response({
        'success': False,
        'message': error_messages[0] if error_messages else 'Invalid input'
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({
                'success': False,
                'message': '이메일과 비밀번호가 필요합니다.'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            if not user.check_password(password):
                return Response({
                    'success': False,
                    'message': '잘못된 이메일 또는 비밀번호입니다.'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            if not user.is_active:
                return Response({
                    'success': False,
                    'message': '계정이 비활성화되어 있습니다.'
                }, status=status.HTTP_403_FORBIDDEN)
            
            refresh = RefreshToken.for_user(user)
            user_data = UserSerializer(user).data
            
            return Response({
                'success': True,
                'data': {
                    'access_token': str(refresh.access_token),
                    'refresh_token': str(refresh),
                    'user': user_data
                }
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': '잘못된 이메일 또는 비밀번호입니다.'
            }, status=status.HTTP_401_UNAUTHORIZED)

    except Exception as e:
        print("Login error:", str(e))
        return Response({
            'success': False,
            'message': '서버 오류가 발생했습니다.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def save_experiences(request):
    try:
        print("Request user:", request.user)  # 디버깅용
        print("Request data:", request.data)  # 디버깅용
        
        experiences = request.data.get('experiences', [])
        user = request.user
        
        # 기존 경험 삭제
        Experience.objects.filter(user=user).delete()
        
        # 새로운 경험 저장
        for exp in experiences:
            Experience.objects.create(
                user=user,
                title=exp.get('title', ''),
                description=exp.get('description', '')
            )
        
        return Response({
            'success': True,
            'message': 'Experiences saved successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        print("Error:", str(e))  # 디버깅용
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_experiences(request):
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
        
        return Response({
            'success': True,
            'data': data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
