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
import axios from "../api"; // Use the shared axios instance

export default function EditAppliance({
  isOpen,
  onClose,
  appliance,
  fetchAppliances,
}) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [dateBought, setDateBought] = useState("");
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (appliance) {
      setName(appliance.name || "");
      setBrand(appliance.brand || "");

      const formatDateToInput = (date) => {
        // For input value
        if (!date) return "";
        const d = new Date(date);
        return d.toISOString().split("T")[0]; // YYYY-MM-DD
      };

      const formatDateToDisplay = (date) => {
        // For display/console
        if (!date) return "";
        const d = new Date(date);
        return `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d
          .getDate()
          .toString()
          .padStart(2, "0")}/${d.getFullYear()}`;
      };

      const formattedDateBought = formatDateToInput(appliance.dateBought);
      const formattedNextMaintenance = formatDateToInput(
        appliance.nextMaintenanceDate
      );

      setDateBought(formattedDateBought);
      setNextMaintenanceDate(formattedNextMaintenance);

      console.log("State updated with:", {
        name,
        brand,
        dateBought: formatDateToDisplay(appliance.dateBought), // Display formatted date
        nextMaintenanceDate: formatDateToDisplay(appliance.nextMaintenanceDate), // Display formatted date
      });
    }
  }, [appliance]);

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

    const url = `http://localhost:3001/updateAppliance/${appliance._id}`;
    console.log("Attempting to update at URL:", url); // Log the URL to be accessed

    try {
      const response = await axios.put(url, {
        name,
        brand,
        dateBought,
        nextMaintenanceDate,
      });

      console.log("Appliance updated successfully:", response.data);
      fetchAppliances(); // Refresh appliance list after updating
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error updating appliance:", error);
      toast({
        title: "Error",
        description: "Error updating appliance. Please try again.",
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
                value={dateBought} // YYYY-MM-DD for the input
                onChange={(e) => setDateBought(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Next Maintenance Date</FormLabel>
              <Input
                type="date"
                value={nextMaintenanceDate} // YYYY-MM-DD for the input
                onChange={(e) => setNextMaintenanceDate(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit">
              Update
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
