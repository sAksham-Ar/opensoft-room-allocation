from django.urls import path
from rooms import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
urlpatterns = [
    path('rooms/', views.RoomList.as_view()),
    path('users/<str:rollNo>/', views.UserDetail.as_view()),
    path('login/', views.Login.as_view()),
    path('register/', views.Register.as_view()),
    path('book/', views.Book.as_view()),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]