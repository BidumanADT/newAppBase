import React, { useState, useEffect } from "react";
import { fetchFavorites } from "../services/activityService";

const FavoritesPage: React.FC = () => {
    const [favorites, setFavorites] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getFavorites = async () => {
            try {
                const favoriteData = await fetchFavorites();
                setFavorites(favoriteData);
            } catch (error) {
                setError('Failed to fetch favorites. Please try again.');
            }
        };

        getFavorites();
    }, []);

    return (
        <div>
            <h1>Your Favorite Activities</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {favorites.length > 0 ? (
                <ul>
                    {favorites.map((favorite, index) => (
                        <li key={index}>
                            <h3>{favorite.activity}</h3>
                            <p>Type: {favorite.type}</p>
                            <p>Participants: {favorite.participants}</p>
                            <p>Price: {favorite.price}</p>
                            <p>Accessibility: {favorite.accessibility}</p>
                            {favorite.link && <a href={favorite.link} target="_blank" rel="noopener noreferrer">More Info</a>}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No favorites saved yet.</p>
            )}
        </div>
    );
};

export default FavoritesPage;