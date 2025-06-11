from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from supabase_client import get_supabase_client

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_comments(request, page):
    try:
        # Extract token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Authorization token required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        token = auth_header.split(' ')[1]
        
        # Verify token with Supabase
        supabase = get_supabase_client()
        supabase.auth.get_user(token)
        
        # Get comments from Supabase
        response = supabase.from_('comments').select('*').eq('page', page).order('created_at').execute()
        
        # Include user details for each comment
        comments = response.data
        for comment in comments:
            if comment.get('author_id'):
                user_response = supabase.from_('users').select('email,full_name').eq('id', comment['author_id']).execute()
                if user_response.data:
                    comment['author'] = user_response.data[0]
        
        return Response(comments)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_comment(request, page):
    try:
        # Extract token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Authorization token required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        token = auth_header.split(' ')[1]
        
        # Verify token with Supabase
        supabase = get_supabase_client()
        user = supabase.auth.get_user(token)
        user_id = user.user.id
        
        # Check if user has permission to add comments
        has_permission = False
        
        # Check super admin status
        super_admin_response = supabase.from_('users').select('is_super_admin').eq('id', user_id).execute()
        if super_admin_response.data and super_admin_response.data[0]['is_super_admin']:
            has_permission = True
        else:
            # Check specific permissions
            permission_response = supabase.from_('user_permissions')\
                .select('*')\
                .eq('user_id', user_id)\
                .eq('page', page)\
                .eq('permission', 'create')\
                .execute()
            
            if permission_response.data:
                has_permission = True
        
        if not has_permission:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Get comment content from request
        content = request.data.get('content')
        if not content:
            return Response({'error': 'Comment content is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Add comment to Supabase
        response = supabase.from_('comments').insert({
            'page': page,
            'author_id': user_id,
            'content': content
        }).execute()
        
        # Get the created comment
        if response.data:
            return Response(response.data[0])
        else:
            return Response({'error': 'Failed to create comment'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_comment(request, comment_id):
    try:
        # Extract token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Authorization token required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        token = auth_header.split(' ')[1]
        
        # Verify token with Supabase
        supabase = get_supabase_client()
        user = supabase.auth.get_user(token)
        user_id = user.user.id
        
        # Get the comment
        comment_response = supabase.from_('comments').select('*').eq('id', comment_id).execute()
        if not comment_response.data:
            return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
        
        comment = comment_response.data[0]
        page = comment.get('page')
        
        # Check if user has permission to edit comments
        has_permission = False
        
        # Check super admin status
        super_admin_response = supabase.from_('users').select('is_super_admin').eq('id', user_id).execute()
        if super_admin_response.data and super_admin_response.data[0]['is_super_admin']:
            has_permission = True
        elif comment.get('author_id') == user_id:
            # User is the author
            has_permission = True
        else:
            # Check specific permissions
            permission_response = supabase.from_('user_permissions')\
                .select('*')\
                .eq('user_id', user_id)\
                .eq('page', page)\
                .eq('permission', 'edit')\
                .execute()
            
            if permission_response.data:
                has_permission = True
        
        if not has_permission:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Get comment content from request
        content = request.data.get('content')
        if not content:
            return Response({'error': 'Comment content is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Save previous content to history
        supabase.from_('comment_history').insert({
            'comment_id': comment_id,
            'previous_content': comment.get('content'),
            'modified_by': user_id,
            'action': 'edit'
        }).execute()
        
        # Update comment in Supabase
        response = supabase.from_('comments')\
            .update({'content': content, 'updated_at': 'now()'})\
            .eq('id', comment_id)\
            .execute()
        
        if response.data:
            return Response(response.data[0])
        else:
            return Response({'error': 'Failed to update comment'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_comment(request, comment_id):
    try:
        # Extract token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Authorization token required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        token = auth_header.split(' ')[1]
        
        # Verify token with Supabase
        supabase = get_supabase_client()
        user = supabase.auth.get_user(token)
        user_id = user.user.id
        
        # Get the comment
        comment_response = supabase.from_('comments').select('*').eq('id', comment_id).execute()
        if not comment_response.data:
            return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
        
        comment = comment_response.data[0]
        page = comment.get('page')
        
        # Check if user has permission to delete comments
        has_permission = False
        
        # Check super admin status
        super_admin_response = supabase.from_('users').select('is_super_admin').eq('id', user_id).execute()
        if super_admin_response.data and super_admin_response.data[0]['is_super_admin']:
            has_permission = True
        elif comment.get('author_id') == user_id:
            # User is the author
            has_permission = True
        else:
            # Check specific permissions
            permission_response = supabase.from_('user_permissions')\
                .select('*')\
                .eq('user_id', user_id)\
                .eq('page', page)\
                .eq('permission', 'delete')\
                .execute()
            
            if permission_response.data:
                has_permission = True
        
        if not has_permission:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Save to history before deleting
        supabase.from_('comment_history').insert({
            'comment_id': comment_id,
            'previous_content': comment.get('content'),
            'modified_by': user_id,
            'action': 'delete'
        }).execute()
        
        # Delete comment from Supabase
        supabase.from_('comments').delete().eq('id', comment_id).execute()
        
        return Response({'message': 'Comment deleted successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_comment_history(request, comment_id):
    try:
        # Extract token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Authorization token required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        token = auth_header.split(' ')[1]
        
        # Verify token with Supabase
        supabase = get_supabase_client()
        user = supabase.auth.get_user(token)
        user_id = user.user.id
        
        # Check if user is super admin
        super_admin_response = supabase.from_('users').select('is_super_admin').eq('id', user_id).execute()
        if not super_admin_response.data or not super_admin_response.data[0]['is_super_admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Get comment history from Supabase
        response = supabase.from_('comment_history')\
            .select('*')\
            .eq('comment_id', comment_id)\
            .order('created_at')\
            .execute()
        
        # Include user details for each history entry
        history = response.data
        for entry in history:
            if entry.get('modified_by'):
                user_response = supabase.from_('users').select('email,full_name').eq('id', entry['modified_by']).execute()
                if user_response.data:
                    entry['modified_by_user'] = user_response.data[0]
        
        return Response(history)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
