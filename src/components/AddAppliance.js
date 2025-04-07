import { useState } from "react";
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
import axios from "axios";
export default function AddAppliance({ isOpen, onClose, fetchAppliances }) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [dateBought, setDateBought] = useState("");
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState("");
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/appliances", {
        name,
        brand,
        dateBought,
        nextMaintenanceDate,
      });

      if (response.status === 201) {
        fetchAppliances();
        toast({
          title: "Success",
          description: "Appliance added successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();

        setName("");
        setBrand("");
        setDateBought("");
        setNextMaintenanceDate("");
      }
    } catch (error) {
      console.error("Error adding appliance:", error);
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Add New Appliance</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter appliance name"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Brand</FormLabel>
              <Input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Enter appliance brand"
              />
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>Date Bought</FormLabel>
              <Input
                type="date"
                value={dateBought}
                onChange={(e) => setDateBought(e.target.value)}
              />
            </FormControl>

            <FormControl mb={4}>
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
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
