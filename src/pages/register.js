import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Box,
  Input,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Divider,
  Select,
  InputGroup,
  InputRightElement,
  IconButton,
  Flex,
  Text,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    contact: "",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/register",
        formData
      );
      setMessage(response.data.message || "Registration successful");
      setTimeout(() => router.push("/"), 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
      if (error.response?.status === 409) {
        setError("User already exists with the provided email.");
      } else {
        setError("Failed to register. Please try again.");
      }
    }
  };

  return (
    <>
      <Head>
        <title>Register</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Background */}
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        bg="blue.400" // Background color outside the box
        //bgImage="url('/background.jpg')" // Background image path
        //bgSize="cover" // Cover the whole background
        //bgPosition="center" // Center the image
        //bgRepeat="no-repeat" // Avoid image repetition
      >
        <Box
          maxW="400px"
          mx="auto"
          mt="80px"
          p="6"
          boxShadow="lg"
          borderRadius="md"
          bg="gray.50"
        >
          {/* Header */}
          <Box bg="blue.400" p={4} borderRadius="md" textAlign="center">
            <Flex justifyContent="center">
              <Text color="white" fontSize="24px" fontWeight="bold">
                Welcome to Silveo Family!
              </Text>
            </Flex>
          </Box>

          <Divider my={4} />

          {/* Error Message */}
          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}

          {/* Form */}
          <VStack spacing={4} as="form" onSubmit={handleRegister}>
            <FormControl>
              <FormLabel>Full Name</FormLabel>
              <Input
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
                bg="white"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                bg="white"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  bg="white"
                />
                <InputRightElement>
                  <IconButton
                    size="sm"
                    aria-label="Show password"
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Role</FormLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Select Role"
                required
                bg="white"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Contact</FormLabel>
              <Input
                type="tel"
                name="contact"
                placeholder="00000000000"
                value={formData.contact}
                onChange={handleChange}
                required
                bg="white"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input
                name="address"
                placeholder="123 Main St, City, Country"
                value={formData.address}
                onChange={handleChange}
                required
                bg="white"
              />
            </FormControl>

            {/* Register Button */}
            <Button type="submit" colorScheme="blue" w="full" size="md">
              Register
            </Button>

            {/* Login Redirect */}
            <Button
              variant="link"
              colorScheme="blue"
              onClick={() => router.push("/login")}
            >
              Already have an account? Sign In
            </Button>
          </VStack>

          {/* Success Message */}
          {message && (
            <Text color="green.500" mt={4} textAlign="center">
              {message}
            </Text>
          )}
        </Box>
      </Flex>
    </>
  );
}
