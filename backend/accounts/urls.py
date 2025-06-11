from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('refresh/', views.refresh_token_view, name='refresh_token'),
    path('profile/', views.profile_view, name='profile'),
    path('profile/update/', views.update_profile_view, name='update_profile'),
    path('users/', views.UserListCreateView.as_view(), name='user_list_create'),
    path('permissions/', views.all_permissions_view, name='all_permissions'),
    path('permissions/user/<int:user_id>/', views.user_permissions_view, name='user_permissions'),
    path('permissions/update/<int:user_id>/', views.update_user_permissions, name='update_permissions'),
    path('password-reset/request/', views.password_reset_request, name='password_reset_request'),
    path('password-reset/verify/', views.password_reset_verify, name='password_reset_verify'),
]