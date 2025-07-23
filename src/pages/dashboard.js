import {
  Box,
  Flex,
  Text,
  Grid,
  GridItem,
  Link,
  Button,
} from "@chakra-ui/react";
import {
  FaFacebook,
  FaTwitter,
  FaEye,
  FaComments,
  FaFileInvoiceDollar,
  FaWrench,
} from "react-icons/fa";
import { useRouter } from "next/router";
import axios from "../api";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [bills, setBills] = useState([]);
  const [appliances, setAppliances] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [tasksRes, billsRes, appliancesRes] = await Promise.all([
        axios.get("http://localhost:3001/getTasks"),
        axios.get("http://localhost:3001/getBills"),
        axios.get("http://localhost:3001/getAppliances"),
      ]);
      setTasks(tasksRes.data);
      setBills(billsRes.data);
      setAppliances(appliancesRes.data);
    } catch (error) {
      // Optionally handle error
      console.error("Error fetching dashboard stats:", error);
    }
  };

  // Task stats
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;

  // Bill stats
  const totalBills = bills.length;
  const pendingBills = bills.filter((b) => b.status === "Pending").length;
  const paidBills = bills.filter((b) => b.status === "Paid").length;

  // Appliance stats
  const totalAssets = appliances.length;
  const maintenanceDue = appliances.filter(
    (appliance) =>
      appliance.nextMaintenanceDate &&
      new Date(appliance.nextMaintenanceDate) < new Date()
  ).length;
  const missingMaintenance = appliances.filter(
    (appliance) => !appliance.nextMaintenanceDate
  ).length;

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
          { label: "Assets", href: "appliance" },
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
        <Flex justify="center" w="100%">
          <Grid
            templateColumns="repeat(3, 1fr)"
            gap={8}
            mb={10}
            maxW="1100px"
            mx="auto"
            w="100%"
          >
            <GridItem
              bg="blue.500"
              p={10}
              borderRadius="2xl"
              color="white"
              boxShadow="2xl"
            >
              <Flex align="center" justify="space-between" mb={4}>
                <Text fontSize="4xl" fontWeight="bold">
                  {totalTasks}
                </Text>
                <FaComments size="48px" />
              </Flex>
              <Text fontSize="2xl" fontWeight="semibold">
                Total Tasks
              </Text>
              <Text fontSize="lg" mt={2}>
                Pending: <b>{pendingTasks}</b>
              </Text>
              <Text fontSize="lg">
                Completed: <b>{completedTasks}</b>
              </Text>
              {/* Task List inside the card, polished and aligned */}
              <Box
                mt={4}
                bg="white"
                borderRadius="lg"
                p={2}
                color="gray.800"
                minH="60px"
                maxH="120px"
                overflowY="auto"
                w="100%"
              >
                {tasks.length === 0 ? (
                  <Text color="gray.400" fontSize="sm">
                    No tasks found.
                  </Text>
                ) : (
                  tasks.map((task, idx) => (
                    <Box
                      key={task._id}
                      px={2}
                      py={1}
                      borderRadius="md"
                      bg="gray.50"
                      boxShadow="xs"
                      mb={idx !== tasks.length - 1 ? 2 : 0}
                      textAlign="left"
                    >
                      <Text fontWeight="bold" fontSize="sm">
                        {task.title}
                      </Text>
                      <Text color="gray.500" fontSize="sm">
                        Due:{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "-"}
                      </Text>
                      <Text
                        color={
                          task.status === "Completed"
                            ? "green.600"
                            : "yellow.600"
                        }
                        fontSize="sm"
                      >
                        Status: {task.status}
                      </Text>
                      {idx !== tasks.length - 1 && (
                        <Box
                          borderBottom="1px solid"
                          borderColor="gray.200"
                          mt={2}
                        />
                      )}
                    </Box>
                  ))
                )}
              </Box>
            </GridItem>
            <GridItem
              bg="purple.500"
              p={10}
              borderRadius="2xl"
              color="white"
              boxShadow="2xl"
            >
              <Flex align="center" justify="space-between" mb={4}>
                <Text fontSize="4xl" fontWeight="bold">
                  {totalBills}
                </Text>
                <FaFileInvoiceDollar size="48px" />
              </Flex>
              <Text fontSize="2xl" fontWeight="semibold">
                Total Bills
              </Text>
              <Text fontSize="lg" mt={2}>
                Pending: <b>{pendingBills}</b>
              </Text>
              <Text fontSize="lg">
                Paid: <b>{paidBills}</b>
              </Text>
              {/* Bill List inside the card, polished and aligned */}
              <Box
                mt={4}
                bg="white"
                borderRadius="lg"
                p={2}
                color="gray.800"
                minH="60px"
                maxH="120px"
                overflowY="auto"
                w="100%"
              >
                {bills.length === 0 ? (
                  <Text color="gray.400" fontSize="sm">
                    No bills found.
                  </Text>
                ) : (
                  bills.map((bill, idx) => (
                    <Box
                      key={bill._id}
                      px={2}
                      py={1}
                      borderRadius="md"
                      bg="gray.50"
                      boxShadow="xs"
                      mb={idx !== bills.length - 1 ? 2 : 0}
                      textAlign="left"
                    >
                      <Text fontWeight="bold" fontSize="sm">
                        {bill.billType}
                      </Text>
                      <Text color="gray.500" fontSize="sm">
                        Due:{" "}
                        {bill.dueDate
                          ? new Date(bill.dueDate).toLocaleDateString()
                          : "-"}
                      </Text>
                      <Text
                        color={
                          bill.status === "Paid" ? "green.600" : "yellow.600"
                        }
                        fontSize="sm"
                      >
                        Status: {bill.status}
                      </Text>
                      {idx !== bills.length - 1 && (
                        <Box
                          borderBottom="1px solid"
                          borderColor="gray.200"
                          mt={2}
                        />
                      )}
                    </Box>
                  ))
                )}
              </Box>
            </GridItem>
            <GridItem
              bg="teal.400"
              p={10}
              borderRadius="2xl"
              color="white"
              boxShadow="2xl"
            >
              <Flex align="center" justify="space-between" mb={4}>
                <Text fontSize="4xl" fontWeight="bold">
                  {totalAssets}
                </Text>
                <FaWrench size="48px" />
              </Flex>
              <Text fontSize="2xl" fontWeight="semibold">
                Total Assets
              </Text>
              <Text fontSize="lg" mt={2}>
                Maintenance Due: <b>{maintenanceDue}</b>
              </Text>
              <Text fontSize="lg">
                Missing Maintenance Date: <b>{missingMaintenance}</b>
              </Text>
              {/* Asset List inside the card, perfectly aligned with other cards */}
              <Box
                mt={4}
                bg="white"
                borderRadius="lg"
                p={2}
                color="gray.800"
                minH="60px"
                maxH="120px"
                overflowY="auto"
                w="100%"
              >
                {appliances.length === 0 ? (
                  <Text color="gray.400" fontSize="sm">
                    No assets found.
                  </Text>
                ) : (
                  appliances.map((appliance, idx) => (
                    <Box
                      key={appliance._id}
                      px={2}
                      py={1}
                      borderRadius="md"
                      bg="gray.50"
                      boxShadow="xs"
                      mb={idx !== appliances.length - 1 ? 2 : 0}
                      textAlign="left"
                    >
                      <Text fontWeight="bold" fontSize="sm">
                        {appliance.name}
                      </Text>
                      <Text color="gray.500" fontSize="sm">
                        Brand: {appliance.brand || "-"}
                      </Text>
                      {idx !== appliances.length - 1 && (
                        <Box
                          borderBottom="1px solid"
                          borderColor="gray.200"
                          mt={2}
                        />
                      )}
                    </Box>
                  ))
                )}
              </Box>
            </GridItem>
          </Grid>
        </Flex>
      </Box>
    </Flex>
  );
}
