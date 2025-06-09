from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializer import NovelSerializer, ChapterSerializer
from .models import Novel, Chapter, Favorite
from scrap.main import search_novel

class NovelViewSet(viewsets.ModelViewSet):
    queryset = Novel.objects.all()
    serializer_class = NovelSerializer

class ChapterViewSet(viewsets.ModelViewSet):
    serializer_class = ChapterSerializer
    def get_queryset(self):
        novel_id = self.kwargs.get('novel_id')
        return Chapter.objects.filter(novel_id=novel_id)


@api_view(['GET'])
def search_novel_views(request):
    query = request.GET.get("q")
    if not query:
        return Response({"error": "Error en el parametro de busqueda"}, status=400)
    results = search_novel(query)
    return Response(results)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_favorites(request):
    novels = Novel.objects.filter(favorited_by__user=request.user)
    serializer = NovelSerializer(novels, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_favorite(request, novel_id):
    novel = get_object_or_404(Novel, id=novel_id)
    favorite, created = Favorite.objects.get_or_create(user=request.user, novel=novel)
    if not created:
        favorite.delete()
        return Response({'favorito': False})    
    return Response({'favorito': True})
