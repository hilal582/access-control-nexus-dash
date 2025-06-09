
from django.contrib import admin
from .models import Comment, CommentHistory

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'page', 'author', 'content_preview', 'created_at', 'updated_at']
    list_filter = ['page', 'created_at', 'updated_at']
    search_fields = ['content', 'author__email']
    ordering = ['-created_at']
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content Preview'

@admin.register(CommentHistory)
class CommentHistoryAdmin(admin.ModelAdmin):
    list_display = ['comment', 'action', 'modified_by', 'modified_at']
    list_filter = ['action', 'modified_at']
    search_fields = ['comment__content', 'modified_by__email']
    ordering = ['-modified_at']
