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
  
  export default function DeleteBill({ isOpen, onClose, billId, fetchBills }) {
    const toast = useToast();
  
    const handleDelete = async () => {
      try {
        const response = await axios.delete(
  `https://house-management-webapp-backend.onrender.com/deleteBills/${billId}`
);

        
        if (response.status === 200) {
          fetchBills(); // Refresh the bills list
          toast({
            title: "Success",
            description: "Bill deleted successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          onClose(); // Close modal after successful deletion
        }
      } catch (error) {
        console.error("Error deleting bill:", error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to delete bill",
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
          <ModalHeader>Delete Bill</ModalHeader>
          <ModalBody>
            <Text>Are you sure you want to delete this bill? This action cannot be undone.</Text>
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
  