import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Radio,
  Input,
  Select,
  InputGroup,
  RadioGroup,
  Stack,
  Grid,
  GridItem,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  useToast
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Tenant = () => {
  const [formData, setFormData] = useState({
    name: '',
    major: '',
    admin_number: '',
    gender: '',
    nationality: '',
    passport: '',
    phone_number: '',
    email: '',
    parent: '',
    sponsor_contact: '',
    passport_photo: null,
    position: '',
    countryCode: '',
    guardian_contact: '',
    guardianCountryCode: '' // Separate state for guardian's country code
  });
  const [showCustomCountryCode, setShowCustomCountryCode] = useState(false);
  const [showCustomGuardianCountryCode, setShowCustomGuardianCountryCode] = useState(false); // State for custom guardian country code
  const [message, setMessage] = useState({ type: '', text: '' });
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract roomNumber from location state
  const roomNumber = location.state?.roomNumber || '';

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else if (name === 'countryCode') {
      setFormData({
        ...formData,
        countryCode: value
      });
      // Show custom input if "Other" is selected
      if (value === 'other') {
        setShowCustomCountryCode(true);
      } else {
        setShowCustomCountryCode(false);
      }
    } else if (name === 'guardianCountryCode') { // Handling guardian country code
      setFormData({
        ...formData,
        guardianCountryCode: value
      });
      // Show custom input if "Other" is selected
      if (value === 'other') {
        setShowCustomGuardianCountryCode(true);
      } else {
        setShowCustomGuardianCountryCode(false);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token not found.');
      }

      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await axios.post('http://127.0.0.1:8000/api/tenants/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`
        }
      });

      const tenant = response.data;
      setMessage({ type: 'success', text: 'Registration successful' });
      toast({
        title: 'Registration successful.',
        description: 'You have successfully registered.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Clear form data
      setFormData({
        name: '',
        major: '',
        admin_number: '',
        gender: '',
        nationality: '',
        passport: '',
        phone_number: '',
        email: '',
        parent: '',
        guardian_contact: '', // Reset guardian contact
        sponsor_contact: '',
        passport_photo: null,
        position: '',
        countryCode: '',
        guardianCountryCode: '' // Reset guardian country code
      });

      // Navigate to booking page with room number and tenant name
      navigate('/booking', { state: { roomNumber, tenantName: tenant.name } });

    } catch (error) {
      const errorMsg = error.response?.data || 'Registration failed';
      const errorText = typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg);
      setMessage({ type: 'error', text: errorText });
      console.error('Error during registration:', error);
      toast({
        title: 'Registration failed.',
        description: errorText,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w="1200px" mx="auto" mt={10} p={5} borderWidth={1} borderRadius="lg">
      <Heading mb={6}>Tenant Registration</Heading>
      {message.text && (
        <Alert status={message.type} mb={4}>
          <AlertIcon />
          <AlertTitle mr={2}>{message.type === 'success' ? 'Success' : 'Error'}!</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
          <CloseButton position="absolute" right="8px" top="8px" onClick={() => setMessage({ type: '', text: '' })} />
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          <GridItem colSpan={1}>
            <FormControl id="name" isRequired>
              <FormLabel>Noms</FormLabel>
              <Input type="text" name="name" value={formData.name} onChange={handleChange} />
            </FormControl>
          </GridItem>

          <GridItem colSpan={1}>
            <FormControl id="major" isRequired>
              <FormLabel>Profession</FormLabel>
              <Input type="text" name="major" value={formData.major} onChange={handleChange} />
            </FormControl>
          </GridItem>

          <GridItem colSpan={1}>
            <FormControl id="admin_number" isRequired>
              <FormLabel>ID de Travail</FormLabel>
              <Input type="text" name="admin_number" value={formData.admin_number} onChange={handleChange} />
            </FormControl>
          </GridItem>

          <GridItem colSpan={1}>
            <FormControl id="gender" isRequired>
              <FormLabel>Genre</FormLabel>
              <RadioGroup name="gender" value={formData.gender} onChange={(value) => setFormData({ ...formData, gender: value })}>
                <Stack direction="row">
                  <Radio value="Male">Male</Radio>
                  <Radio value="Female">Female</Radio>
                  <Radio value="Other">Other</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </GridItem>

          <GridItem colSpan={1}>
            <FormControl id="nationality" isRequired>
              <FormLabel>Nationalité</FormLabel>
              <Select name="nationality" value={formData.nationality} onChange={handleChange}>
                <option value="">Select Nationality</option>
                <option value="DRC">Congolese</option>
                <option value="Kenya">Kenyan</option>
                <option value="Uganda">Ugandan</option>
                <option value="Tanzania">Tanzanian</option>
                <option value="Rwanda">Rwandaise</option>
                <option value="Other">Other</option>
              </Select>
            </FormControl>
          </GridItem>

          <GridItem colSpan={1}>
            <FormControl id="passport" isRequired>
              <FormLabel>Carte d'électeur ID/Passport</FormLabel>
              <Input type="text" name="passport" value={formData.passport} onChange={handleChange} />
            </FormControl>
          </GridItem>

          <GridItem colSpan={1}>
            <FormControl id="passport_photo" isRequired>
              <FormLabel>Photo Passeport</FormLabel>
              <Input type="file" name="passport_photo" onChange={handleChange} />
            </FormControl>
          </GridItem>

          <GridItem colSpan={1}>
            <FormControl id="phone_number" isRequired>
              <FormLabel>Téléphone</FormLabel>
              <InputGroup>
                <Select
                  name="countryCode"
                  width="35%"
                  value={formData.countryCode}
                  onChange={handleChange}
                >
                  <option value="+243">+243 (DRC)</option>
                  <option value="+254">+254 (Kenya)</option>
                  <option value="+256">+256 (Uganda)</option>
                  <option value="+255">+255 (Tanzania)</option>
                  <option value="+250">+250 (Rwanda)</option>
                  <option value="other">Other</option>
                </Select>
                {showCustomCountryCode && (
                  <Input
                    type="text"
                    name="countryCodeCustom"
                    placeholder="Enter custom country code"
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                  />
                )}
                <Input
                  type="number"
                  name="phone_number"
                  placeholder="Phone Number"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </InputGroup>
            </FormControl>
          </GridItem>

          <GridItem colSpan={1}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} />
            </FormControl>
          </GridItem>

          <GridItem colSpan={1}>
            <FormControl id="parent" isRequired>
              <FormLabel>Personne de Réference</FormLabel>
              <Input type="text" name="parent" value={formData.parent} onChange={handleChange} />
            </FormControl>
          </GridItem>

          <GridItem colSpan={1}>
            <FormControl id="guardian_contact" isRequired>
              <FormLabel>PR Télephone</FormLabel>
              <InputGroup>
                <Select
                  name="guardianCountryCode"
                  width="35%"
                  value={formData.guardianCountryCode}
                  onChange={handleChange}
                >
                  <option value="+243">+243 (DRC)</option>
                  <option value="+254">+254 (Kenya)</option>
                  <option value="+256">+256 (Uganda)</option>
                  <option value="+255">+255 (Tanzania)</option>
                  <option value="+250">+250 (Rwanda)</option>
                  <option value="other">Other</option>
                </Select>
                {showCustomGuardianCountryCode && (
                  <Input
                    type="text"
                    name="guardianCountryCodeCustom"
                    placeholder="Enter custom guardian country code"
                    onChange={(e) => setFormData({ ...formData, guardianCountryCode: e.target.value })}
                  />
                )}
                <Input
                  type="number"
                  name="guardian_contact"
                  placeholder="Guardian Phone Number"
                  value={formData.guardian_contact}
                  onChange={handleChange}
                />
              </InputGroup>
            </FormControl>
          </GridItem>


          <GridItem colSpan={1}>
              <FormControl id="Relationship" isRequired>
              <FormLabel>Relations</FormLabel>
              <Select name="relationship" value={formData.relationship} onChange={handleChange}>
                <option value="">Select Relationship</option>
                <option value="Father">Père</option>
                <option value="Mother">Mère</option>
                <option value="Mother">Mari</option>
                <option value="Mother">Femme</option>
                <option value="Mother">Ami</option>
                <option value="Guardian">Guardian</option>
             
              </Select>
            </FormControl>
          </GridItem>
        </Grid>

  
             <Box textAlign="center" mt={6}>
          <Button type="submit" bg="#0097b2" color="white" width="400px" _hover={{ bg: "#073d47" }}>
            Register
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Tenant;
