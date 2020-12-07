from django.urls import path
from . import views

urlpatterns = [
    path('Todos/', views.TodoView.as_view(), name= 'Todos_list'),
    path('Todos/like/', views.TodoLikeViewSet.as_view()),
    path('Todos/<int:id>/', views.TodoReadAPI.as_view()),
    path('Todos/<int:id>/update/', views.TodoUpdateAPI.as_view()),
    path('Todos/<int:id>/delete/', views.TodoDelAPI.as_view()),
    path('CommentTodos/', views.CommentTodoView.as_view(), name= 'CommentTodo_list'),
    path('CommentTodos/<int:id>/update/', views.CommentUpdateAPI.as_view()),
    path('CommentTodos/<int:id>/delete/', views.CommentDelAPI.as_view()),
    path('ReCommentTodos/', views.ReCommentTodoView.as_view(), name= 'ReCommentTodo_list'),
    path('ReCommentTodos/<int:id>/update/', views.ReCommentUpdateAPI.as_view()),
    path('ReCommentTodos/<int:id>/delete/', views.ReCommentDelAPI.as_view()),
]