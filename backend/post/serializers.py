from rest_framework import serializers
from .models import Todo, CommentTodo, ReCommentTodo

class TodoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Todo
        fields = '__all__'

class CommentTodoSerializer(serializers.ModelSerializer):

    class Meta:
        model = CommentTodo
        fields = '__all__'

class ReCommentTodoSerializer(serializers.ModelSerializer):

    class Meta:
        model = ReCommentTodo
        fields = '__all__'