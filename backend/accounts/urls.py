from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns=[
    path('', views.home, name='home'),
    path('profile/', views.profile, name='profile'),
    path('profile/edit/', views.edit_profile, name='edit_profile'),
    path('signup/', views.signup, name='signup'),
    path('signup/success/', views.signup_success, name='signup_success'),
    path('signup/failure/', views.signup_failure, name='signup_failure'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('logout/success/', views.logout_success, name='logout_success'),
    path('password_change/', auth_views.PasswordChangeView.as_view(
        template_name='accounts/password_change.html'
    ), name='password_change'),

    path('password_change/done/', auth_views.PasswordChangeDoneView.as_view(
        template_name='accounts/password_change_done.html'
    ), name='password_change_done'),
]