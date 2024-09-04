import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Button, VStack, Stack } from "@chakra-ui/react";
import { fetchFavorites, removeFavoriteActivity } from "../services/activityService";

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

    // function to remove saved favorite from list
    const handleRemoveFavorite = async (favoriteId: number) => {
        try {
            await removeFavoriteActivity(favoriteId);
            setFavorites(favorites.filter(favorite => favorite.id !== favoriteId));
        } catch (error) {
            setError('Failed to remove favorite. Please try again.');
        }
    };

    return (
        <VStack spacing={6} p={6}>
            <Heading as="h1" size="xl" color="green.600">
                Your Favorite Activities
            </Heading>
            {error && <Text color="red.500">{error}</Text>}
            {favorites.length > 0 ? (
                <Stack spacing={4} w="100%" maxW="md">
                    {favorites.map((favorite, index) => (
                        <Box key={index} borderWidth="1px" borderRadius="lg" p={4}>
                            <Heading as="h3" size="md" mb={2}>
                                {favorite.activity}
                            </Heading>
                            <Text>Type: {favorite.type}</Text>
                            <Text>Participants: {favorite.participants}</Text>
                            <Text>Price: {favorite.price}</Text>
                            <Button mt={4} colorScheme="red" onClick={() => handleRemoveFavorite(favorite.id)}>
                                Remove
                            </Button>
                        </Box>
                    ))}
                </Stack>
            ) : (
                <Text>No favorites saved yet.</Text>
            )}
        </VStack>
    );
};

export default FavoritesPage;