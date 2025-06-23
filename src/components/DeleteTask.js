import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export default function DeleteTask({ isOpen, onClose, taskId, fetchTasks }) {
  const toast = useToast();

  const handleDelete = async () => {
    if (!taskId) return;
    try {
      const response = await axios.delete(
        `http://localhost:3001/deleteTasks/${taskId}`
      );
      if (response.status === 200) {
        fetchTasks(); // Refresh the task list after deleting
        toast({
          title: "Success",
          description: "Task deleted successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose(); // Close modal after deletion
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete task",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Are you sure you want to delete this task?</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={handleDelete}>
            Delete
          </Button>
          <Button onClick={onClose} variant="ghost">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
