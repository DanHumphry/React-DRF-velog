from django.db import models


# Create your models here.

class Todo(models.Model):
    title = models.CharField(max_length=50)
    content = models.TextField()
    image = models.ImageField(upload_to='post_images', blank=True)
    date = models.DateTimeField(auto_now_add=True)
    like = models.IntegerField(default=0)
    username = models.CharField(max_length=200)
    language = models.CharField(max_length=200)
    profileImage = models.CharField(default='/media/red.jpg', max_length=500)
    user_pk = models.IntegerField(default=True)
    likedUser = models.TextField(blank=True)
    updateCount = models.IntegerField(default=0)

    def __str__(self):
        return self.title

class CommentTodo(models.Model):
    content = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    username = models.CharField(max_length=200)
    profileImage = models.CharField(default='/media/red.jpg', max_length=500)
    user_pk = models.IntegerField(default=True)
    todo_pk = models.IntegerField(default=True)
    updateCount = models.IntegerField(default=0)

    def __str__(self):
        return self.username

class ReCommentTodo(models.Model):
    content = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    username = models.CharField(max_length=200)
    profileImage = models.CharField(default='/media/red.jpg', max_length=500)
    user_pk = models.IntegerField(default=True)
    todo_pk = models.IntegerField(default=True)
    commentTodo_pk = models.IntegerField(default=True)
    updateCount = models.IntegerField(default=0)

    def __str__(self):
        return self.username