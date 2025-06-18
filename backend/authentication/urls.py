from django.urls import path
# 각 파일에서 필요한 뷰 함수들을 직접 임포트합니다.
from .views import test_api
from .views import register
from .views import login
from .views import google_login
from .views import logout
from .views import update_profile
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # 인증 관련 URLS
    path('test/', test_api, name='test-api'), # test_api도 authentication_views로 이동했다면 여기서 임포트
    path('register/', register, name='register'),
    path('token/', login, name='token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('google-login/', google_login, name='google-login'), # google_login 추가
    path('logout/', logout, name='logout'),

    # 프로필 관련 URLS
    path('update-profile/', update_profile, name='update-profile'),
]