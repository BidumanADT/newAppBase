import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Button, VStack, Spinner } from "@chakra-ui/react";
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
    <VStack spacing={6} p={6}>
      <Heading as="h1" size="xl" color="green.600">
        What Should I Do Today?
      </Heading>
      {error && <Text color="red.500">{error}</Text>}
      {successMessage && <Text color="green.500">{successMessage}</Text>}
      {activity ? (
        <Box borderWidth="1px" borderRadius="lg" p={4} w="100%" maxW="md">
          <Heading as="h2" size="md" mb={2}>
            {activity.activity}
          </Heading>
          <Text>Type: {activity.type}</Text>
          <Text>Participants: {activity.participants}</Text>
          <Text>Price: {activity.price}</Text>
          <Button mt={4} colorScheme="green" onClick={handleSaveFavorite}>
            Save to Favorites
          </Button>
        </Box>
      ) : (
        <Spinner size="xl" />
      )}
    </VStack>
  );
};

export default HomePage;