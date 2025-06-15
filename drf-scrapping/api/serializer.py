from rest_framework import serializers
from .models import Novel, Chapter

class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ['id', 'novel', 'name', 'number', 'text', 'audio_url']

class NovelSerializer(serializers.ModelSerializer):
    chapters = ChapterSerializer(many=True, read_only=True)

    class Meta:
        model = Novel
        fields = ['id', 'name', 'chapter_count', 'status', 'chapters', 'image_url']
        read_only_fields = ['chapter_count'] 