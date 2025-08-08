import React, { useState, useEffect } from 'react';
import { 
  Box, FormControl, FormLabel, Input, Button, Heading, Text, VStack, 
  Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton 
} from '@chakra-ui/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import backgroundImage from '../Components/Assets/elegant-white-wardrobe-designs-for-bedroom.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [roomNumber, setRoomNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.roomNumber) {
      setRoomNumber(location.state.roomNumber);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage({ type: '', text: '' });

  try {
    const response = await fetch('http://127.0.0.1:8000/users/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Incorrect email or password');
    }

    const data = await response.json();
    localStorage.setItem('authToken', data.token);

    // Fetch tenant data
    const tenantResponse = await fetch('http://127.0.0.1:8000/api/tenants/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${data.token}`,
      },
    });

    if (!tenantResponse.ok) {
      throw new Error('Error fetching tenant data');
    }

    const tenantData = await tenantResponse.json();
    const tenant = tenantData.find(t => t.email === email);

    if (tenant) {
      localStorage.setItem('tenantId', tenant.id);
      localStorage.setItem('tenantData', JSON.stringify(tenant));

      // Fetch booking data
      const bookingResponse = await fetch(`http://127.0.0.1:8000/api/bookings/?tenant=${tenant.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${data.token}`,
        },
      });

      if (!bookingResponse.ok) {
        throw new Error('Error fetching bookings');
      }

      const bookingData = await bookingResponse.json();
      localStorage.setItem('bookingData', JSON.stringify(bookingData));

      // Navigate based on booking status
      if (bookingData.length > 0) {
        navigate('/dashboard', {
          state: {
            tenantName: tenant.name,
            roomNumber,
          },
        });
      } else {
        navigate('/booking', {
          state: { roomNumber, tenantName: tenant.name },
        });
      }
    } else {
      navigate('/tenant', { state: { roomNumber } });
    }
  } catch (error) {
    console.error('Error:', error);
    setMessage({ type: 'error', text: error.message });
  } finally {
    setLoading(false);
  }
};

  return (
    <Box display="flex" justifyContent="center" marginTop="50px">
      <Box
        w="800px"
        p={6}
        height="500px"
        bg="gray.100"
        boxShadow="lg"
        bgSize="cover"
        bgPosition="center"
        mr={6}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <Box
        w="500px"
        p={6}
        bg="white"
        boxShadow="lg"
        rounded="md"
      >
        <Heading mb={6}>Connexion</Heading>
        {message.text && (
          <Alert status={message.type} mb={4}>
            <AlertIcon />
            <AlertTitle mr={2}>{message.type === 'success' ? 'Success' : 'Error'}!</AlertTitle>
            <AlertDescription>{message.text}</AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" onClick={() => setMessage({ type: '', text: '' })} />
          </Alert>
        )}
        <form onSubmit={handleLogin}>
          <VStack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </FormControl>
            <Button 
              marginTop="12px"
              type="submit" 
              bg="#0097b2"
              color="white"
              _hover={{ bg: "#073d47" }}
              width="full"
            >
              Connexion
            </Button>
          </VStack>
        </form>
        <Text mt={4} textAlign="center">
          Pas de compte? <Link to="/signup" color="teal.500">Enregistrez Vous</Link>
        </Text>
      </Box>
    </Box>
  );
}

export default Login;
