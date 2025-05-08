from rest_framework import serializers
from .models import CustomUser
from django.utils import timezone

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'nom', 'telephone', 'date_naissance']

    def create(self, validated_data):
        user = CustomUser(**validated_data)
        user.save()
        return user
