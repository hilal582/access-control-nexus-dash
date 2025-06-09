
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserPermission

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'first_name', 'last_name', 'is_super_admin', 'is_active', 'created_at']
    list_filter = ['is_super_admin', 'is_active', 'created_at']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['email']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('is_super_admin',)}),
    )

@admin.register(UserPermission)
class UserPermissionAdmin(admin.ModelAdmin):
    list_display = ['user', 'page', 'permission', 'created_at']
    list_filter = ['page', 'permission', 'created_at']
    search_fields = ['user__email', 'page']
    ordering = ['user', 'page']
