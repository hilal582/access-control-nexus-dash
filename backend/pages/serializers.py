from rest_framework import serializers
from .models import Comment, CommentHistory

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_email = serializers.CharField(source='author.email', read_only=True)
    can_edit = serializers.SerializerMethodField()
    can_delete = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = [
            'id', 'page', 'content', 'author', 'author_name', 'author_email', 
            'created_at', 'updated_at', 'can_edit', 'can_delete'
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']
    
    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}".strip() or obj.author.username
    
    def get_can_edit(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        
        if request.user.is_super_admin:
            return True
            
        from accounts.models import UserPermission
        return UserPermission.objects.filter(
            user=request.user,
            page=obj.page,
            permission='edit'
        ).exists()
    
    def get_can_delete(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        
        if request.user.is_super_admin:
            return True
            
        from accounts.models import UserPermission
        return UserPermission.objects.filter(
            user=request.user,
            page=obj.page,
            permission='delete'
        ).exists()

class CommentHistorySerializer(serializers.ModelSerializer):
    modified_by_name = serializers.SerializerMethodField()
    modified_by_email = serializers.CharField(source='modified_by.email', read_only=True)
    
    class Meta:
        model = CommentHistory
        fields = [
            'id', 'previous_content', 'modified_by', 'modified_by_name', 
            'modified_by_email', 'modified_at', 'action'
        ]
    
    def get_modified_by_name(self, obj):
        return f"{obj.modified_by.first_name} {obj.modified_by.last_name}".strip() or obj.modified_by.username