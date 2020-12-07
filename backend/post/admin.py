from django.contrib import admin
from .models import Todo, CommentTodo, ReCommentTodo

# Register your models here.

admin.site.register(Todo)
admin.site.register(CommentTodo)
admin.site.register(ReCommentTodo)