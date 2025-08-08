import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Box, VStack, Text, Button, HStack, Alert, AlertIcon, Image,
  AlertTitle, AlertDescription, CloseButton, useBreakpointValue,
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { jsPDF } from 'jspdf';
import backgroundImage from '../Components/Assets/l-intro-1644597197.jpg'; // Import your image
import logo from '../Components/Assets/logooo.jpeg'; // Ensure logo path is correct

// Format date to MM/DD/YYYY
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Function to generate a random token number
const generateToken = () => {
  return Math.floor(100000 + Math.random() * 900000); // Random 6-digit token number
};

const Ticket = () => {
  const [tenantName, setTenantName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [token, setToken] = useState(''); // Store the generated token
  const [qrCodeURL, setQrCodeURL] = useState(''); // State for QR Code URL
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate
  const ticketWidth = useBreakpointValue({ base: '100%', md: '600px' }); // Responsive width

  useEffect(() => {
    if (location.state) {
      const { tenantName, roomNumber, checkInDate, checkOutDate } = location.state;
      setTenantName(tenantName || '');
      setRoomNumber(roomNumber || '');
      setCheckInDate(checkInDate || '');
      setCheckOutDate(checkOutDate || '');
      const newToken = generateToken(); // Generate token
      setToken(newToken);

      // Generate QR Code URL
      QRCode.toDataURL(`Room Number: ${roomNumber}, Token: ${newToken}`)
        .then(url => setQrCodeURL(url))
        .catch(err => console.error(err));
    }
  }, [location.state]);

  const generateTicket = () => {
    const formattedCheckInDate = formatDate(checkInDate);
    const formattedCheckOutDate = formatDate(checkOutDate);
    const content = `
    --- Booking Confirmation ---

    Dear ${tenantName},

    Thank you for choosing our hostel! We are pleased to confirm your room booking. Below are the details of your reservation:

    --- Room Information ---
    Room Number: ${roomNumber}
    Check-in Date: ${formattedCheckInDate}
    Check-out Date: ${formattedCheckOutDate}

    --- Your Token Number ---
    Token Number: ${token}

    --- Notes ---
    This ticket is valid for the duration of your stay. Please present this ticket along with your token number at the front desk upon arrival.

    --- Conclusion ---
    We hope you have a pleasant stay. Should you need any further assistance, feel free to contact our support team. Thank you again for choosing us, and we look forward to hosting you.

    Best regards,
    The Hostel Management Team
    `;
    setMessage({ type: 'info', text: content });

    // Redirect to home page after generating the ticket
    navigate("/"); // Redirects to home
  };

  const downloadPDF = () => {
    if (!qrCodeURL) {
      setMessage({ type: 'error', text: 'QR Code is not generated yet.' });
      return;
    }

    const formattedCheckInDate = formatDate(checkInDate);
    const formattedCheckOutDate = formatDate(checkOutDate);
    const doc = new jsPDF();

    // Set up border and card background color (light gray)
    doc.setFillColor(240, 240, 240);
    doc.rect(5, 5, 200, 287, 'F'); // Creates a card-like border around the page

    // Add a logo to the PDF (top-center)
    doc.addImage(logo, 'JPEG', 80, 10, 50, 20); // Centered logo


    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Room Booking Confirmation', 105, 40, { align: 'center' });

    // Introduction (tenant details)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(20, 60, `Dear ${tenantName},`);
    doc.text(20, 70, `Thank you for choosing our hostel! We are pleased to confirm your booking.`);

    // Divider line
    doc.setLineWidth(0.5);
    doc.line(10, 75, 200, 75);

    // Room Information (centered and formatted)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Room Information', 105, 90, { align: 'center' });

    // Room details content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(20, 100, `Room Number: ${roomNumber}`);
    doc.text(20, 110, `Check-in Date: ${formattedCheckInDate}`);
    doc.text(20, 120, `Check-out Date: ${formattedCheckOutDate}`);

    // Divider line
    doc.setLineWidth(0.5);
    doc.line(10, 130, 200, 130);

    // Token Information - Adjusted Position
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Your Token Number', 20, 145); // Left-aligned header

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Token Number: ${token}`, 20, 155);

    // Divider line
    doc.setLineWidth(0.5);
    doc.line(10, 165, 200, 165);

    // Conclusion
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Important Notes', 105, 180, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(20, 190, `This ticket is valid for the duration of your stay. Please present this ticket`);
    doc.text(20, 200, `along with your token number at the front desk upon arrival.`);

    // Footer section (final thank you and contact information)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(105, 220, 'Thank You!', { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(20, 230, `We hope you have a pleasant stay. Should you need any assistance,`);
    doc.text(20, 240, `feel free to contact our support team at any time.`);

    doc.text(105, 270, 'Best regards,', { align: 'center' });
    doc.text(105, 280, 'The Hostel Management Team', { align: 'center' });

    // Add QR Code at the end of the PDF
    const qrCodeWidth = 50; // Adjust width
    const qrCodeHeight = 50; // Adjust height
    const qrCodeX = 105 - (qrCodeWidth / 2); // Center horizontally
    const qrCodeY = 250; // Adjust Y position as needed

    doc.addImage(qrCodeURL, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight); // Adjust positioning and size as needed

    // Save the PDF
    doc.save('room_booking_ticket.pdf');
  };

  return (
    <HStack spacing={4} align="start" p={4} bgImage={`url(${backgroundImage})`} position="relative" bgSize="cover" bgPosition="center" minH="100vh">
      <Box
        flex="1"
        bg="white"
        borderRadius="md"
        boxShadow="md"
        p={6}
        position="relative"
        maxW={ticketWidth}
        zIndex={2}
        marginLeft="30%"
        marginTop="5%"
      >
        <Text fontSize="3xl" fontWeight="bold" mb={4} textAlign="center">Room Booking Ticket</Text>
        <VStack spacing={4} align="stretch">
          <Box bg="gray.50" p={4} borderRadius="md" boxShadow="sm">
            <Text fontSize="lg" fontWeight="bold" mb={2}>Tenant Information</Text>
            <Text>Name: {tenantName}</Text>
            <Text>Token: {token}</Text>
          </Box>
          <Box bg="gray.50" p={4} borderRadius="md" boxShadow="sm">
            <Text fontSize="lg" fontWeight="bold" mb={2}>Room Information</Text>
            <Text>Room Number: {roomNumber}</Text>
            <Text>Check-in: {formatDate(checkInDate)}</Text>
            <Text>Expected Vacation Date: {formatDate(checkOutDate)}</Text>
          </Box>
          {message.text && (
            <Alert status={message.type} borderRadius="md">
              <AlertIcon />
              <AlertTitle>{message.type === 'error' ? 'Error!' : 'Info!'}</AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
              <CloseButton position="absolute" right="8px" top="8px" onClick={() => setMessage({ type: '', text: '' })} />
            </Alert>
          )}
             {qrCodeURL && (
            <Box marginLeft="219px">
              <Text fontSize="lg" fontWeight="bold" mb={2}>Your QR Code:</Text>
              <Image src={qrCodeURL} alt="QR Code" boxSize="100px" />
            </Box>
          )}
          <HStack spacing={4} justifyContent="center">
            <Button  color="white" bg="#0097b2"onClick={generateTicket} width="150px" _hover={{ bg: "#073d47" }}>Home</Button>
            <Button  color="white" bg="#073d47" onClick={downloadPDF}_hover={{ bg: "#073d47" }}>Download PDF</Button>
          </HStack>
       
        </VStack>
      </Box>
    
    </HStack>
  );
};

export default Ticket;
