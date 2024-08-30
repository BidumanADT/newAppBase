import React, { useState, useEffect } from "react";
import { fetchRandomActivity } from "../services/activityService";

const HomePage: React.FC = () => {
    const [activity, setActivity] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <div>
      <h1>What Should I Do Today?</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {activity ? (
        <div>
          <h2>{activity.activity}</h2>
          <p>Type: {activity.type}</p>
          <p>Participants: {activity.participants}</p>
          <p>Price: {activity.price}</p>
        </div>
      ) : (
        <p>Loading activity...</p>
      )}
    </div>
    );
};

export default HomePage;