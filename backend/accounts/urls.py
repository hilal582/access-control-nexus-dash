
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('refresh/', views.refresh_token_view, name='refresh_token'),
    path('users/', views.UserListCreateView.as_view(), name='user_list_create'),
    path('permissions/user/<int:user_id>/', views.user_permissions_view, name='user_permissions'),
    path('permissions/update/<int:user_id>/', views.update_user_permissions, name='update_permissions'),
]
