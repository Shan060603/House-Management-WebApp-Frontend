import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Avatar,
  Spinner,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Link,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import axios from "../api";
import { useRouter } from "next/router";
import EditEmail from "../components/EditEmail";
import EditPassword from "../components/EditPassword";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [emailForm, setEmailForm] = useState({ newEmail: "" });
  const toast = useToast();
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const {
    isOpen: isSidebarOpen,
    onOpen: onSidebarOpen,
    onClose: onSidebarClose,
  } = useDisclosure();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3001/me");
        setUser(res.data);
      } catch (error) {
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        if (!storedUser) {
          router.push("/login");
          return;
        }
        setUser(storedUser);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleEdit = () => {
    setEditData({
      fullName: user.fullName || "",
      address: user.address || "",
      work: user.work || "",
      image: null,
    });
    setImagePreview(user.image || "");
    setEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setEditData((prev) => ({ ...prev, image: files[0] }));
      if (files && files[0]) {
        setImagePreview(URL.createObjectURL(files[0]));
      }
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(editData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      const res = await axios.put(
        `http://localhost:3001/user/${user._id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUser(res.data);
      setEditing(false);
      toast({ title: "Profile updated", status: "success", duration: 3000 });
    } catch (error) {
      toast({
        title: "Failed to update profile",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Password change handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };
  const submitPasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3001/user/${user._id}/password`,
        passwordForm
      );
      toast({ title: "Password updated", status: "success", duration: 3000 });
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (error) {
      toast({
        title: error.response?.data?.message || "Failed to update password",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Email update handlers
  const handleEmailChange = (e) => {
    setEmailForm({ newEmail: e.target.value });
  };
  const submitEmailChange = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:3001/user/${user._id}/email`,
        emailForm
      );
      setUser(res.data);
      toast({ title: "Email updated", status: "success", duration: 3000 });
      setShowEmailModal(false);
      setEmailForm({ newEmail: "" });
    } catch (error) {
      toast({
        title: error.response?.data?.message || "Failed to update email",
        status: "error",
        duration: 3000,
      });
    }
  };

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!user) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Text>User not found. Please log in.</Text>
      </Flex>
    );
  }

  const navigationItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Tasks", href: "/task" },
    { label: "Assets", href: "/appliance" },
    { label: "Bill", href: "/bill" },
    { label: "Inventory", href: "/inventory" },
    { label: "Calendar", href: "/calendar" },
    { label: "Users", href: "/user" },
  ];

  const SidebarContent = () => (
    <>
      <Text fontSize="24px" fontWeight="bold" mb="4">
        Family Hub
      </Text>
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          w="full"
          px={5}
          py={3}
          color="white"
          _hover={{ bg: "teal.500" }}
          href={item.href}
          onClick={isMobile ? onSidebarClose : undefined}
        >
          {item.label}
        </Link>
      ))}
      <Button
        onClick={() => router.push("/login")}
        bg="red.500"
        color="white"
        mt="auto"
        w="full"
        _hover={{ bg: "red.600" }}
      >
        Logout
      </Button>
    </>
  );

  return (
    <Flex h="100vh">
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          icon={<FaBars />}
          onClick={onSidebarOpen}
          position="fixed"
          top="20px"
          left="20px"
          zIndex="1002"
          bg="purple.700"
          color="white"
          _hover={{ bg: "purple.600" }}
          size="lg"
          borderRadius="md"
        />
      )}

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isSidebarOpen}
        onClose={onSidebarClose}
        placement="left"
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent bg="purple.700" color="white">
          <DrawerCloseButton color="white" />
          <DrawerHeader>
            <Text fontSize="24px" fontWeight="bold">
              Family Hub
            </Text>
          </DrawerHeader>
          <DrawerBody p={0}>
            <Flex direction="column" h="full" p={4}>
              <SidebarContent />
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Flex
          w="250px"
          bg="purple.700"
          color="white"
          p="4"
          minH="100vh"
          direction="column"
        >
          <SidebarContent />
        </Flex>
      )}
      {/* Main Content */}
      <Box
        flex="1"
        p={{ base: 2, md: 0 }}
        bg="gray.50"
        display="flex"
        alignItems="center"
        justifyContent="center"
        mt={{ base: 16, md: 0 }}
      >
        <Box
          w="100%"
          maxW="400px"
          p={6}
          bg="white"
          borderRadius="lg"
          boxShadow="lg"
        >
          <Avatar
            size="2xl"
            name={user.fullName}
            src={
              editing
                ? imagePreview
                : user.image
                ? `http://localhost:3001${user.image}`
                : undefined
            }
            mb={4}
            bg="gray.200"
          />
          {editing ? (
            <form
              onSubmit={handleEditSave}
              style={{ width: "100%" }}
              encType="multipart/form-data"
            >
              <VStack spacing={3}>
                <FormControl>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    name="fullName"
                    value={editData.fullName}
                    onChange={handleEditChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Address</FormLabel>
                  <Input
                    name="address"
                    value={editData.address}
                    onChange={handleEditChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Work</FormLabel>
                  <Input
                    name="work"
                    value={editData.work}
                    onChange={handleEditChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Profile Image</FormLabel>
                  <Input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleEditChange}
                  />
                </FormControl>
                <Button type="submit" colorScheme="blue" w="full">
                  Save
                </Button>
                <Button w="full" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </VStack>
            </form>
          ) : (
            <>
              <Text fontSize="2xl" fontWeight="bold">
                {user.fullName}
              </Text>
              <Text color="gray.500">{user.email}</Text>
            </>
          )}
          {!editing && (
            <Box mb={2}>
              <Text fontWeight="bold">Role:</Text>
              <Text mb={2}>{user.role}</Text>
              <Text fontWeight="bold">Address:</Text>
              <Text mb={2}>{user.address || "-"}</Text>
              <Text fontWeight="bold">Work:</Text>
              <Text mb={2}>{user.work || "-"}</Text>
            </Box>
          )}
          {!editing && (
            <>
              <Button colorScheme="blue" w="full" mt={4} onClick={handleEdit}>
                Edit Profile
              </Button>
              <Button
                colorScheme="yellow"
                w="full"
                mt={2}
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </Button>
              <Button
                colorScheme="purple"
                w="full"
                mt={2}
                onClick={() => setShowEmailModal(true)}
              >
                Update Email
              </Button>
            </>
          )}
          <Button
            colorScheme="gray"
            w="full"
            mt={2}
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </Button>

          {/* Password Change Modal */}
          <EditPassword
            isOpen={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
            userId={user._id}
            onSuccess={() => {
              setShowPasswordModal(false);
            }}
          />
          {/* Email Update Modal */}
          <EditEmail
            isOpen={showEmailModal}
            onClose={() => setShowEmailModal(false)}
            userId={user._id}
            onSuccess={(updatedUser) => {
              setUser(updatedUser);
              setShowEmailModal(false);
            }}
          />
        </Box>
      </Box>
    </Flex>
  );
}
