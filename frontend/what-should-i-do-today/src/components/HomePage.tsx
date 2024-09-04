import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Button, VStack, Spinner, Stack } from "@chakra-ui/react";
import { fetchRandomActivity, addFavoriteActivity } from "../services/activityService";

const HomePage: React.FC = () => {
  const [activity, setActivity] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to fetch a random activity
  const getActivity = async () => {
    setLoading(true);
    try {
      const activityData = await fetchRandomActivity();
      setActivity(activityData);
      setError(null); // Clear error message on successful fetch
    } catch (error) {
      setError('Failed to fetch activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch an activity on initial render
  useEffect(() => {
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
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Box borderWidth="1px" borderRadius="lg" p={4} w="100%" maxW="md">
          <Heading as="h2" size="md" mb={2}>
            {activity.activity}
          </Heading>
          <Text>Type: {activity.type}</Text>
          <Text>Participants: {activity.participants}</Text>
          <Text>Price: {activity.price}</Text>
          <Stack direction="row" spacing={4} mt={4} justifyContent="center" alignItems="center">
            <Button colorScheme="green" onClick={handleSaveFavorite}>
              Save to Favorites
            </Button>
            <Button colorScheme="blue" variant="outline" onClick={getActivity}>
              Random Activity
            </Button>
          </Stack>
        </Box>
      )}
    </VStack>
  );
};

export default HomePage;