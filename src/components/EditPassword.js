// EditPassword.js

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

export default function EditPassword({ isOpen, onClose, userId, onSuccess }) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:3001/user/${userId}/password`, form);
      toast({ title: "Password updated", status: "success", duration: 3000 });
      setForm({ currentPassword: "", newPassword: "" });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: error.response?.data?.message || "Failed to update password",
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
        <ModalHeader>Change Password</ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Current Password</FormLabel>
              <Input
                name="currentPassword"
                type="password"
                value={form.currentPassword}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>New Password</FormLabel>
              <Input
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
                required
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit" isLoading={loading}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
