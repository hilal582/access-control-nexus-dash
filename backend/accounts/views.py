
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import UserPermission
from .serializers import UserSerializer, LoginSerializer, CreateUserSerializer, UserPermissionSerializer
import secrets
import string
from supabase_client import get_supabase_client

User = get_user_model()

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        # Use Supabase tokens instead of JWT tokens
        return Response({
            'refresh': user.supabase_refresh_token,
            'access': user.supabase_access_token,
            'user': UserSerializer(user).data
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def refresh_token_view(request):
    try:
        refresh_token = request.data['refresh']
        
        # Use Supabase to refresh token
        supabase = get_supabase_client()
        response = supabase.auth.refresh_session(refresh_token)
        
        return Response({
            'access': response.session.access_token,
            'refresh': response.session.refresh_token
        })
    except Exception as e:
        return Response({'error': f'Invalid refresh token: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateUserSerializer
        return UserSerializer
    
    def list(self, request, *args, **kwargs):
        # Get users from Supabase
        try:
            # Extract token from Authorization header
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return Response({'error': 'Authorization token required'}, status=status.HTTP_401_UNAUTHORIZED)
            
            token = auth_header.split(' ')[1]
            
            # Verify token with Supabase
            supabase = get_supabase_client()
            supabase.auth.get_user(token)
            
            # Check if user is super admin
            user_response = supabase.from_('users').select('is_super_admin').eq('id', request.user.id).execute()
            user_data = user_response.data
            
            if not user_data or not user_data[0]['is_super_admin']:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
            # Get all users from Supabase
            response = supabase.from_('users').select('*').execute()
            return Response(response.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def create(self, request, *args, **kwargs):
        try:
            # Extract token from Authorization header
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return Response({'error': 'Authorization token required'}, status=status.HTTP_401_UNAUTHORIZED)
            
            token = auth_header.split(' ')[1]
            
            # Verify token with Supabase
            supabase = get_supabase_client()
            supabase.auth.get_user(token)
            
            # Check if user is super admin
            user_response = supabase.from_('users').select('is_super_admin').eq('id', request.user.id).execute()
            user_data = user_response.data
            
            if not user_data or not user_data[0]['is_super_admin']:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
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
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def generate_strong_password(self):
        # Generate 12 character password with uppercase, lowercase, digits, and symbols
        alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
        password = ''.join(secrets.choice(alphabet) for i in range(12))
        return password

class UserPermissionListView(generics.ListAPIView):
    serializer_class = UserPermissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request, *args, **kwargs):
        user_id = self.kwargs['user_id']
        try:
            # Extract token from Authorization header
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return Response({'error': 'Authorization token required'}, status=status.HTTP_401_UNAUTHORIZED)
            
            token = auth_header.split(' ')[1]
            
            # Verify token with Supabase
            supabase = get_supabase_client()
            supabase.auth.get_user(token)
            
            # Get permissions from Supabase
            response = supabase.from_('user_permissions').select('*').eq('user_id', user_id).execute()
            return Response(response.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_user_permissions(request, user_id):
    try:
        # Extract token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Authorization token required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        token = auth_header.split(' ')[1]
        
        # Verify token with Supabase
        supabase = get_supabase_client()
        supabase.auth.get_user(token)
        
        # Check if user is super admin
        user_response = supabase.from_('users').select('is_super_admin').eq('id', request.user.id).execute()
        user_data = user_response.data
        
        if not user_data or not user_data[0]['is_super_admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Check if the target user exists in Supabase
        target_user = supabase.from_('users').select('id').eq('id', user_id).execute()
        if not target_user.data:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        permissions_data = request.data.get('permissions', {})
        
        # Clear existing permissions for user in Supabase
        supabase.from_('user_permissions').delete().eq('user_id', user_id).execute()
        
        # Create new permissions in Supabase
        for page, permission_list in permissions_data.items():
            for permission in permission_list:
                supabase.from_('user_permissions').insert({
                    'user_id': user_id,
                    'page': page,
                    'permission': permission.lower()
                }).execute()
        
        return Response({'message': 'Permissions updated successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_permissions_view(request, user_id):
    try:
        # Extract token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Authorization token required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        token = auth_header.split(' ')[1]
        
        # Verify token with Supabase
        supabase = get_supabase_client()
        supabase.auth.get_user(token)
        
        # Get permissions from Supabase
        response = supabase.from_('user_permissions').select('*').eq('user_id', user_id).execute()
        
        return Response(response.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
