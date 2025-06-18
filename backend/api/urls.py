from django.urls import path
# 각 파일에서 필요한 뷰 함수들을 직접 임포트합니다.
from .views import save_experiences, get_experiences

urlpatterns = [

    # 경험 관련 URLS
    path('experiences/save/', save_experiences, name='save-experiences'),
    path('experiences/', get_experiences, name='get-experiences'),
]