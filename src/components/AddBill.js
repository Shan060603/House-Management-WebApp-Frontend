import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  Select,
  useToast,
} from "@chakra-ui/react";
import axios from "../api"; // Use the shared axios instance

export default function AddBill({ isOpen, onClose, fetchBills }) {
  const [form, setForm] = useState({
    billType: "",
    amount: "",
    dueDate: "",
    status: "Pending",
  });
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || user._id; // Adjust based on your login response
      await axios.post("http://localhost:3001/addBills", {
        ...form,
        amount: Number(form.amount),
        userId, // <-- add this
      });
      toast({
        title: "Success",
        description: "Bill added successfully!",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setForm({ billType: "", amount: "", dueDate: "", status: "Pending" });
      fetchBills();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add bill.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Bill</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>Type</FormLabel>
              <Input
                name="billType"
                value={form.billType}
                onChange={handleChange}
                placeholder="e.g. Electricity"
              />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Amount</FormLabel>
              <Input
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                min={0}
              />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Due Date</FormLabel>
              <Input
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb={2} isRequired>
              <FormLabel>Status</FormLabel>
              <Select name="status" value={form.status} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} type="submit" isLoading={loading}>
              Add
            </Button>
            <Button onClick={onClose} variant="ghost">
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
