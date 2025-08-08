import React from 'react';
import { Box, Image, Text, Button, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function HostelCard({ id, name, address, image }) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      bg="white"
      boxShadow="sm"
      _hover={{ boxShadow: "lg" }}
    >
      <Flex direction="column" height="100%">
        <Image
          src={image}
          alt={`${name}_image`}
          borderRadius="md"
          mb={4}
          objectFit="cover"
          width="100%"
          height={{ base: "200px", md: "250px" }} // Responsive image height
        />
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          {name}
        </Text>
        <Text mb={4}>{address}</Text>
        <Flex justify="flex-end" mt="auto">
          <Button
            as={Link}
            to={`/room/${encodeURIComponent(name)}`}
            bg="white"
            color="#0097b2"
            border="1px solid #0097b2"
            boxShadow="md"
            _hover={{ bg: "#0097b2", color: "white" }}
            textDecoration="none"
          >
            Voir Les Maisons
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

export default HostelCard;
