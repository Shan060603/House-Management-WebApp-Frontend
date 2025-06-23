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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export default function EditBill({ isOpen, onClose, bill, fetchBills }) {
  const [formData, setFormData] = useState({
    billType: "",
    amount: "",
    dueDate: "",
    status: "Pending",
  });

  const toast = useToast();

  useEffect(() => {
    if (bill) {
      setFormData({
        billType: bill.billType || "",
        amount: bill.amount || "",
        dueDate: bill.dueDate ? bill.dueDate.split("T")[0] : "",
        status: bill.status || "Pending",
      });
    }
  }, [bill]); // Update form when bill changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmountChange = (value) => {
    setFormData({ ...formData, amount: value });
  };

  const updateBill = async () => {
    if (!bill) return;
    
    if (!formData.billType || !formData.amount || !formData.dueDate) {
      toast({
        title: "Required fields missing",
        description: "Please fill all required fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.put(
  `https://house-management-webapp-backend.onrender.com/updateBills/${bill._id}`,
  formData
);

      
      if (response.status === 200) {
        fetchBills(); // Refresh the bills list
        toast({
          title: "Success",
          description: "Bill updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose(); // Close modal after successful update
      }
    } catch (error) {
      console.error("Error updating bill:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update bill",
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
        <ModalHeader>Edit Bill</ModalHeader>
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
          <Button colorScheme="blue" mr={3} onClick={updateBill}>
            Save Changes
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
