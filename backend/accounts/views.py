
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import UserPermission
from .serializers import UserSerializer, LoginSerializer, CreateUserSerializer, UserPermissionSerializer
import secrets
import string

User = get_user_model()

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def refresh_token_view(request):
    try:
        refresh_token = request.data['refresh']
        token = RefreshToken(refresh_token)
        return Response({
            'access': str(token.access_token),
        })
    except Exception as e:
        return Response({'error': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateUserSerializer
        return UserSerializer
    
    def create(self, request, *args, **kwargs):
        # Auto-generate strong password
        password = self.generate_strong_password()
        data = request.data.copy()
        data['password'] = password
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'user': UserSerializer(user).data,
            'password': password,
            'message': 'User created successfully. Password should be sent to user email.'
        }, status=status.HTTP_201_CREATED)
    
    def generate_strong_password(self):
        # Generate 12 character password with uppercase, lowercase, digits, and symbols
        alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
        password = ''.join(secrets.choice(alphabet) for i in range(12))
        return password

class UserPermissionListView(generics.ListAPIView):
    serializer_class = UserPermissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return UserPermission.objects.filter(user_id=user_id)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_user_permissions(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        permissions_data = request.data.get('permissions', {})
        
        # Clear existing permissions for user
        UserPermission.objects.filter(user=user).delete()
        
        # Create new permissions
        for page, permission_list in permissions_data.items():
            for permission in permission_list:
                UserPermission.objects.create(
                    user=user,
                    page=page,
                    permission=permission.lower()
                )
        
        return Response({'message': 'Permissions updated successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_permissions_view(request, user_id):
    try:
        permissions = UserPermission.objects.filter(user_id=user_id)
        serializer = UserPermissionSerializer(permissions, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
