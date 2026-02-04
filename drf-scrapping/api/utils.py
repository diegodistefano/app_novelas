# api/utils.py
from api.models import Chapter
from scrap.main import process_novel
from api.serializer import ChapterSerializer
import asyncio

def process_chapter_by_id(chapter_id):
    try:
        chapter = Chapter.objects.get(id=chapter_id)

        print(f"chapter.text == '{chapter.text}'")
        print(f"chapter.audio_url == '{chapter.audio_url}'")

        if not chapter.text or not chapter.audio_url:
            print("Falta contenido, procesando novela:", chapter.chapter_url)
            asyncio.run(process_novel(chapter.chapter_url))
            chapter.refresh_from_db()

        serializer = ChapterSerializer(chapter)
        return serializer.data

    except Chapter.DoesNotExist:
        print("Capítulo no encontrado.")
        return None
