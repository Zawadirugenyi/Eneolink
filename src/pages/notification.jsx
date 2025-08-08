import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, useToast, Spinner, HStack, IconButton } from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';

const NotificationPage = ({ tenant }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          toast({
            title: 'Authentication required.',
            description: 'Please log in to view notifications.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        const headers = { Authorization: `Token ${token}` };
        const notificationResponse = await axios.get('http://127.0.0.1:8000/api/notifications/', { headers });
        const allNotifications = notificationResponse.data || [];

        // Filter notifications by tenant name if tenant exists
        const filteredNotifications = tenant
          ? allNotifications.filter(notification => notification.tenant_name === tenant.name)
          : allNotifications;

        setNotifications(filteredNotifications);
      } catch (error) {
        toast({
          title: 'Error fetching notifications.',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tenant, toast]);

  const handleNotificationClick = async (id, read) => {
    if (!id) {
      console.log("Notification ID is undefined"); // Prevent making a request if ID is undefined
      return;
    }

    if (read) return; // Don't do anything if it's already read

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({
          title: 'Authentication required.',
          description: 'Please log in to mark notifications as read.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const headers = { Authorization: `Token ${token}` };

      await axios.patch(`http://127.0.0.1:8000/api/notifications/${id}/mark_as_read/`, {}, { headers });


      // Update the state to mark the notification as read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      toast({
        title: 'Error marking notification as read.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteNotification = async (id, event) => {
    event.stopPropagation(); // Prevent click event from bubbling up
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({
          title: 'Authentication required.',
          description: 'Please log in to delete notifications.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const headers = { Authorization: `Token ${token}` };

      await axios.delete(`http://127.0.0.1:8000/api/notifications/${id}/`, { headers });

      // Remove the deleted notification from state
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );

      toast({
        title: 'Notification deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error deleting notification.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={8}>
        <Spinner size="xl" />
        <Text mt={4}>Loading notifications...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Text fontSize="xl" mb={4}>{tenant?.name}'s Notifications</Text>
      <VStack spacing={4}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Box 
              key={notification.id || notification.date} 
              p={4} 
              shadow="md" 
              borderWidth="1px" 
              width="380px"
              cursor="pointer"
              bg={notification.read ? 'white' : 'blue.50'}
              onClick={() => handleNotificationClick(notification.id, notification.read)} // Ensure ID is passed
            >
              <HStack justifyContent="space-between">
                <Text fontWeight={notification.read ? 'normal' : 'bold'} color={notification.read ? 'gray.600' : 'black'}>
                  {notification.title || 'Information'} {/* Use a placeholder if title is missing */}
                </Text>
                <IconButton
                  size="sm"
                  aria-label="Delete notification"
                  icon={<MdDelete />}
                  onClick={(e) => handleDeleteNotification(notification.id, e)} // Pass the event object
                />
              </HStack>
              <Text color={notification.read ? 'gray.600' : 'black'}>
                {notification.message}
              </Text>
              <Text color="gray.500" marginLeft="60%" fontSize="11px" fontWeight="bold">
                {new Date(notification.date).toLocaleString()}
              </Text>
            </Box>
          ))
        ) : (
          <Text>No notifications available.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default NotificationPage;
