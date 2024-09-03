from django.urls import path
from . import views

urlpatterns = [
    path('fetch/', views.fetch_activity, name='fetch_activity'),
    path('add-favorite/', views.add_favorite, name='add_favorite'),
    path('fetch-favorites/', views.fetch_favorites, name='fetch_favorites'),
    path('remove-favorite/<int:favorite_id>/', views.remove_favorite, name='remove_favorite'),
]