from django.urls import path
from . import views

urlpatterns = [
    path('', views.UserList.as_view()),
    path('current/', views.current_user),
    path("auth/profile/<int:user_pk>/", views.ProfileAPI.as_view()),
    path("auth/profile/<int:user_pk>/update/", views.ProfileUpdateAPI.as_view()),
    path("auth/profile/<int:id>/delete/", views.ProfileDelteAPI.as_view()),
]
