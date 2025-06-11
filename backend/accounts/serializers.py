from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from .models import UserPermission

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'is_super_admin']

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            from supabase_client import get_supabase_client
            
            try:
                # Authenticate with Supabase
                supabase = get_supabase_client()
                response = supabase.auth.sign_in_with_password({
                    'email': email,
                    'password': password
                })
                
                # Get user data from Supabase
                user_data = response.user
                
                # Check if user exists in Django database or create it
                try:
                    user = User.objects.get(email=email)
                except User.DoesNotExist:
                    # Create user in Django database based on Supabase data
                    user = User(
                        id=user_data.id,
                        email=user_data.email,
                        full_name=user_data.user_metadata.get('full_name', ''),
                        is_super_admin=user_data.user_metadata.get('is_super_admin', False)
                    )
                    user.save()
                
                # Update user attributes if needed
                update_needed = False
                if user.full_name != user_data.user_metadata.get('full_name', ''):
                    user.full_name = user_data.user_metadata.get('full_name', '')
                    update_needed = True
                
                if user.is_super_admin != user_data.user_metadata.get('is_super_admin', False):
                    user.is_super_admin = user_data.user_metadata.get('is_super_admin', False)
                    update_needed = True
                
                if update_needed:
                    user.save()
                
                # Set Supabase tokens on the user object for retrieval in the view
                user.supabase_access_token = response.session.access_token
                user.supabase_refresh_token = response.session.refresh_token
                
                return {'user': user}
            except Exception as e:
                raise serializers.ValidationError(f'Unable to authenticate with provided credentials: {str(e)}')
        else:
            raise serializers.ValidationError('Must include "email" and "password".')

class CreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'full_name', 'is_super_admin']
    
    def create(self, validated_data):
        from supabase_client import get_supabase_client
        
        # Extract data
        email = validated_data.get('email')
        password = validated_data.get('password')
        full_name = validated_data.get('full_name', '')
        is_super_admin = validated_data.get('is_super_admin', False)
        
        # Create user in Supabase
        supabase = get_supabase_client()
        response = supabase.auth.admin.create_user({
            'email': email,
            'password': password,
            'email_confirm': True,
            'user_metadata': {
                'full_name': full_name,
                'is_super_admin': is_super_admin
            }
        })
        
        # Create user in Django database
        user = User(
            id=response.id,
            email=email,
            full_name=full_name,
            is_super_admin=is_super_admin
        )
        user.save()
        
        return user

class UserPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPermission
        fields = ['id', 'user', 'page', 'permission']
