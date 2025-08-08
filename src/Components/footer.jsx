import React from 'react';
import { Flex, Box, Text, Link as ChakraLink } from '@chakra-ui/react';

function Footer() {
  return (
    <Flex
      as="footer"
      align="center"
      justify="space-between"
      wrap="wrap"
      bg="#073d47"
      color="white"
      p={4}
      position="fixed"
      bottom="0"
      width="100%"
    >
      <Box>
        <Text>© 2025 EneoLink </Text>
      </Box>
      <Box>
         <ChakraLink href="#" mr={4}>
          zawadirugenyi@gmail.com
        </ChakraLink>
        <ChakraLink href="#" mr={4}>
          Privacy Policy
        </ChakraLink>
        <ChakraLink href="#" mr={4}>
          Terms of Service
        </ChakraLink>
        <ChakraLink href="#">
          Contact Us
        </ChakraLink>
      </Box>
    </Flex>
  );
}

export default Footer;
