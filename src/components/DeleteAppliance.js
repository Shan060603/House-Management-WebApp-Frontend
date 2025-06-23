import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Text,
    useToast,
  } from "@chakra-ui/react";
  import axios from "axios";
  
  export default function DeleteAppliance({ isOpen, onClose, applianceId, fetchAppliances }) {
    const toast = useToast();
  
    const handleDelete = async () => {
      try {
        const response = await axios.delete(
          `http://localhost:3001/deleteAppliances/${applianceId}`
        );
        
        if (response.status === 200) {
          fetchAppliances(); // Refresh the appliance list
          toast({
            title: "Success",
            description: "Appliance deleted successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          onClose(); // Close modal after successful deletion
        }
      } catch (error) {
        console.error("Error deleting appliance:", error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to delete appliance",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Appliance</ModalHeader>
          <ModalBody>
            <Text>Are you sure you want to delete this appliance? This action cannot be undone.</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  