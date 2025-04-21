from rest_framework import serializers

class DraftRequestSerializer(serializers.Serializer):
    experience = serializers.CharField(max_length=500)
    question = serializers.CharField(max_length=200)
    model_name = serializers.CharField(max_length=20, default="grok", required=False)