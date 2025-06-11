from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import UserPermission, PasswordResetOTP
from .serializers import (
    UserSerializer, LoginSerializer, CreateUserSerializer, 
    UserPermissionSerializer, PasswordResetRequestSerializer,
    PasswordResetVerifySerializer, UpdateProfileSerializer
)

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

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def profile_view(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_profile_view(request):
    serializer = UpdateProfileSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(UserSerializer(request.user).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.request.method == 'POST':
            # Only super admin can create users
            return [permissions.IsAuthenticated(), IsSuperAdmin()]
        return [permissions.IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateUserSerializer
        return UserSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'user': UserSerializer(user).data,
            'password': getattr(user, '_generated_password', 'Password was provided'),
            'message': 'User created successfully. Password should be sent to user email.'
        }, status=status.HTTP_201_CREATED)

class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_super_admin

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsSuperAdmin])
def update_user_permissions(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        permissions_data = request.data.get('permissions', {})
        
        # Clear existing permissions for user
        UserPermission.objects.filter(user=user).delete()
        
        # Create new permissions
        for page, permission_list in permissions_data.items():
            if isinstance(permission_list, list):
                for permission in permission_list:
                    UserPermission.objects.create(
                        user=user,
                        page=page,
                        permission=permission.lower()
                    )
            else:
                # Single permission
                UserPermission.objects.create(
                    user=user,
                    page=page,
                    permission=permission_list.lower()
                )
        
        return Response({'message': 'Permissions updated successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_permissions_view(request, user_id=None):
    try:
        if user_id:
            # Get permissions for specific user (admin only)
            if not request.user.is_super_admin:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            permissions = UserPermission.objects.filter(user_id=user_id)
        else:
            # Get permissions for current user
            permissions = UserPermission.objects.filter(user=request.user)
            
        serializer = UserPermissionSerializer(permissions, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsSuperAdmin])
def all_permissions_view(request):
    """Get all user permissions for admin dashboard"""
    permissions = UserPermission.objects.select_related('user').all()
    serializer = UserPermissionSerializer(permissions, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_request(request):
    serializer = PasswordResetRequestSerializer(data=request.data)
    if serializer.is_valid():
        result = serializer.save()
        return Response(result)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_verify(request):
    serializer = PasswordResetVerifySerializer(data=request.data)
    if serializer.is_valid():
        result = serializer.save()
        return Response(result)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Successfully logged out'})
    except Exception as e:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)