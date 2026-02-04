# Importaciones estándar de Python
import sys  # para saber qué ejecutable de Python estoy usando.
import os  # para construir rutas de archivos (cross-platform).
import subprocess  # para ejecutar scripts externos.
# para registrar eventos y errores en logs (tengo q ver de modularizarlo).
import logging

# Importaciones de Django
# para obtener rutas del proyecto (BASE_DIR, etc.)
from django.conf import settings
# para crear endpoints CRUD automáticos (list/retrieve/create/...). Es de DRF
from rest_framework import viewsets
# para obtener objetos o devolver 404 si no existen.
from django.shortcuts import get_object_or_404
# para devolver respuestas JSON en vistas (sin DRF).
from django.http import JsonResponse
# fuerza a que Django coloque la cookie CSRF en la respuesta.
from django.views.decorators.csrf import ensure_csrf_cookie
# convertir una función en endpoint DRF y limitar métodos (GET/POST).
from rest_framework.decorators import api_view
# para devolver respuestas en vistas de DRF.
from rest_framework.response import Response

# Importaciones deñ proyecto
# serializadores para convertir modelos a JSON y viceversa.
from .serializer import NovelSerializer, ChapterSerializer
from .models import Novel, Chapter  # modelos de la base de datos de Django.
from scrap.main import search_novel  # funciones de scrapping.
# función para scrapear una novela completa.
from scrap.scrap_chapters_list import scrap_novel
# desactiva CSRF en una vista (en scrap_novel_view). (usar con precaución).
from django.views.decorators.csrf import csrf_exempt

# ruta del ejecutable de Python actual para q no me ejecute otra.
python_path = sys.executable

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
def get_or_create_chapter(request, novel_id, chapter_id):
    chapter = get_object_or_404(Chapter, pk=chapter_id, novel_id=novel_id)

    if chapter.audio_url:
        serializer = ChapterSerializer(chapter)
        return Response(serializer.data)
    if not chapter.chapter_url:
        return Response({"error": "Capítulo sin URL para procesar."}, status=400)

    try:
        script_path = os.path.join(settings.BASE_DIR, "scrap", "main.py")
        result = subprocess.run(
            [python_path, script_path, chapter.chapter_url],
            check=True,
            capture_output=True,
            text=True
        )
        logger.info("✅ Audio generado")
        logger.info(f"STDERR: {result.stderr}")
        logger.info(f"STDOUT: {result.stdout}")
        chapter.refresh_from_db()

    except subprocess.CalledProcessError as e:
        logger.info("❌ Error ejecutando main.py:", e)
        logger.info(f"STDOUT: {e.stdout}")
        logger.info(f"STDERR: {e.stderr}")
        return Response({"error": "Error generando el audio."}, status=500)

    serializer = ChapterSerializer(chapter)
    return Response(serializer.data)


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


@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'detail': 'CSRF cookie set'})
