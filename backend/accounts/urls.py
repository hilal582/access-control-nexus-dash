
from django.urls import path
from . import views
from . import comment_views

urlpatterns = [
    # Authentication
    path('login/', views.login_view, name='login'),
    path('refresh/', views.refresh_token_view, name='refresh_token'),
    
    # User management
    path('users/', views.UserListCreateView.as_view(), name='user_list_create'),
    path('permissions/user/<int:user_id>/', views.user_permissions_view, name='user_permissions'),
    path('permissions/update/<int:user_id>/', views.update_user_permissions, name='update_permissions'),
    
    # Comment management
    path('comments/<str:page>/', comment_views.get_comments, name='get_comments'),
    path('comments/<str:page>/add/', comment_views.add_comment, name='add_comment'),
    path('comments/<int:comment_id>/update/', comment_views.update_comment, name='update_comment'),
    path('comments/<int:comment_id>/delete/', comment_views.delete_comment, name='delete_comment'),
    path('comments/<int:comment_id>/history/', comment_views.get_comment_history, name='get_comment_history'),
]
