from django.urls import path
from rest_framework import routers
from api import views
from api.views import search_novel_views, scrap_novel_view, get_csrf_token

router = routers.DefaultRouter()

router.register(r'novels', views.NovelViewSet, basename='novels')

api_urls = [
    path('novels/<int:novel_id>/chapters/', views.ChapterViewSet.as_view({'get': 'list'})),
    path('novels/<int:novel_id>/chapters/<int:pk>/', views.ChapterViewSet.as_view({'get': 'retrieve'})),
    path('novels/<int:novel_id>/chapters/<int:chapter_id>/audio/', views.get_or_create_chapter),
    path('search-novels/', search_novel_views),
    path("scrap/", scrap_novel_view, name="scrap-novel"),
    path("csrf/", get_csrf_token, name="get-csrf")
]

urlpatterns = router.urls + api_urls