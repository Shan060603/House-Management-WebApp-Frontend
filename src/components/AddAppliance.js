import { useState, useEffect } from "react";
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
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export default function AddAppliance({ isOpen, onClose, fetchAppliances }) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [dateBought, setDateBought] = useState("");
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState("");
  const toast = useToast();

  // Reset form fields when modal opens
  useEffect(() => {
    if (isOpen) {
      // Clear form when modal opens
      setName("");
      setBrand("");
      setDateBought("");
      setNextMaintenanceDate("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !dateBought) {
      toast({
        title: "Error",
        description: "Name and Date Bought are required.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post("https://house-management-webapp-backend.onrender.com/addAppliances", {
        name,
        brand,
        dateBought,
        nextMaintenanceDate,
      });

      console.log("Appliance added successfully:", response.data);
      fetchAppliances(); // Refresh appliance list after adding
      onClose(); // Close the modal or form
    } catch (error) {
      console.error("Error adding appliance:", error);
      toast({
        title: "Error",
        description: "Error adding appliance. Please try again.",
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
        <ModalHeader>Add Appliance</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Appliance Name</FormLabel>
              <Input
                placeholder="Enter appliance name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Brand</FormLabel>
              <Input
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Date Bought</FormLabel>
              <Input
                type="date"
                value={dateBought}
                onChange={(e) => setDateBought(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Next Maintenance Date</FormLabel>
              <Input
                type="date"
                value={nextMaintenanceDate}
                onChange={(e) => setNextMaintenanceDate(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit">
              Add
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
