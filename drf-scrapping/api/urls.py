from django.urls import path, include
from rest_framework import routers
from api import views

router = routers.DefaultRouter()

router.register(r'novels', views.NovelViewSet, basename='novels')
novel_chapters = [
    path('novels/<int:novel_id>/chapters/', views.ChapterViewSet.as_view({'get': 'list'})),
    path('novels/<int:novel_id>/chapters/<int:pk>/', views.ChapterViewSet.as_view({'get': 'retrieve'})),
    path('novels/<int:novel_id>/chapters/<int:chapter_id>/audio/', views.get_or_create_chapter),
]

urlpatterns = router.urls + novel_chapters
