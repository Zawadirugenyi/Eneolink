import React from 'react';
import { Box, Image, Text, Button, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function RoomCard({ number, roomType, image, hostelId, hostelName, isBooked }) {
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
          alt="room_image"
          borderRadius="md"
          mb={4}
          objectFit="cover"
          width="100%"
          height={{ base: "200px", md: "250px" }} // Responsive image height
        />
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          Room Number: {number}
        </Text>
        <Text mb={1}>Room Type: {roomType}</Text>
        <Text mb={4}>Hostel: {hostelName}</Text>
        <Flex justify="flex-end" mt="auto">
          <Button
            as={Link}
            to={`/room_detail/${encodeURIComponent(number)}/${encodeURIComponent(hostelName)}`}
            bg={isBooked ? "gray.300" : "white"}
            color={isBooked ? "gray.600" : "#0097b2"}
            border={isBooked ? "1px solid gray" : "1px solid #0097b2"}
            boxShadow="md"
            _hover={{ bg: isBooked ? "gray.300" : "#0097b2", color: isBooked ? "gray.600" : "white" }}
            textDecoration="none"
            isDisabled={isBooked}
          >
            {isBooked ? 'Booked' : 'Voir la Description'}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

export default RoomCard;
