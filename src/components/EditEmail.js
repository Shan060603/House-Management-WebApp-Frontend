import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "../api";

export default function EditEmail({ isOpen, onClose, userId, onSuccess }) {
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:3001/user/${userId}/email`,
        { newEmail }
      );
      toast({ title: "Email updated", status: "success", duration: 3000 });
      setNewEmail("");
      onSuccess(res.data);
      onClose();
    } catch (error) {
      toast({
        title: error.response?.data?.message || "Failed to update email",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Email</ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormControl>
              <FormLabel>New Email</FormLabel>
              <Input
                name="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="purple"
              mr={3}
              type="submit"
              isLoading={loading}
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
