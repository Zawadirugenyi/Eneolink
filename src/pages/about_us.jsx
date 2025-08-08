import React from 'react';
import { Box, Heading, Text, Stack, useBreakpointValue, Image } from '@chakra-ui/react';
import backgroundImage from '../Components/Assets/TEMPO.png'; // Replace with your actual image path

const AboutUs = () => {
    const imageWidth = useBreakpointValue({ base: '100%', md: '40%' });
    const contentWidth = useBreakpointValue({ base: '100%', md: '67%' });
    const boxHeight = useBreakpointValue({ base: 'auto', md: '400px' });

    return (
        <Box shadow="md" borderWidth="1px" p={8}>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={8}>
                <Box
                    w={imageWidth}
                    p={6}
                    bg="gray.200"
                    boxShadow="lg"
                    rounded="md"
                    bgSize="cover"
                    bgPosition="center"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                    display={{ base: 'none', md: 'block' }} // Hide image on small screens
                />
                <Box w={contentWidth} shadow="md" borderWidth="1px" p={9} ml={{ base: 0, md: 4 }}>
                    <Heading as="h1" mb={6}>About Us</Heading>
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={8}>
                        <Box shadow="md" borderWidth="1px" p={9} h={boxHeight} w={{ base: '100%', md: '34%' }}>
                            <Text fontSize="lg" mb={4}>
                                Welcome to EneoLink! We are dedicated to providing the best accommodation experience for people and professionals.
                                Our facilities are equipped with modern amenities to ensure your comfort and convenience.
                            </Text>
                        </Box>
                        <Box shadow="md" borderWidth="1px" p={9} h={boxHeight} w={{ base: '100%', md: '30%' }}>
                            <Text fontSize="lg" mb={4}>
                                Our mission is to create a safe and welcoming environment where you can focus on your studies or work.
                                We believe in providing quality service and support to all our residents.
                            </Text>
                        </Box>
                        <Box shadow="md" borderWidth="1px" p={9} h={boxHeight} w={{ base: '100%', md: '30%' }}>
                            <Text fontSize="lg" mb={4}>
                                Thank you for choosing EneoLink. We look forward to making your stay enjoyable and memorable.
                            </Text>
                        </Box>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
};

export default AboutUs;
