import os
import django
import asyncio

# Configurar Django para usar el settings correcto
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'drf.settings')
django.setup()

from api.utils import process_chapter_by_id  # importa tu función

if __name__ == "__main__":
    chapter_id = 764  # Cambiá este ID según tu base
    data = process_chapter_by_id(chapter_id)
    if data:
        print("✅ Resultado final:")
        print(data)
    else:
        print("❌ No se encontró el capítulo.")