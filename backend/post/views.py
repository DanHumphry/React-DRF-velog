from .serializers import TodoSerializer, CommentTodoSerializer, ReCommentTodoSerializer
from .models import Todo, CommentTodo, ReCommentTodo
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status, generics
# Create your views here.


class TodoView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    authentication_classes = []   #이거 두줄은 권한이 없는 상태에서 데이테 요청을 가능하게
    permission_classes = []       #만듬 settings.py에서도 아마 가능할 것 같음.

    def get(self, request, *args, **kwargs):
        Todos = Todo.objects.all()
        serializer = TodoSerializer(Todos, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        Todos_serializer = TodoSerializer(data=request.data)
        if Todos_serializer.is_valid():
            Todos_serializer.save()
            return Response(Todos_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', Todos_serializer.errors)
            return Response(Todos_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TodoReadAPI(generics.RetrieveAPIView):
    parser_classes = (MultiPartParser, FormParser)

    authentication_classes = []
    permission_classes = []       

    lookup_field = "id"
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

class TodoUpdateAPI(generics.UpdateAPIView):
    lookup_field = "id"
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

class TodoDelAPI(generics.DestroyAPIView):
    lookup_field = "id"
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer



class CommentTodoView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    authentication_classes = []   #이거 두줄은 권한이 없는 상태에서 데이테 요청을 가능하게
    permission_classes = []       #만듬 settings.py에서도 아마 가능할 것 같음.

    def get(self, request, *args, **kwargs):
        CommentTodos = CommentTodo.objects.all()
        serializer = CommentTodoSerializer(CommentTodos, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        CommentTodos_serializer = CommentTodoSerializer(data=request.data)
        if CommentTodos_serializer.is_valid():
            CommentTodos_serializer.save()
            return Response(CommentTodos_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', CommentTodos_serializer.errors)
            return Response(CommentTodos_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommentUpdateAPI(generics.UpdateAPIView):
    lookup_field = "id"
    queryset = CommentTodo.objects.all()
    serializer_class = CommentTodoSerializer

class CommentDelAPI(generics.DestroyAPIView):
    lookup_field = "id"
    queryset = CommentTodo.objects.all()
    serializer_class = CommentTodoSerializer



class ReCommentTodoView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    authentication_classes = []   #이거 두줄은 권한이 없는 상태에서 데이테 요청을 가능하게
    permission_classes = []       #만듬 settings.py에서도 아마 가능할 것 같음.

    def get(self, request, *args, **kwargs):
        ReCommentTodos = ReCommentTodo.objects.all()
        serializer = ReCommentTodoSerializer(ReCommentTodos, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        ReCommentTodos_serializer = ReCommentTodoSerializer(data=request.data)
        if ReCommentTodos_serializer.is_valid():
            ReCommentTodos_serializer.save()
            return Response(ReCommentTodos_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', ReCommentTodos_serializer.errors)
            return Response(ReCommentTodos_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReCommentUpdateAPI(generics.UpdateAPIView):
    lookup_field = "id"
    queryset = ReCommentTodo.objects.all()
    serializer_class = ReCommentTodoSerializer

class ReCommentDelAPI(generics.DestroyAPIView):
    lookup_field = "id"
    queryset = ReCommentTodo.objects.all()
    serializer_class = ReCommentTodoSerializer




class TodoLikeViewSet(APIView):
    parser_classes = (MultiPartParser, FormParser)

    authentication_classes = []   #이거 두줄은 권한이 없는 상태에서 데이테 요청을 가능하게
    permission_classes = []       #만듬 settings.py에서도 아마 가능할 것 같음.

    def get(self, request, *args, **kwargs):
        Todos = Todo.objects.all().order_by('like')
        serializer = TodoSerializer(Todos, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        Todos_serializer = TodoSerializer(data=request.data)
        if Todos_serializer.is_valid():
            Todos_serializer.save()
            return Response(Todos_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', Todos_serializer.errors)
            return Response(Todos_serializer.errors, status=status.HTTP_400_BAD_REQUEST)