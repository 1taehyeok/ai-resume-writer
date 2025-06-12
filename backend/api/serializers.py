# serializers.py
from rest_framework import serializers
from .models import User, Experience # Experience도 함께 임포트
from rest_framework_simplejwt.tokens import RefreshToken # RefreshToken은 더 이상 RegisterSerializer에서 직접 사용되지 않지만, 다른 곳에서 필요할 수 있습니다.

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'name')
        read_only_fields = ('id', 'email')
        extra_kwargs = {
            'name': {'required': False},
            # 'password': {'required': False} # UserSerializer는 비밀번호 필드를 직접 다루지 않으므로 필요 없습니다.
        }

    # update 메서드에서 비밀번호 변경 로직은 유지합니다.
    def update(self, instance, validated_data):
        # 비밀번호는 UserSerializer의 fields에 없지만, update_profile 뷰에서 수동으로 전달될 수 있습니다.
        # 이 부분이 약간 혼란스러울 수 있으나, 현재 update_profile 뷰의 로직에 맞춰 유지합니다.
        # 더 DRF스러운 방식은 비밀번호 변경을 위한 별도의 Serializer를 사용하는 것입니다.
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

    # 이 to_representation 메서드를 완전히 제거합니다.
    # def to_representation(self, instance):
    #     refresh = RefreshToken.for_user(instance)
    #     data = super().to_representation(instance)
    #     return {
    #         'success': True,
    #         'data': {
    #             'access_token': str(refresh.access_token),
    #             'refresh_token': str(refresh),
    #             'user': {
    #                 'id': instance.id,
    #                 'name': instance.name,
    #                 'email': instance.email
    #             }
    #         }
    #     }

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ('id', 'title', 'description', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')