import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useToast,
  Select,
  Flex,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export default function AddTask({ fetchTasks }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await axios.post("http://localhost:3001/addTasks", {
        title,
        description,
        dueDate,
        status,
      });

      if (response.status === 201) {
        fetchTasks(); // Refresh the table after adding
        toast({
          title: "Success",
          description: "Task added successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();

        // ✅ Clear form fields after successful submission
        setTitle("");
        setDescription("");
        setDueDate("");
        setStatus("Pending");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {/* Add Task Button */}
      <Box p="6" bg="gray.50">
        <Flex justify="space-between" mb="6" align="center">
          <Button colorScheme="yellow" onClick={onOpen}>
            New Task
          </Button>
        </Flex>
      </Box>
      {/* Modal for Adding Tasks */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>Add New Task</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Title */}
              <FormControl mb={4} isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                />
              </FormControl>

              {/* Description */}
              <FormControl mb={4}>
                <FormLabel>Description</FormLabel>
                <Input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task description"
                />
              </FormControl>

              {/* Due Date */}
              <FormControl mb={4}>
                <FormLabel>Due Date</FormLabel>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </FormControl>

              {/* Status */}
              <FormControl mb={4} isRequired>
                <FormLabel>Status</FormLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </Select>
              </FormControl>
            </ModalBody>

            {/* Footer Buttons */}
            <ModalFooter>
              <Button colorScheme="teal" mr={3} type="submit">
                Save
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
