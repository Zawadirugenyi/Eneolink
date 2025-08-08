import React, { useState, useEffect } from "react";
import {
  Box,
  Image,
  Text,
  Button,
  IconButton,
  SimpleGrid,
  Spinner,
  Center,
  Flex,
  VStack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { FaHeart, FaDownload, FaMoon, FaSun, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate

import logo from '../Components/Assets/logo.png';// Update this path accordingly
const sidebarBgColor = "#0097b2";
const buttonHoverColor = "black";

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCards, setShowCards] = useState(true);
  const [colorMode, setColorMode] = useState("light");
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate(); // Use useNavigate for navigation

  // Extract tenantName and roomNumber from query parameters
  const queryParams = new URLSearchParams(location.search);
  const tenantName = queryParams.get('tenantName');
  const roomNumber = queryParams.get('roomNumber');

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    axios.get("http://127.0.0.1:8000/api/events/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((response) => {
      setEvents(response.data);
      setLoading(false);
    })
    .catch((error) => {
      setError("An error occurred while fetching events.");
      setLoading(false);
    });
  }, [tenantName, roomNumber]);

  const handleLike = (id) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === id ? { ...event, liked: !event.liked } : event
      )
    );
  };

  const handleDownloadRVP = (eventId, rvpFile) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (rvpFile) {
      axios.post(`http://127.0.0.1:8000/api/rvp-downloads/`, {
        event: eventId,
        tenant_name: tenantName || '',
      }, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then(() => {
        window.open(`http://127.0.0.1:8000${rvpFile}`, "_blank");
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "You have already downloaded one.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
    } else {
      toast({
        title: "No RVP File",
        description: "No RVP file available for download.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const toggleColorMode = () => {
    setColorMode(prevMode => (prevMode === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100vh">
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  return (
    <Flex h="100vh">
      <VStack
        w="20%"
        h="100vh"
        bg={sidebarBgColor}
        color="white"
        spacing={4}
        align="stretch"
        p={4}
      >
        <Image src={logo} alt="Logo" boxSize="100px" mb={4} />
        <Button
          colorScheme="white"
          variant="outline"
          _hover={{ bg: buttonHoverColor, color: "white" }}
          w="full"
          onClick={() => setShowCards(!showCards)}
        >
          {showCards ? 'Hide Dashboard' : 'Show Dashboard'}
        </Button>
        <IconButton
          icon={<FaArrowLeft />}
          colorScheme="white"
          variant="outline"
          _hover={{ bg: buttonHoverColor, color: "white" }}
          w="full"
          onClick={() => navigate(-1)} // Go back to the previous page
          aria-label="Go Back"
        />
        <Link
          to={`/facilities?tenantName=${encodeURIComponent(tenantName || '')}&roomNumber=${encodeURIComponent(roomNumber || '')}`}
        >
          <Button
            colorScheme="white"
            variant="outline"
            _hover={{ bg: buttonHoverColor, color: "white" }}
            w="full"
          >
            Facilities
          </Button>
        </Link>
        <Button
          colorScheme="white"
          variant="outline"
          _hover={{ bg: buttonHoverColor, color: "white" }}
          w="full"
          onClick={toggleColorMode}
        >
          {colorMode === 'light' ? <FaMoon /> : <FaSun />}
          {colorMode === 'light' ? ' Dark' : ' Light'}
        </Button>
        <Button
          colorScheme="white"
          variant="outline"
          _hover={{ bg: buttonHoverColor, color: "white" }}
          w="full"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </VStack>

      <Flex w="80%" p={4} direction="column">
        <HStack spacing={4} align="center" ml="auto">
          {/* Add other header elements or buttons here */}
        </HStack>

        <Box bg="gray.100" minH="100vh" p={10}>
          <Text as="h1" fontSize="3xl" mb={8} textAlign="center" color="teal.500">
            Upcoming Events
          </Text>
          {events.length === 0 ? (
            <Center>
              <Text>No events available.</Text>
            </Center>
          ) : (
            <SimpleGrid columns={[1, 2, 3]} spacing={10}>
              {events.map((event) => (
                <Box
                  key={event.id}
                  bg="white"
                  p={5}
                  shadow="md"
                  borderWidth="1px"
                  borderRadius="md"
                >
                  <Image
                    src={event.image ? `http://127.0.0.1:8000${event.image}` : "/path/to/placeholder.jpg"}
                    alt={event.title}
                    borderRadius="md"
                    objectFit="cover"
                    width="100%"
                    height="200px"
                  />
                  <Text mt={4} fontWeight="bold" fontSize="xl">
                    {event.title}
                  </Text>
                  <Text mt={2}> Location: {event.location}</Text>
                  <Text color="gray.500">{new Date(event.date).toLocaleDateString()}</Text>
                  <Flex justify="space-between" align="center" mt={4}>
                    <Button
                      colorScheme="teal"
                      onClick={() => handleDownloadRVP(event.id, event.rvp_file)}
                      leftIcon={<FaDownload />}
                      disabled={!event.rvp_file}
                    >
                      {event.rvp_file ? "Get your Ticket" : "No RVP File"}
                    </Button>
                    <IconButton
                      icon={<FaHeart />}
                      colorScheme={event.liked ? "red" : "gray"}
                      onClick={() => handleLike(event.id)}
                      aria-label="Like Event"
                    />
                  </Flex>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default EventPage;
