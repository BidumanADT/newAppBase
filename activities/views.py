from django.shortcuts import render, redirect
from django.http import JsonResponse
import requests
from .models import UserFavorite
from django.views.decorators.csrf import csrf_exempt

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

@csrf_exempt
def add_favorite(request):
    """Add an activity to the user's favorites."""
    if request.method == "POST" and request.user.is_authenticated:
        try:
            activity_data = request.POST
            favorite = UserFavorite.objects.create(
                user=request.user,
                activity=activity_data['activity'],
                activity_type=activity_data['type'],
                participants=int(activity_data['participants']),
                price=float(activity_data['price']),
                link=activity_data.get('link', ''),
                accessibility=float(activity_data['accessibility'])
            )
            return JsonResponse({"message": "Activity added to favorites!"}, status=201)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=400)
    return JsonResponse({"error": "Unauthorized or invalid request."}, status=403)
