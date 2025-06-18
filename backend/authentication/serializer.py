# serializers.py
from rest_framework import serializers
from .models import User # 모델 임포트

# 사용자 정보 시리얼라이저
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'name')
        read_only_fields = ('id', 'email')
        extra_kwargs = {
            'name': {'required': False},
        }

    # update 메서드에서 비밀번호 변경 로직은 유지합니다.
    def update(self, instance, validated_data):
        # 비밀번호는 UserSerializer의 fields에 없지만, update_profile 뷰에서 수동으로 전달될 수 있습니다.
        # 이 부분이 약간 혼란스러울 수 있으나, 현재 update_profile 뷰의 로직에 맞춰 유지합니다.
        # 더 DRF스러운 방식은 비밀번호 변경을 위한 별도의 Serializer를 사용하는 것입니다.
        if 'password' in validated_data:
            instance.set_password(validated_data.pop('password'))
        return super().update(instance, validated_data)

# 회원가입 시리얼라이저
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'name', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password']
        )
        return user