import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  VStack,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../Components/Assets/semmel-tip-1200b.jpg';

const Booking = () => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const location = useLocation();
  const navigate = useNavigate();
  const [tenantName, setTenantName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [tenantId, setTenantId] = useState(null);
  const [roomId, setRoomId] = useState(null);

  // Get today's date for the minimum check-in date
  const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

  useEffect(() => {
    if (location.state) {
      const { roomNumber, tenantName } = location.state;
      if (roomNumber) setRoomNumber(roomNumber);
      if (tenantName) setTenantName(tenantName);
    }
  }, [location.state]);

  // Existing effect to fetch tenant ID...
  useEffect(() => {
    const fetchTenantId = async () => {
      if (tenantName) {
        try {
          const token = localStorage.getItem('authToken');
          if (!token) {
            setMessage({ type: 'error', text: 'No authentication token found.' });
            return;
          }

          const response = await axios.get(`http://127.0.0.1:8000/api/tenants/?name=${tenantName}`, {
            headers: { Authorization: `Token ${token}` },
          });

          if (response.data.length > 0) {
            const tenant = response.data.find(t => t.name === tenantName);
            if (tenant) setTenantId(tenant.id);
            else setMessage({ type: 'error', text: 'Tenant not found.' });
          } else {
            setMessage({ type: 'error', text: 'No tenants found.' });
          }
        } catch (error) {
          const errorMessage = error.response?.data?.detail || 'Error fetching tenant ID.';
          setMessage({ type: 'error', text: errorMessage });
        }
      }
    };

    fetchTenantId();
  }, [tenantName]);

  // Existing effect to fetch room ID...
  useEffect(() => {
    const fetchRoomId = async () => {
      if (roomNumber) {
        try {
          const token = localStorage.getItem('authToken');
          if (!token) {
            setMessage({ type: 'error', text: 'No authentication token found.' });
            return;
          }

          const response = await axios.get(`http://127.0.0.1:8000/api/rooms/?number=${roomNumber}`, {
            headers: { Authorization: `Token ${token}` },
          });

          if (response.data.length > 0) {
            const room = response.data.find(r => r.number === roomNumber);
            if (room) setRoomId(room.id);
            else setMessage({ type: 'error', text: 'Room not found.' });
          } else {
            setMessage({ type: 'error', text: 'No rooms found.' });
          }
        } catch (error) {
          const errorMessage = error.response?.data?.detail || 'Error fetching room ID.';
          setMessage({ type: 'error', text: errorMessage });
        }
      }
    };

    fetchRoomId();
  }, [roomNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomId || !tenantId || !checkInDate || !checkOutDate) {
      setMessage({ type: 'error', text: 'Please fill out all fields correctly.' });
      return;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (isNaN(checkIn) || isNaN(checkOut) || checkIn >= checkOut) {
      setMessage({ type: 'error', text: 'Check-in date must be before the check-out date.' });
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setMessage({ type: 'error', text: 'No authentication token found.' });
        return;
      }

      const bookingResponse = await axios.post('http://127.0.0.1:8000/api/bookings/', {
        room: roomId,
        tenant: tenantId,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
      }, {
        headers: { Authorization: `Token ${token}` },
      });

      if (bookingResponse.status === 201) {
        setMessage({ type: 'success', text: 'Booking successful!' });
        navigate('/ticket', {
          state: {
            tenantName,
            roomNumber,
            checkInDate,
            checkOutDate,
          },
        });
      } else {
        setMessage({ type: 'error', text: 'Booking failed. Please try again.' });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || `Booking failed. ${error.message}`;
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={10}>
      <Box w="600px" p={6} bg="white" boxShadow="lg" rounded="md" borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Heading mb={6}>Reserver la Maison</Heading>
        {message.text && (
          <Alert status={message.type} mb={4}>
            <AlertIcon />
            <AlertTitle mr={2}>{message.type === 'success' ? 'Success' : 'Error'}!</AlertTitle>
            <AlertDescription>{message.text}</AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" onClick={() => setMessage({ type: '', text: '' })} />
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="room" isRequired>
              <FormLabel>Room Number</FormLabel>
              <Input type="text" value={roomNumber} isReadOnly cursor="not-allowed" bg="gray.200" />
            </FormControl>
            <FormControl id="tenant" isRequired>
              <FormLabel>Tenant Name</FormLabel>
              <Input type="text" value={tenantName} isReadOnly cursor="not-allowed" bg="gray.200" />
            </FormControl>
            <FormControl id="check_in_date" isRequired>
              <FormLabel>Check-in Date</FormLabel>
              <Input
                type="date"
                min={today} // Set min attribute to today's date
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
              />
            </FormControl>
            <FormControl id="check_out_date" isRequired>
              <FormLabel>Expected Vacation Date</FormLabel>
              <Input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
              />
            </FormControl>
            <Button
              type="submit"
              bg="#0097b2"
              color="white"
              _hover={{ bg: "#073d47" }}
              width="full"
            >
              Reverser 
            </Button>
          </VStack>
        </form>
      </Box>
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden"
        w="700px"
        p={6}
        height="500px"
        bg="gray.100"
        boxShadow="lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
      </Box>
    </Box>
  );
};

export default Booking;
