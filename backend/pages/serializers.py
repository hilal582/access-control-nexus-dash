
from rest_framework import serializers
from .models import Comment, CommentHistory

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.first_name', read_only=True)
    author_email = serializers.CharField(source='author.email', read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'page', 'content', 'author', 'author_name', 'author_email', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']

class CommentHistorySerializer(serializers.ModelSerializer):
    modified_by_name = serializers.CharField(source='modified_by.first_name', read_only=True)
    modified_by_email = serializers.CharField(source='modified_by.email', read_only=True)
    
    class Meta:
        model = CommentHistory
        fields = ['id', 'previous_content', 'modified_by', 'modified_by_name', 'modified_by_email', 'modified_at', 'action']
