
import React from 'react';
import { Flex, Box, Heading, Button, Image, Menu, MenuButton, MenuList, MenuItem, IconButton } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';
import logo from './Assets/Eneolink.png';

function Navbar() {
  return (
    <Flex
      borderWidth="1px"
      overflow="hidden"
      boxShadow="sm"
      p={2}
      bg="white"
      color="black"
      align="center"
      wrap="wrap"
      justify="space-between"
    >
      <Flex align="center" mr={5}>
        <Image src={logo} alt="SmartHostelPro Logo" h="20" /> {/* Adjust height as needed */}
        <Heading fontFamily="Railways" size={{ base: 'md', md: 'lg' }} ml={3}>
          EnoeLink
        </Heading>
      </Flex>
      <Box display={{ base: 'none', md: 'block' }}>
        <Button as={Link} to="/" variant="link" color="#003780" mr={4} _hover={{ color: 'black' }}>
          Accueil
        </Button>
        <Button as={Link} to="/about_us" variant="link" color="#003780" mr={4} _hover={{ color: 'black' }}>
          A Propos de Nous
        </Button>
        <Button as={Link} to="/contact_us" variant="link" color="#003780" mr={4} _hover={{ color: 'black' }}>
          Contactez Nous
        </Button>
      </Box>
      <Box display={{ base: 'block', md: 'none' }}>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<HamburgerIcon />}
            variant="outline"
            color="white"
            _hover={{ color: 'black' }}
          />
          <MenuList >
            <MenuItem as={Link} to="/"  color="#0097b2">
              Accueil
            </MenuItem >
            <MenuItem as={Link} to="/about_us"  color="#0097b2">
              A Propos de Nous
            </MenuItem>
            <MenuItem as={Link} to="/contact_us"  color="#0097b2">
              Contactez Nous
            </MenuItem>
            
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
}

export default Navbar;
