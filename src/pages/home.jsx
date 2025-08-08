import React, { useState, useEffect } from 'react';
import { Box, Heading, Grid } from '@chakra-ui/react';
import HostelCard from '../Components/hostel_card';

function Home() {
  const [hostels, setHostels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const token = 'e808ac1af8383c2110db302eb1b4f3a44d8c4e8c'; 
        const response = await fetch('http://127.0.0.1:8000/api/hostels/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setHostels(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching hostels:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchHostels();
  }, []);

  if (isLoading) {
    return <Box p={4}>Loading...</Box>;
  }

  if (error) {
    return <Box p={4}>Error: {error}</Box>;
  }

  return (
    <Box p={4}>
      <Heading mb={6}>Resisdences</Heading>
      <Grid 
        templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} 
        gap={4}
      >
        {hostels.map((hostel) => (
          <HostelCard
            key={hostel.id} 
            id={hostel.id}
            name={hostel.name}
            address={hostel.address}
            image={`http://127.0.0.1:8000${hostel.image}`} // Adjust URL construction
          />
        ))}
      </Grid>
    </Box>
  );
}

export default Home;