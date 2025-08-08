import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Image,
  Button,
  Center,
  Stack,
} from '@chakra-ui/react';

const RoomDetail = ({ roomDescription }) => {
  const {
    room,
    sitting_room_image,
    bedroom_image,
    kitchen_image,
    bathroom_image,
    description,
    price,
  } = roomDescription;

  return (
    <Box p={6} bg="gray.100" boxShadow="lg" borderRadius="md">
      <Stack
        direction={{ base: 'column', md: 'row' }}
        spacing={6}
        align="center"
      >
        <VStack
          spacing={4}
          align="stretch"
          width={{ base: '100%', md: '50%' }}
        >
          <Image
            src={sitting_room_image}
            alt={`Sitting room of ${room.number}`}
            objectFit="cover"
            borderRadius="md"
            width="100%"
            maxH="300px"
          />
          <Image
            src={bedroom_image}
            alt={`Bedroom of ${room.number}`}
            objectFit="cover"
            borderRadius="md"
            width="100%"
            maxH="300px"
          />
          <Image
            src={kitchen_image}
            alt={`Kitchen of ${room.number}`}
            objectFit="cover"
            borderRadius="md"
            width="100%"
            maxH="300px"
          />
          <Image
            src={bathroom_image}
            alt={`Bathroom of ${room.number}`}
            objectFit="cover"
            borderRadius="md"
            width="100%"
            maxH="300px"
          />
        </VStack>

        <VStack
          spacing={4}
          align="start"
          width={{ base: '100%', md: '50%' }}
        >
          <Heading mb={4}>{room.number}</Heading>
          <Text mb={2}>Room Type: {room.room_type}</Text>
          <Text mb={2}>Hostel: {room.hostel.name}</Text>
          <Text mb={2}>Price: ${price} per night</Text>
          <Text mb={4}>Description: {description}</Text>
          <Center>
            <Button colorScheme="teal" width="full">
              Reserver Maintenant
            </Button>
          </Center>
        </VStack>
      </Stack>
    </Box>
  );
};

export default RoomDetail;
