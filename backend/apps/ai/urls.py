from django.urls import path
from .views import GenerateDraftView

app_name = "ai"

urlpatterns = [
    path("resume/draft/", GenerateDraftView.as_view(), name="generate_draft"),
]