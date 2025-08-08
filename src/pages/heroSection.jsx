import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Heading, Text, VStack, HStack, useBreakpointValue } from '@chakra-ui/react';
import backgroundImage from '../Components/Assets/l-intro-1644597197.jpg'; // Import your image

const HeroSection = () => {
    const navigate = useNavigate();
    const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' });
    const buttonHoverColor = '#073d47'; // Define the hover color

    const handleHomeClick = () => {
        navigate('/home');
    };

    const handleViewRoomsClick = () => {
        navigate('/login');
    };

    const handleManageBookingsClick = () => {
        // Redirect to the Django admin panel
        window.location.href = 'http://127.0.0.1:8000/en/admin/';
    };

    return (
        <Box
            w="100%"
            h="100vh"
            position="relative" // Position relative for overlay positioning
            backgroundImage={`url(${backgroundImage})`} // Use imported image
            backgroundSize="cover"
            backgroundPosition="center"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
        >
            {/* Overlay with opacity */}
            <Box
                position="absolute"
                top={0}
                left={0}
                w="100%"
                h="100%"
                bg="rgba(0, 0, 0, 0.5)" // Semi-transparent black
                zIndex={1} // Ensure overlay is above the background image
            />
            {/* Content */}
            <VStack spacing={6} textAlign="center" zIndex={2}>
                <Heading fontSize={{ base: '3xl', md: '5xl' }} mb={4}>
                    Bienvenue chez EneoLink!
                </Heading>
                <Text fontSize={{ base: 'lg', md: 'xl' }} mb={6}>
               Une Place Pour Tous le Monde

                </Text>
                <HStack spacing={4} justify="center">
                    <Button
                        colorScheme="white"
                        variant="outline"
                        size={buttonSize}
                        onClick={handleHomeClick}
                        _hover={{ bg: buttonHoverColor, color: "white" }}
                        w="full"
                    >
                        Commencer
                    </Button>
                    <Button
                        colorScheme="white"
                        variant="outline"
                        size={buttonSize}
                        onClick={handleViewRoomsClick}
                        _hover={{ bg: buttonHoverColor, color: "white" }}
                        w="full"
                    >
                        Mon Compte
                    </Button>
                    <Button
                        colorScheme="white"
                        variant="outline"
                        size={buttonSize}
                        onClick={handleManageBookingsClick}
                        _hover={{ bg: buttonHoverColor, color: "white" }}
                        w="full"
                    >
                        Administrateur
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default HeroSection;
