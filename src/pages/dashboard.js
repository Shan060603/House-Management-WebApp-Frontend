import {
  Box,
  Flex,
  Text,
  Grid,
  GridItem,
  Avatar,
  IconButton,
} from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaEye, FaComments } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";

export default function Dashboard() {
  return (
    <Flex>
      {/* Sidebar */}
      <Box w="250px" bg="purple.700" color="white" p="4" minH="100vh">
        <Text fontSize="24px" fontWeight="bold" mb="4">
          Family Hub
        </Text>
        <Text mb="2">Dashboard</Text>
        <Text mb="2">Tasks</Text>
        <Text mb="2">Appliance</Text>
        <Text mb="2">Bill</Text>
        <Text mb="2">Expense</Text>
        <Text mb="2">Inventory</Text>
        <Text mb="2">Calendar</Text>
        <Text mb="2">Users</Text>
      </Box>

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
          {/* Sample Data Overview */}
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
