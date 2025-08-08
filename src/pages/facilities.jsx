import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Image,
  Text,
  Badge,
  SimpleGrid,
  Button,
  useToast,
  VStack,
  Flex,
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import { FaArrowLeft, FaMoon, FaSun } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [error, setError] = useState(null);
  const [registrationData, setRegistrationData] = useState({
    facilityId: null,
    tenantName: '',
  });
  const [loading, setLoading] = useState(true); // Loading state
  const toast = useToast();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const authToken = localStorage.getItem('authToken');

  // Extract tenantName from query parameters
  const query = new URLSearchParams(useLocation().search);
  const tenantNameFromQuery = query.get('tenantName');

  useEffect(() => {
    console.log('Tenant Name from Query:', tenantNameFromQuery);

    if (!tenantNameFromQuery) {
      setError('Tenant name is missing from query parameters.');
      setLoading(false);
      return;
    }

    const fetchTenantId = async () => {
      try {
        console.log('Fetching tenant ID...');
        const response = await axios.get(
          `http://127.0.0.1:8000/api/tenants/?name=${encodeURIComponent(tenantNameFromQuery)}`,
          { headers: { Authorization: `Token ${authToken}` } }
        );
        console.log('Tenant Response:', response.data);
        if (response.data.length === 0) {
          setError('Tenant not found.');
        } else {
          setRegistrationData(prev => ({
            ...prev,
            tenantName: tenantNameFromQuery,
          }));
        }
      } catch (err) {
        console.error('Error fetching tenant ID:', err);
        setError(err.message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    const fetchFacilities = async () => {
      try {
        console.log('Fetching facilities...');
        const response = await axios.get(
          'http://127.0.0.1:8000/api/facilities/',
          { headers: { Authorization: `Token ${authToken}` } }
        );
        console.log('Facilities Response:', response.data);
        setFacilities(response.data);
      } catch (err) {
        console.error('Error fetching facilities:', err);
        setError(err.message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchTenantId();
    fetchFacilities();
  }, [authToken, tenantNameFromQuery]);

  const handleRegister = async (facilityId) => {
    const { tenantName } = registrationData;

    console.log('Registering facility with the following data:');
    console.log('Facility ID:', facilityId);
    console.log('Tenant Name:', tenantName);

    try {
      // Fetch the tenant ID
      const tenantResponse = await axios.get(
        `http://127.0.0.1:8000/api/tenants/?name=${encodeURIComponent(tenantName)}`,
        { headers: { Authorization: `Token ${authToken}` } }
      );

      const fetchedTenantName = tenantResponse.data[0]?.name;

      if (!fetchedTenantName) {
        throw new Error('Tenant ID not found');
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/api/register_facility/`,
        { tenant: fetchedTenantName, facility: facilityId },
        { headers: { Authorization: `Token ${authToken}` } }
      );

      console.log('Registration Response:', response.data);

      toast({
        title: 'Registration successful.',
        description: `You have successfully registered for the facility.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setRegistrationData({ facilityId: null, tenantName: '' });
    } catch (err) {
      console.error('Error registering facility:', err);
      const errorMessage = err.response?.data?.detail || err.message || String(err);
      console.log('Error details:', errorMessage);

      if (errorMessage.includes('UNIQUE constraint failed')) {
        toast({
          title: 'Registration failed.',
          description: 'You are already registered for this facility.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Registration failed.',
          description: `An unexpected error occurred: ${errorMessage}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Flex h="100vh">
      <VStack
        w="20%"
        h="100vh"
        bg="#0097b2"
        color="white"
        spacing={4}
        align="stretch"
        p={3}
      >
        <IconButton
          icon={<FaArrowLeft />}
          colorScheme="white"
          variant="outline"
          _hover={{ bg: 'black', color: 'white' }}
          w="full"
          onClick={() => navigate(-1)}
          aria-label="Go Back"
        />
        <Button
          colorScheme="white"
          variant="outline"
          _hover={{ bg: 'black', color: 'white' }}
          w="full"
          onClick={toggleColorMode}
        >
          {colorMode === 'light' ? <FaMoon /> : <FaSun />}
          {colorMode === 'light' ? ' Dark' : ' Light'}
        </Button>
      </VStack>

      <Box bg="gray.100" minH="100vh" w="80%" p={10}>
        <Text as="h1" fontSize="3xl" mb={8} textAlign="center" color="teal.500">
          Our Facilities
        </Text>
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={3}>
          {facilities.map((facility) => (
            <Box
              key={facility.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              display="flex"
              flexDirection="column"
              bg="white"
              shadow="md"
            >
              {facility.image && (
                <Image
                  src={`http://127.0.0.1:8000${facility.image}`}
                  alt={facility.name}
                  boxSize="100%"
                  objectFit="cover"
                  fallbackSrc="path/to/fallback/image.jpg" // Fallback image if necessary
                />
              )}
              <Box p="3" flex="1">
                <Badge
                  borderRadius="full"
                  px="2"
                  colorScheme={facility.interaction_type === 'register' ? 'green' : 'teal'}
                >
                  {facility.interaction_type === 'register' ? 'Register' : 'Contact'}
                </Badge>

                <Box fontWeight="semibold" as="h4" lineHeight="tight" mb={2}>
                  {facility.name}
                </Box>
                <Text mb={3}>{facility.description}</Text>

                <Flex direction="column" align="flex-start">
                  {facility.interaction_type === 'register' ? (
                    <Button
                      colorScheme="teal"
                      size="sm"
                      onClick={() => handleRegister(facility.id)}
                    >
                      Register
                    </Button>
                  ) : (
                    <Box>
                      <Text fontWeight="bold">Contact Info:</Text>
                      <Text>Name: {facility.contact_name}</Text>
                      <Text>Email: {facility.contact_email}</Text>
                      <Text>Phone: {facility.contact_phone}</Text>
                    </Box>
                  )}
                </Flex>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default Facilities;