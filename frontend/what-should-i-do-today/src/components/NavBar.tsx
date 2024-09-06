import React from 'react';
import { Box, Flex, Button, Stack } from '@chakra-ui/react';

const NavBar: React.FC = () => {

  return (
    <Box bgGradient="linear(to-t, green.500, gray.700)" px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box color="white" fontWeight="bold">What Should I Do Today?</Box>

        <Stack direction={'row'} spacing={4}>
          <Button as="a" href="http://localhost:8000/" variant="link" color="white">
            Home
          </Button>
          <Button as="a" href="http://localhost:8000/favorites" variant="link" color="white">
            Favorites
          </Button>
          <Button as="a" href="http://localhost:8000/accounts/login" variant="link" color="white">
            Login
          </Button>
          <Button as="a" href="http://localhost:8000/accounts/signup" variant="link" color="white">
            Register
          </Button>
          <Button as="a" href="http://localhost:8000/accounts/profile" variant="link" color="white">
            Profile
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
};

export default NavBar;
