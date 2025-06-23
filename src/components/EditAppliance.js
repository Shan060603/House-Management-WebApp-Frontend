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
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export default function EditAppliance({ isOpen, onClose, appliance, fetchAppliances }) {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    dateBought: "",
    nextMaintenanceDate: "",
  });

  const toast = useToast();

  useEffect(() => {
    if (appliance) {
      setFormData({
        name: appliance.name || "",
        brand: appliance.brand || "",
        dateBought: appliance.dateBought ? appliance.dateBought.split("T")[0] : "",
        nextMaintenanceDate: appliance.nextMaintenanceDate ? appliance.nextMaintenanceDate.split("T")[0] : "",
      });
    }
  }, [appliance]); // Update form when appliance changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateAppliance = async () => {
    if (!appliance) return;
    try {
      const response = await axios.put(
        `http://localhost:3001/updateAppliances/${appliance._id}`,
        formData
      );
      if (response.status === 200) {
        fetchAppliances(); // Refresh the appliance list
        toast({
          title: "Success",
          description: "Appliance updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose(); // Close modal after successful update
      }
    } catch (error) {
      console.error("Error updating appliance:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update appliance",
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
        <ModalHeader>Edit Appliance</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Name */}
          <FormControl mb={4} isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter appliance name"
            />
          </FormControl>

          {/* Brand */}
          <FormControl mb={4}>
            <FormLabel>Brand</FormLabel>
            <Input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Enter appliance brand"
            />
          </FormControl>

          {/* Date Bought */}
          <FormControl mb={4} isRequired>
            <FormLabel>Date Bought</FormLabel>
            <Input
              name="dateBought"
              type="date"
              value={formData.dateBought}
              onChange={handleChange}
            />
          </FormControl>

          {/* Next Maintenance Date */}
          <FormControl mb={4}>
            <FormLabel>Next Maintenance Date</FormLabel>
            <Input
              name="nextMaintenanceDate"
              type="date"
              value={formData.nextMaintenanceDate}
              onChange={handleChange}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={updateAppliance}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
