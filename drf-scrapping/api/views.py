import os
import subprocess
from django.conf import settings
import logging
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializer import NovelSerializer, ChapterSerializer
from .models import Novel, Chapter, Favorite
from scrap.main import search_novel, process_novel
from scrap.scrap_chapters_list import scrap_novel
from django.views.decorators.csrf import csrf_exempt

python_path = os.path.join(settings.BASE_DIR, "venv", "Scripts", "python.exe")
script_path = r"D:/PRUEBAS/drf-scrapping/scrap/main.py"

# Configuración del Logging
logging.basicConfig(
    handlers=[logging.StreamHandler()],
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

class NovelViewSet(viewsets.ModelViewSet):
    queryset = Novel.objects.all()
    serializer_class = NovelSerializer

class ChapterViewSet(viewsets.ModelViewSet):
    serializer_class = ChapterSerializer
    def get_queryset(self):
        novel_id = self.kwargs.get('novel_id')
        return Chapter.objects.filter(novel_id=novel_id).order_by('id')


@api_view(['GET'])
def search_novel_views(request):
    query = request.GET.get("q")
    if not query:
        return Response({"error": "Error en el parametro de busqueda"}, status=400)
    results = search_novel(query)
    return Response(results)


@csrf_exempt
def scrap_novel_view(request):
    if request.method == 'POST':
        import json
        data = json.loads(request.body)
        url = data.get('url')
        if not url:
            return JsonResponse({"error": "URL no proporcionada"}, status=400)
        try:
            result = scrap_novel(url)
            return JsonResponse(result)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Método no permitido"}, status=405)


@api_view(['GET'])
def get_or_create_chapter(request, novel_id, chapter_id):
    # Buscar el capítulo correspondiente
    chapter = get_object_or_404(Chapter, pk=chapter_id, novel_id=novel_id)

    # Si ya tiene audio, simplemente devolvémoslo
    if chapter.audio_url:
        serializer = ChapterSerializer(chapter)
        return Response(serializer.data)

    # Si no tiene audio_url, generarlo usando main.py
    if not chapter.chapter_url:
        return Response({"error": "Capítulo sin URL para procesar."}, status=400)

    try:
        # Ruta al script Python (relativa a BASE_DIR)
        script_path = os.path.join(settings.BASE_DIR, "scrap", "main.py")

        # Ejecutar el script de forma sincrónica
        result = subprocess.run(
            [python_path, script_path, chapter.chapter_url],
            check=True,
            capture_output=True,
            text=True
        )
        print("✅ Audio generado")
        print("STDOUT:", result.stdout)
        print("STDERR:", result.stderr)

        # Recargar capítulo para ver si se actualizó el audio_url
        chapter.refresh_from_db()

    except subprocess.CalledProcessError as e:
        print("❌ Error ejecutando main.py:", e)
        print("STDOUT:", e.stdout)
        print("STDERR:", e.stderr)
        return Response({"error": "Error generando el audio."}, status=500)

    serializer = ChapterSerializer(chapter)
    return Response(serializer.data)


    

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'detail': 'CSRF cookie set'})


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def user_favorites(request):
#     novels = Novel.objects.filter(favorited_by__user=request.user)
#     serializer = NovelSerializer(novels, many=True)
#     return Response(serializer.data)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def toggle_favorite(request, novel_id):
#     novel = get_object_or_404(Novel, id=novel_id)
#     favorite, created = Favorite.objects.get_or_create(user=request.user, novel=novel)
#     if not created:
#         favorite.delete()
#         return Response({'favorito': False})    
#     return Response({'favorito': True})