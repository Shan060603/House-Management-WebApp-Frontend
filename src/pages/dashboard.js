import {
  Box,
  Flex,
  Text,
  Grid,
  GridItem,
  Link,
  Button,
} from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaEye, FaComments } from "react-icons/fa";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();

  return (
    <Flex>
      {/* Sidebar */}
      <Flex
        w="250px"
        bg="purple.700"
        color="white"
        p="4"
        minH="100vh"
        direction="column" // Stack vertically
      >
        <Text fontSize="24px" fontWeight="bold" mb="4">
          Family Hub
        </Text>
        {[
          { label: "Dashboard", href: "dashboard" },
          { label: "Tasks", href: "task" },
          { label: "Appliance", href: "appliance" },
          { label: "Bill", href: "bill" },
          { label: "Expenses", href: "expense" },
          { label: "Inventory", href: "inventory" },
          { label: "Calendar", href: "calendar" },
          { label: "Users", href: "user" },
        ].map((item) => (
          <Link
            key={item.href}
            w="full"
            display={"block"}
            px={5}
            py={3}
            color={"white"}
            _active={{ bg: "teal.500", color: "white" }}
            _hover={{ bg: "teal.500", color: "white" }}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}

        {/* Logout Button at the Bottom */}
        <Button
          onClick={() => router.push("/login")}
          bg="red.500"
          color="white"
          mt="auto" // Push to the bottom
          w="full"
          _hover={{ bg: "red.600" }}
        >
          Logout
        </Button>
      </Flex>

      {/* Main Content */}
      <Box flex="1" p="4" bg="gray.50">
        {/* Header */}
        <Flex justify="space-between" align="center" mb="6">
          <Text fontSize="2xl" fontWeight="bold">
            Welcome, Silveo Family!
          </Text>
        </Flex>

        {/* Status Cards */}
        <Grid templateColumns="repeat(4, 1fr)" gap={4} mb={6}>
          <GridItem bg="red.400" p="4" borderRadius="md" color="white">
            <Flex align="center" justify="space-between">
              <Text fontSize="lg">95</Text>
              <FaComments size="24px" />
            </Flex>
            <Text>Comments</Text>
          </GridItem>
          <GridItem bg="blue.400" p="4" borderRadius="md" color="white">
            <Flex align="center" justify="space-between">
              <Text fontSize="lg">19</Text>
              <FaTwitter size="24px" />
            </Flex>
            <Text>Tweets</Text>
          </GridItem>
          <GridItem bg="blue.600" p="4" borderRadius="md" color="white">
            <Flex align="center" justify="space-between">
              <Text fontSize="lg">189</Text>
              <FaFacebook size="24px" />
            </Flex>
            <Text>Likes</Text>
          </GridItem>
          <GridItem bg="green.400" p="4" borderRadius="md" color="white">
            <Flex align="center" justify="space-between">
              <Text fontSize="lg">68</Text>
              <FaEye size="24px" />
            </Flex>
            <Text>Pageviews</Text>
          </GridItem>
        </Grid>

        {/* Data Overview Section */}
        <Box bg="white" p="4" borderRadius="md" boxShadow="md">
          <Text fontSize="lg" fontWeight="bold" mb="4">
            Overview
          </Text>
          <Flex justify="space-between">
            <Box>
              <Text fontSize="2xl">54</Text>
              <Text>Created</Text>
            </Box>
            <Box>
              <Text fontSize="2xl">26</Text>
              <Text>Closed</Text>
            </Box>
            <Box>
              <Text fontSize="2xl">14</Text>
              <Text>Pending</Text>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}
