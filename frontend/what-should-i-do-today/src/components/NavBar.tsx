import React from 'react';
import { Box, Flex, Link, Button, Stack } from '@chakra-ui/react';
import { NavLink as RouterLink } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <Box bgGradient="linear(to-t, green.500, gray.700)" px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box color="white" fontWeight="bold">What Should I Do Today?</Box>

        <Stack direction={'row'} spacing={4}>
          <Button as={RouterLink} to="/" variant="link" color="white">
            Home
          </Button>
          <Button as={RouterLink} to="/favorites" variant="link" color="white">
            Favorites
          </Button>
          <Button as={RouterLink} to="/login" variant="link" color="white">
            Login
          </Button>
          <Button as={RouterLink} to="/register" variant="link" color="white">
            Register
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
};

export default NavBar;
