import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
} from "@chakra-ui/react";
import axios from "../api"; // Use the shared axios instance

export default function DeleteAppliance({
  isOpen,
  onClose,
  applianceId,
  fetchAppliances,
}) {
  const toast = useToast();

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/deleteAppliances/${applianceId}`
      );
      console.log("Appliance deleted successfully:", response.data);
      fetchAppliances(); // Refresh the appliance list after deletion
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error deleting appliance:", error);
      toast({
        title: "Error",
        description: "Error deleting appliance. Please try again.",
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
        <ModalCloseButton />
        <ModalBody>Are you sure you want to delete this appliance?</ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={handleDelete}>
            Delete
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
