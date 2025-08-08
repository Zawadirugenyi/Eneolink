import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Image, Stack, Center, Spinner, Button, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';

const RoomDescription = () => {
    const { roomNumber, hostelName } = useParams(); // Extract roomNumber and hostelName from params
    const [loading, setLoading] = useState(true);
    const [roomDescription, setRoomDescription] = useState(null);
    const [roomStatus, setRoomStatus] = useState(false); // Track room status
    const [error, setError] = useState(null);
    const [zoomedImage, setZoomedImage] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate hook for navigation

    useEffect(() => {
        const fetchRoomDescription = async () => {
            try {
                const token = 'e808ac1af8383c2110db302eb1b4f3a44d8c4e8c'; 
                const response = await axios.get(`http://127.0.0.1:8000/api/room-descriptions/`, {
                    params: {
                        room__number: roomNumber,
                        hostel__name: hostelName
                    },
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });

                console.log('Room Description Response:', response.data); // Log the response data

                // Find the specific room description by room number and hostel name
                const roomDesc = response.data.find(desc => desc.room_number === roomNumber && desc.hostel_name === hostelName);

                if (!roomDesc) {
                    setError('Room description not found');
                } else {
                    setRoomDescription(roomDesc);
                }
            } catch (error) {
                console.error('Error fetching room description:', error);
                setError('Error fetching room description');
            } finally {
                setLoading(false);
            }
        };

        const fetchRoomStatus = async () => {
            try {
                const token = 'e808ac1af8383c2110db302eb1b4f3a44d8c4e8c'; 
                const response = await axios.get(`http://127.0.0.1:8000/api/rooms/`, {
                    params: {
                        number: roomNumber,
                        hostel__name: hostelName
                    },
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });

                console.log('Room Status Response:', response.data); // Log the response data

                // Find the specific room status by room number
                const room = response.data.find(room => room.number === roomNumber);

                if (!room) {
                    setError('Room status not found');
                } else {
                    setRoomStatus(room.status);
                }
            } catch (error) {
                console.error('Error fetching room status:', error);
                setError('Error fetching room status');
            }
        };

        fetchRoomDescription();
        fetchRoomStatus();
    }, [roomNumber, hostelName]); // Add roomNumber and hostelName to the dependency array

    const handleImageClick = (imageSrc) => {
        setZoomedImage(imageSrc);
    };

    const closeZoom = () => {
        setZoomedImage(null);
    };

    const handleBookNowClick = () => {
        // Navigate to login with roomNumber and hostelName as state parameters
        navigate('/login', { state: { roomNumber, hostelName } });
    };

    if (loading) {
        return (
            <Center height="300px">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    // Ensure roomDescription exists and has required properties
    if (!roomDescription || !roomDescription.room_number) {
        return <Text>No room description found for Room {roomNumber}.</Text>;
    }

    return (
        <Box p={9} marginTop="0px" >
                  <IconButton 
        icon={<ArrowBackIcon />} 
        aria-label="Back to previous page" 
        onClick={() => navigate(-1)} 
        mb={6}
        bg="white"
        color="#0097b2"
        
      />
            <Stack direction="row" spacing={10}>
       
                <Box shadow="md" borderWidth="1px" p={9}>
                    <Stack direction="row" spacing={4} mb={4}>
                        <Image
                            src={`http://127.0.0.1:8000${roomDescription.sitting_room_image}`}
                            alt="Sitting Room"
                            boxSize="400px"
                            w="800px"
                            cursor="pointer"
                            onClick={() => handleImageClick(`http://127.0.0.1:8000${roomDescription.sitting_room_image}`)}
                        />
                        <Stack direction="column" spacing={3} mb={4} h="400px">
                            <Image
                                src={`http://127.0.0.1:8000${roomDescription.bedroom_image}`}
                                alt="Bedroom"
                                boxSize="200px"
                                cursor="pointer"
                                onClick={() => handleImageClick(`http://127.0.0.1:8000${roomDescription.bedroom_image}`)}
                            />
                            <Image
                                src={`http://127.0.0.1:8000${roomDescription.kitchen_image}`}
                                alt="Kitchen"
                                boxSize="200px"
                                cursor="pointer"
                                onClick={() => handleImageClick(`http://127.0.0.1:8000${roomDescription.kitchen_image}`)}
                            />
                            <Image
                                src={`http://127.0.0.1:8000${roomDescription.bathroom_image}`}
                                alt="Bathroom"
                                boxSize="200px"
                                cursor="pointer"
                                onClick={() => handleImageClick(`http://127.0.0.1:8000${roomDescription.bathroom_image}`)}
                            />
                        </Stack>
                    </Stack>
                </Box>
                <Box width="40%">
                    <Box shadow="md" borderWidth="1px" p={9} h="500px">
                        <Heading as="h2" size="lg" mb={4}>
                            Room {roomDescription.room_number} Description
                        </Heading>
                        <Text mb={4}>
                            Description: {roomDescription.description}
                        </Text>
                        <Text mb={4} fontWeight="bold" fontSize="17px">
                            Price: Ksh {roomDescription.price}
                        </Text>
                        <Button
                            bg="white"
                            color="#0097b2"
                            border="1px solid #0097b2"
                            boxShadow="md"
                            _hover={{ bg: "#0097b2", color: "white" }}
                            onClick={handleBookNowClick} // Updated to use handleBookNowClick for redirection
                            isDisabled={!roomStatus} // Disable button if roomStatus is false
                        >
                            Reserver Maintenant
                        </Button>
                    </Box>
                </Box>
            </Stack>

            {zoomedImage && (
                <Modal isOpen={!!zoomedImage} onClose={closeZoom} isCentered>
                    <ModalOverlay />
                    <ModalContent maxWidth="57%">
                        <ModalCloseButton />
                        <ModalBody shadow="md">
                            <Carousel showThumbs={false}>
                                <div>
                                    <img src={`http://127.0.0.1:8000${roomDescription.sitting_room_image}`} alt="Sitting Room" />
                                </div>
                                <div>
                                    <img src={`http://127.0.0.1:8000${roomDescription.bedroom_image}`} alt="Bedroom" />
                                </div>
                                <div>
                                    <img src={`http://127.0.0.1:8000${roomDescription.kitchen_image}`} alt="Kitchen" />
                                </div>
                                <div>
                                    <img src={`http://127.0.0.1:8000${roomDescription.bathroom_image}`} alt="Bathroom" />
                                </div>
                            </Carousel>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}

            {/* Back Button */}
          
        </Box>
    );
};

export default RoomDescription;
