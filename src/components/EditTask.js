import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  ModalFooter,
  Select,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export default function EditTask({ isOpen, onClose, task, fetchTasks }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending",
  });

  const toast = useToast();

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        status: task.status || "Pending",
      });
    }
  }, [task]); // Update form when task changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateTask = async () => {
    if (!task) return;
    try {
      const response = await axios.put(
        `http://localhost:3001/updateTasks/${task._id}`,
        formData
      );
      if (response.status === 200) {
        fetchTasks(); // Refresh the task list
        toast({
          title: "Success",
          description: "Task updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose(); // Close modal after successful update
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update task",
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
        <ModalHeader>Edit Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Title */}
          <FormControl mb={4} isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
            />
          </FormControl>

          {/* Description */}
          <FormControl mb={4}>
            <FormLabel>Description</FormLabel>
            <Input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
            />
          </FormControl>

          {/* Due Date */}
          <FormControl mb={4}>
            <FormLabel>Due Date</FormLabel>
            <Input
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </FormControl>

          {/* Status */}
          <FormControl mb={4} isRequired>
            <FormLabel>Status</FormLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={updateTask}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
