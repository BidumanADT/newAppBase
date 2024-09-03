from django.shortcuts import render, redirect
from django.http import JsonResponse
import requests
from .models import UserFavorite
from django.views.decorators.csrf import csrf_exempt
import json

def fetch_activity(request):
    """Fetch a random activity or a filtered activity from the BoredAPI clone."""
    type_param = request.GET.get('type')
    participants_param = request.GET.get('participants')
    price_param = request.GET.get('price')

    url = "https://bored.api.lewagon.com/api/activity/"
    params = {
        "type": type_param,
        "participants": participants_param,
        "price": price_param
    }

    response = requests.get(url, params=params)
    if response.status_code == 200:
        return JsonResponse(response.json())
    else:
        return JsonResponse({"error": "Failed to fetch activity from BoredAPI."}, status=500)

######################## FAVORITES ###########################
@csrf_exempt
def add_favorite(request):
    """Add an activity to the user's favorites."""
    if request.method == "POST" and request.user.is_authenticated:
        try:
            # Load JSON data from the request body
            activity_data = json.loads(request.body.decode('utf-8'))
            print("Received data:", activity_data)  # Debug print

            # Ensure all required fields are present
            required_fields = ['activity', 'type', 'participants', 'price', 'accessibility']
            for field in required_fields:
                if field not in activity_data:
                    print(f"Missing field: {field}")  # Debug print for missing fields
                    return JsonResponse({"error": f"Missing field: {field}"}, status=400)

            # Create the favorite entry in the database
            favorite = UserFavorite.objects.create(
                user=request.user,
                activity=activity_data['activity'],
                activity_type=activity_data['type'],
                participants=int(activity_data['participants']),
                price=float(activity_data['price']),
                link=activity_data.get('link', ''),
                accessibility=float(activity_data['accessibility'])
            )
            return JsonResponse({"message": "Activity saved to favorites!"}, status=201)

        except json.JSONDecodeError:
            print("Error: Failed to decode JSON")  # Specific JSON error
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            print(f"Error occurred: {str(e)}")  # Debug print for other exceptions
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=400)

    print("Unauthorized or invalid request.")
    return JsonResponse({"error": "Unauthorized or invalid request."}, status=403)

# save a favorite
@csrf_exempt
def fetch_favorites(request):
    """Fetch the user's saved favorite activities."""
    if request.method == "GET" and request.user.is_authenticated:
        favorites = UserFavorite.objects.filter(user=request.user)
        favorites_list = [
            {
                'id': favorite.id,
                'activity': favorite.activity,
                'type': favorite.activity_type,
                'participants': favorite.participants,
                'price': favorite.price,
                'accessibility': favorite.accessibility,
                'link': favorite.link,
            } 
            for favorite in favorites
        ]
        return JsonResponse({'favorites': favorites_list}, status=200)
    
    return JsonResponse({"error": "Unauthorized or invalid request."}, status=403)

# remove a favorite
@csrf_exempt
def remove_favorite(request, favorite_id):
    """Remove a favorite activity for the authenticated user."""
    if request.method == "DELETE" and request.user.is_authenticated:
        try:
            favorite = UserFavorite.objects.get(id=favorite_id, user=request.user)
            favorite.delete()
            return JsonResponse({"message": "Favorite removed successfully."}, status=200)
        except UserFavorite.DoesNotExist:
            return JsonResponse({"error": "Favorite not found."}, status=404)
        
    return JsonResponse({"error": "Unauthorized or invalid  request."}, status=403)
