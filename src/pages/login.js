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
  InputGroup,
  InputRightElement,
  IconButton,
  Flex,
  Text,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/login",
        formData
      );
      setMessage("Login successful");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to login");
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
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
          w="full"
          p="6"
          boxShadow="lg"
          borderRadius="md"
          bg="gray.50"
        >
          {/* Header */}
          <Box bg="blue.500" p={4} borderRadius="md" textAlign="center">
            <Flex justifyContent="center">
              <Text color="white" fontSize="24px" fontWeight="bold">
                Welcome Back Silveo!
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
          <VStack spacing={4} as="form" onSubmit={handleLogin}>
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

            {/* Login Button */}
            <Button type="submit" colorScheme="blue" w="full" size="md">
              Login
            </Button>

            {/* Redirect to Register */}
            <Button
              variant="link"
              colorScheme="blue"
              onClick={() => router.push("/register")}
            >
              Don&apos;t have an account? Sign Up
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
