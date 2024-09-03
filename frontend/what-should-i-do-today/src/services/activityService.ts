import axios from "axios";

// create axios instance
const apiClient = axios.create({
    baseURL: 'http://localhost:8000', // match to actual backend base url
    withCredentials: true, // sends cookies with requests
});

// fetch a random activity
export const fetchRandomActivity = async (type?: string, participants?: number, price?: number) => {
    try {
        const response = await apiClient.get('/activities/fetch/', {
            params: {type, participants, price },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching activity: ', error);
        throw error;
    }
};

// add a favorite activity
export const addFavoriteActivity = async (activityData: any) => {
    try {
      const response = await apiClient.post('/activities/add-favorite/', {
        activity: activityData.activity,
        type: activityData.type,
        participants: activityData.participants,
        price: activityData.price,
        accessibility: activityData.accessibility,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding favorite activity:', error);
      throw error;
    }
  };

  // fetch user's favorites
  export const fetchFavorites = async () => {
    try {
      const response = await apiClient.get('/activities/fetch-favorites/');
      return response.data.favorites;
    } catch (error) {
      console.error('Error fetching favorites: ', error);
      throw error;
    }
  };

  // remove a saved favorite
  export const removeFavoriteActivity = async (favoriteId: number) => {
    try {
      const response = await apiClient.delete(`/activities/remove-favorite/${favoriteId}/`);
      return response.data;
    } catch (error) {
      console.error('Error removing favorite activity: ', error);
      throw error;
    }
  };