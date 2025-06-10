from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('test/', views.test_api, name='test-api'),
    path('register/', views.register, name='register'),
    path('token/', views.login, name='token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('logout/', views.logout, name='logout'),
    path('update-profile/', views.update_profile, name='update-profile'),
    path('experiences/save/', views.save_experiences, name='save-experiences'),
    path('experiences/', views.get_experiences, name='get-experiences'),
]
