from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm
from .forms import CustomUserCreationForm, EditProfileForm, EditProfileBioForm
from .models import Profile

#Home View
def home(request):
    return render(request, 'home.html')

#Signup View Using Custom Form:
def signup(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('signup_success')
        else:
            # pass errors along to the failure page
            return render(request, 'accounts/signup_failure.html', {'form': form})
    else:
        form = CustomUserCreationForm()
    return render(request, 'accounts/signup.html', {'form': form})

def signup_success(request):
    return render(request, 'accounts/signup_success.html')

def signup_failure(request):
    return render(request, 'accounts/signup_failure.html')

#Login View:
def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('profile')
    else:
        form = AuthenticationForm()
    return render(request, 'accounts/login.html', {'form': form})

@login_required
def profile(request):
    # Check if the user is in specific groups
    is_admin= request.user.groups.filter(name='Admin').exists()    
    is_moderator= request.user.groups.filter(name='Moderator').exists()
    is_user= request.user.groups.filter(name='User').exists()
    is_guest= request.user.groups.filter(name='Guest').exists()
    
    context = {
        'is_admin': is_admin,    
        'is_moderator': is_moderator,
        'is_user': is_user,
        'is_guest': is_guest,
    }
        
    return render(request, 'accounts/profile.html', context)

# Edit Profile Views
@login_required
def edit_profile(request):
    if request.method == 'POST':
        user_form = EditProfileForm(request.POST, instance=request.user)
        profile_form = EditProfileBioForm(request.POST, instance=request.user.profile)
        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            # Ensure the bio field is not NULL
            profile = profile_form.save(commit=False)
            if profile.bio is None:
                profile.bio = ""
            profile.save()
            return redirect('profile')
    else:
        user_form = EditProfileForm(instance=request.user)
        profile_form = EditProfileBioForm(instance=request.user.profile)

    context = {
        'user_form': user_form,
        'profile_form': profile_form,
    }
    return render(request, 'accounts/edit_profile.html', context)
            
#Logout View:
def logout_view(request):
    logout(request)
    return redirect('logout_success')

def logout_success(request):
    return render(request, 'accounts/logout_success.html')
