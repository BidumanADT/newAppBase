from django.db import models
from django.contrib.auth.models import User

# Could create a model here for caching activities locally if there is a specific need for it

# Model for storing user-specific favorite activities
class UserFavorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity = models.CharField(max_length=255)
    activity_type = models.CharField(max_length=50)
    participants = models.IntegerField()
    price = models.FloatField()
    link = models.URLField(blank=True, null=True)
    accessibility = models.FloatField()

    def __str__(self):
        return f"{self.user.username} - {self.activity}"
