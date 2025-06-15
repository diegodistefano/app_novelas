
from django.contrib.auth.models import User
from django.db import models


class Author(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Gender(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Novel(models.Model):
    NOVEL_STATUS_CHOICES = [
        ('ongoing', 'Ongoing'),
        ('paused', 'Paused'),
        ('finished', 'Finished'),
    ]

    name = models.CharField(max_length=200)
    chapter_count = models.IntegerField(default=0)
    status = models.CharField(max_length=10, choices=NOVEL_STATUS_CHOICES)
    authors = models.ManyToManyField(Author, related_name='novels')
    genders = models.ManyToManyField(Gender, related_name='novels')
    novel_url = models.URLField(unique=True, default='')
    novel_downloaded = models.BooleanField(default=False)
    image_url = models.URLField(
    default="https://storage.googleapis.com/audionovelas-bucket/generic_novel.jpg")

    def __str__(self):
        return self.name


class Chapter(models.Model):
    novel = models.ForeignKey(Novel, related_name='chapters', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    number = models.IntegerField()
    chapter_url = models.URLField(blank=True, default='')
    text = models.TextField()
    audio_url = models.URLField(blank=True, null=True)
    chapter_downloaded = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.novel.name} - Chapter {self.number}: {self.name}"


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    novel = models.ForeignKey('Novel', on_delete=models.CASCADE, related_name='favorited_by')

    class Meta:
        unique_together = ('user', 'novel') 

    def __str__(self):
        return f"{self.user.username} ♥ {self.novel.name}"
