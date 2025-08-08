import React, { useState, useEffect } from 'react';
import { Box, Heading, Grid, IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useParams, useNavigate } from 'react-router-dom';
import RoomCard from '../Components/room_card';

function RoomPage() {
  const { hostelName } = useParams();
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        if (!hostelName) {
          return; // Exit early if hostelName is not defined
        }

        const token = 'e808ac1af8383c2110db302eb1b4f3a44d8c4e8c'; // Use the provided token
        console.log('Using Token:', token); // Log the token to confirm it's being used

        const url = `http://127.0.0.1:8000/api/rooms/?hostel__name=${encodeURIComponent(hostelName)}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Token ${token}`, // Pass the token in the header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log('API Response:', data); // Log API response for debugging

        if (Array.isArray(data)) {
          const availableRooms = data.filter(room => !room.is_booked);
          setRooms(availableRooms);
        } else {
          console.error('Unexpected data structure:', data);
          setError('Unexpected data structure');
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [hostelName]);

  if (isLoading) {
    return <Box p={4}>Loading...</Box>;
  }

  if (error) {
    return <Box p={4}>Error: {error}</Box>;
  }

  return (
    <Box p={4}>
      <IconButton 
        icon={<ArrowBackIcon />} 
        aria-label="Back to previous page" 
        onClick={() => navigate(-1)} 
        mb={6}
        bg="white"
        color="#0097b2"
        
        
      />
      <Heading mb={6}>{hostelName} Available Rooms</Heading>
      <Grid 
        templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} 
        gap={4}
      >
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            number={room.number}
            roomType={room.room_type}
            image={`http://127.0.0.1:8000${room.image}`}
            hostelName={hostelName}
            isBooked={room.is_booked}
          />
        ))}
      </Grid>
    </Box>
  );
}

export default RoomPage;
