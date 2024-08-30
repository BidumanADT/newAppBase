import React, { useState, useEffect } from "react";
import { fetchRandomActivity, addFavoriteActivity } from "../services/activityService";

const HomePage: React.FC = () => {
  const [activity, setActivity] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // fire a useEffect to fetch a random activy upon loading homepage
  useEffect(() => {
    const getActivity = async () => {
      try {
        const activityData = await fetchRandomActivity();
        setActivity(activityData);
      } catch (error) {
        setError('Failed to fetch activity. Please try again.');
      }
    };

    getActivity();
  }, []);

  // handling save to favorites
  const handleSaveFavorite = async () => {
    if (!activity) return;

    try {
      await addFavoriteActivity({
        activity: activity.activity,
        type: activity.type,
        participants: activity.participants,
        price: activity.price,
        accessibility: activity.accessibility,
      });
      
      setSuccessMessage('Activity saved to favorites!');
      // clear message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

    } catch (err) {
      setError('Failed to save activity. Please try again.');
    }
  };

  return (
    <div>
      <h1>What Should I Do Today?</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {activity ? (
        <div>
          <h2>{activity.activity}</h2>
          <p>Type: {activity.type}</p>
          <p>Participants: {activity.participants}</p>
          <p>Price: {activity.price}</p>
          <button onClick={handleSaveFavorite}>Save to Favorites</button>
        </div>
      ) : (
        <p>Loading activity...</p>
      )}
    </div>
  );
};

export default HomePage;