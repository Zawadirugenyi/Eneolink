import React, { useState, useEffect } from "react";
import { Box, Flex, IconButton, Image, Text } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const featuredProducts = [
  {
    id: 1,
    image: "https://via.placeholder.com/600x400?text=Product+1",
    title: "Featured Product 1",
    description: "This is the first featured product.",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/600x400?text=Product+2",
    title: "Featured Product 2",
    description: "This is the second featured product.",
  },
  {
    id: 3,
    image: "https://via.placeholder.com/600x400?text=Product+3",
    title: "Featured Product 3",
    description: "This is the third featured product.",
  },
  {
    id: 4,
    image: "https://via.placeholder.com/600x400?text=Product+4",
    title: "Featured Product 4",
    description: "This is the fourth featured product.",
  },
  {
    id: 5,
    image: "https://via.placeholder.com/600x400?text=Product+5",
    title: "Featured Product 5",
    description: "This is the fifth featured product.",
  },
];

const BypassCodePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === featuredProducts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? featuredProducts.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, []);

  const getSlideStyles = (index) => {
    const position = (index - currentIndex + featuredProducts.length) % featuredProducts.length;

    if (position === 0) {
      return {
        left: "50%",
        transform: "translateX(-50%) scale(1.2)", // Center larger product
        zIndex: 3,
        opacity: 1,
      };
    } else if (position === 1) {
      return {
        left: "25%",
        transform: "translateX(-50%) scale(0.85)", // Left product
        zIndex: 2,
        opacity: 0.8,
      };
    } else if (position === featuredProducts.length - 1) {
      return {
        left: "75%",
        transform: "translateX(-50%) scale(0.85)", // Right product
        zIndex: 2,
        opacity: 0.8,
      };
    } else {
      return { display: "none" }; // Hide other products
    }
  };

  return (
    <Box position="relative" w="full" maxW="1200px" mx="auto" overflow="hidden" py={8}>
      <Flex justify="center" align="center" position="relative" h="400px">
        {featuredProducts.map((product, index) => (
          <Box
            key={product.id}
            position="absolute"
            top="50%"
            style={getSlideStyles(index)}
            transition="all 0.5s ease"
            transform="translateY(-50%)"
          >
            <Image
              src={product.image}
              alt={product.title}
              w="300px"
              h="200px"
              objectFit="cover"
              borderRadius="md"
              boxShadow="lg"
              border="2px solid #ddd"
            />
            <Box textAlign="center" mt={2}>
              <Text fontSize="lg" fontWeight="bold">
                {product.title}
              </Text>
              <Text fontSize="sm">{product.description}</Text>
            </Box>
          </Box>
        ))}
      </Flex>

      {/* Navigation Buttons */}
      <IconButton
        aria-label="Previous"
        icon={<ChevronLeftIcon />}
        position="absolute"
        left="5%"
        top="50%"
        transform="translateY(-50%)"
        size="lg"
        variant="ghost"
        colorScheme="blackAlpha"
        onClick={prevSlide}
        zIndex={4}
      />
      <IconButton
        aria-label="Next"
        icon={<ChevronRightIcon />}
        position="absolute"
        right="5%"
        top="50%"
        transform="translateY(-50%)"
        size="lg"
        variant="ghost"
        colorScheme="blackAlpha"
        onClick={nextSlide}
        zIndex={4}
      />
    </Box>
  );
};

export default BypassCodePage;
