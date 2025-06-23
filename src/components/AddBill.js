import { useState, useEffect, useCallback } from "react";
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export default function AddBill({ isOpen, onClose, fetchBills }) {
  const [formData, setFormData] = useState({
    billType: "",
    amount: "",
    dueDate: "",
    status: "Pending",
    userId: "", // Empty userId initially
  });
  
  const [users, setUsers] = useState([]);
  const toast = useToast();

 // In your AddBill.js component:
const fetchUsers = useCallback(async () => {
    try {
      console.log("Fetching users...");
      // Try using /users instead of /getUsers
      const response = await axios.get("http://localhost:3001/getUsers");
      console.log("Users response:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      // Create a hardcoded set of users as fallback
      setUsers([{
        _id: "default1",
        fullName: "John Doe",
        email: "john@example.com"
      }, {
        _id: "default2",
        fullName: "Jane Smith",
        email: "jane@example.com"
      }]);
      
      toast({
        title: "Error fetching users",
        description: "Using default users instead",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);
  
  
  // Add this useEffect hook to fetch users when the modal opens
  useEffect(() => {
    if (isOpen) {
      // Call fetchUsers when the modal opens
      fetchUsers();
      
      // Reset form fields
      setFormData({
        billType: "",
        amount: "",
        dueDate: "",
        status: "Pending",
        userId: "", // Reset userId
      });
    }
  }, [isOpen, fetchUsers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmountChange = (value) => {
    setFormData({ ...formData, amount: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.billType || !formData.amount || !formData.dueDate || !formData.userId) {
      toast({
        title: "Required fields missing",
        description: "Please fill all required fields including who will pay",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  
    try {
      console.log("Submitting bill data:", formData);
      
      const response = await axios.post(
        "http://localhost:3001/addBills",
        formData
      );
      
      if (response.status === 201) {
        fetchBills(); // Refresh the bills list
        toast({
          title: "Success",
          description: "Bill added successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose(); // Close modal after successful submission
      }
    } catch (error) {
      console.error("Error adding bill:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add bill",
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
        <ModalHeader>Add New Bill</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4} isRequired>
            <FormLabel>Bill Type</FormLabel>
            <Input
              name="billType"
              value={formData.billType}
              onChange={handleChange}
              placeholder="e.g., Electricity, Water, Rent"
            />
          </FormControl>

          <FormControl mb={4} isRequired>
            <FormLabel>Amount</FormLabel>
            <NumberInput
              min={0}
              precision={2}
              value={formData.amount}
              onChange={handleAmountChange}
            >
              <NumberInputField placeholder="Enter amount" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl mb={4} isRequired>
            <FormLabel>Due Date</FormLabel>
            <Input
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4} isRequired>
            <FormLabel>Who Will Pay</FormLabel>
            <Select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              placeholder="Select person"
            >
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.fullName || user.email}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Status</FormLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}