from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('test/', views.test_api, name='test-api'),
    path('register/', views.register, name='register'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
