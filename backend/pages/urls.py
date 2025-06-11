from django.urls import path
from . import views

urlpatterns = [
    path('available/', views.available_pages, name='available_pages'),
    path('<str:page>/comments/', views.CommentListCreateView.as_view(), name='comment_list_create'),
    path('comments/<int:pk>/', views.CommentDetailView.as_view(), name='comment_detail'),
    path('comments/<int:comment_id>/history/', views.comment_history_view, name='comment_history'),
    path('<str:page>/permissions/', views.user_page_permissions, name='user_page_permissions'),
]