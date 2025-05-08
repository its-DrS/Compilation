from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser
from .serializers import CustomUserSerializer

@api_view(['POST'])
def register(request):
    serializer = CustomUserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(data = {
            "user" : {
                "id" : user.id,
                "phone" : user.telephone,
                "date_naissance" : user.date_naissance
            }
        }, status=status.HTTP_201_CREATED)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)