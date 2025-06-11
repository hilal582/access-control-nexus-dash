from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Comment, CommentHistory
from .serializers import CommentSerializer, CommentHistorySerializer
from accounts.models import UserPermission

class HasPagePermission(permissions.BasePermission):
    """
    Custom permission to check if user has specific permission for a page
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.user.is_super_admin:
            return True
            
        page = view.kwargs.get('page')
        if not page:
            return False
            
        # Check for view permission at minimum
        return UserPermission.objects.filter(
            user=request.user,
            page=page,
            permission__in=['view', 'edit', 'create', 'delete']
        ).exists()

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, HasPagePermission]
    
    def get_queryset(self):
        page = self.kwargs['page']
        return Comment.objects.filter(page=page).order_by('-created_at')
    
    def perform_create(self, serializer):
        page = self.kwargs['page']
        
        # Check if user has create permission for this page
        if not self.has_create_permission(self.request.user, page):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('No permission to create comments on this page')
        
        comment = serializer.save(author=self.request.user, page=page)
        
        # Create history record
        CommentHistory.objects.create(
            comment=comment,
            previous_content='',
            modified_by=self.request.user,
            action='created'
        )
    
    def has_create_permission(self, user, page):
        if user.is_super_admin:
            return True
        return UserPermission.objects.filter(
            user=user, 
            page=page, 
            permission='create'
        ).exists()

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def update(self, request, *args, **kwargs):
        comment = self.get_object()
        
        # Check if user has edit permission
        if not self.has_edit_permission(request.user, comment.page):
            return Response({'error': 'No permission to edit comments on this page'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        # Store previous content for history
        previous_content = comment.content
        
        response = super().update(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Create history record
            CommentHistory.objects.create(
                comment=comment,
                previous_content=previous_content,
                modified_by=request.user,
                action='updated'
            )
        
        return response
    
    def destroy(self, request, *args, **kwargs):
        comment = self.get_object()
        
        # Check if user has delete permission
        if not self.has_delete_permission(request.user, comment.page):
            return Response({'error': 'No permission to delete comments on this page'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        # Create history record before deletion
        CommentHistory.objects.create(
            comment=comment,
            previous_content=comment.content,
            modified_by=request.user,
            action='deleted'
        )
        
        return super().destroy(request, *args, **kwargs)
    
    def has_edit_permission(self, user, page):
        if user.is_super_admin:
            return True
        return UserPermission.objects.filter(
            user=user, 
            page=page, 
            permission='edit'
        ).exists()
    
    def has_delete_permission(self, user, page):
        if user.is_super_admin:
            return True
        return UserPermission.objects.filter(
            user=user, 
            page=page, 
            permission='delete'
        ).exists()

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def comment_history_view(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id)
    
    # Only super admin can view history
    if not request.user.is_super_admin:
        return Response({'error': 'Only super admin can view comment history'}, 
                      status=status.HTTP_403_FORBIDDEN)
    
    history = CommentHistory.objects.filter(comment=comment).order_by('-modified_at')
    serializer = CommentHistorySerializer(history, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_page_permissions(request, page):
    """Get current user's permissions for a specific page"""
    if request.user.is_super_admin:
        permissions = ['view', 'edit', 'create', 'delete']
    else:
        permissions = list(UserPermission.objects.filter(
            user=request.user, 
            page=page
        ).values_list('permission', flat=True))
    
    return Response({'permissions': permissions})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def available_pages(request):
    """Get list of available pages"""
    pages = [
        {'key': 'products-list', 'name': 'Products List'},
        {'key': 'marketing-list', 'name': 'Marketing List'},
        {'key': 'order-list', 'name': 'Order List'},
        {'key': 'media-plans', 'name': 'Media Plans'},
        {'key': 'offer-pricing', 'name': 'Offer Pricing SKUs'},
        {'key': 'clients', 'name': 'Clients'},
        {'key': 'suppliers', 'name': 'Suppliers'},
        {'key': 'customer-support', 'name': 'Customer Support'},
        {'key': 'sales-reports', 'name': 'Sales Reports'},
        {'key': 'finance', 'name': 'Finance & Accounting'},
    ]
    
    if request.user.is_super_admin:
        # Super admin can access all pages
        return Response(pages)
    
    # Regular users can only access pages they have permissions for
    user_pages = UserPermission.objects.filter(user=request.user).values_list('page', flat=True).distinct()
    accessible_pages = [page for page in pages if page['key'] in user_pages]
    
    return Response(accessible_pages)