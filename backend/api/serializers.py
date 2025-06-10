from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Experience


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'email', 'name')
        read_only_fields = ('id', 'email')  # PK와 이메일은 읽기 전용
        extra_kwargs = {
            'name': {'required': False},
            'password': {'required': False}
        }
    def update(self, instance, validated_data):
        # 비밀번호 변경 시
        if 'password' in validated_data:
            instance.set_password(validated_data.pop('password'))
        return super().update(instance, validated_data)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('name', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password']
        )
        return user

    def to_representation(self, instance):
        refresh = RefreshToken.for_user(instance)
        data = super().to_representation(instance)
        return {
            'success': True,
            'data': {
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'user': {
                    'id': instance.id,
                    'name': instance.name,
                    'email': instance.email
                }
            }
        }

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ('id', 'title', 'description', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

