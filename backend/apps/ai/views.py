from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .llm_manager import LLMManager
from .serializers import DraftRequestSerializer

class GenerateDraftView(APIView):
    def post(self, request):
        serializer = DraftRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        experience = serializer.validated_data["experience"]
        question = serializer.validated_data["question"]
        model_name = serializer.validated_data.get("model_name", "grok")  # 기본값 Grok

        prompt = f"문항 '{question}'에 맞춰 사용자의 경험 '{experience}'을 300자 내로 자연스럽게 작성해줘."
        
        try:
            llm_manager = LLMManager()
            result = llm_manager.generate(model_name, prompt, max_tokens=200)
            return Response({"draft": result}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)