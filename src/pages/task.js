// task.js

import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Link,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaPlus, FaTrash, FaEdit, FaBars } from "react-icons/fa";
import { useRouter } from "next/router";
import axios from "../api"; // Use the shared axios instance
import AddTask from "@/components/AddTask";
import EditTask from "@/components/EditTask";
import DeleteTask from "@/components/DeleteTask";

export default function TaskPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Modal state controls
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isSidebarOpen,
    onOpen: onSidebarOpen,
    onClose: onSidebarClose,
  } = useDisclosure();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    console.log("Token in localStorage:", token);
    console.log("Fetching tasks...");
    try {
      const response = await axios.get("http://localhost:3001/getTasks");
      console.log("Tasks response:", response);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Open Edit Modal and set the selected task
  const handleEdit = (task) => {
    setSelectedTask(task);
    onEditOpen();
  };

  // Open Delete Modal and set the selected task ID
  const handleDelete = (task) => {
    setSelectedTask(task);
    onDeleteOpen();
  };

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
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
        }}
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
    <Flex>
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
      <Box flex="1" p={{ base: 2, md: 6 }} bg="gray.50" minH="100vh">
        {/* Header */}
        <Flex
          justify="space-between"
          mb={6}
          align="center"
          mt={{ base: 16, md: 0 }}
        >
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
            Tasks
          </Text>
        </Flex>

        {/* Tasks List */}
        {["Pending", "Completed"].map((status) => (
          <Box key={status} mb="6">
            <Text fontSize="lg" fontWeight="bold" mb={3}>
              {status}
            </Text>
            <Box overflowX="auto">
              <Table
                variant="simple"
                bg="white"
                boxShadow="md"
                borderRadius="md"
                minW="600px"
              >
                <Thead>
                  <Tr>
                    <Th fontSize={{ base: "xs", md: "sm" }}>Title</Th>
                    <Th
                      fontSize={{ base: "xs", md: "sm" }}
                      display={{ base: "none", md: "table-cell" }}
                    >
                      Description
                    </Th>
                    <Th fontSize={{ base: "xs", md: "sm" }}>Due Date</Th>
                    <Th fontSize={{ base: "xs", md: "sm" }}>Status</Th>
                    <Th fontSize={{ base: "xs", md: "sm" }}>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task) => (
                      <Tr key={task._id}>
                        <Td
                          fontSize={{ base: "xs", md: "sm" }}
                          maxW="150px"
                          isTruncated
                        >
                          {task.title}
                        </Td>
                        <Td
                          display={{ base: "none", md: "table-cell" }}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          {Array.isArray(task.description) ? (
                            <ul>
                              {task.description.map((desc, idx) => (
                                <li key={idx}>{desc}</li>
                              ))}
                            </ul>
                          ) : (
                            task.description || "N/A"
                          )}
                        </Td>
                        <Td fontSize={{ base: "xs", md: "sm" }}>
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "No Due Date"}
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={
                              task.status === "Completed" ? "green" : "yellow"
                            }
                            size={{ base: "sm", md: "md" }}
                          >
                            {task.status}
                          </Badge>
                        </Td>
                        <Td>
                          <Flex gap={1}>
                            <IconButton
                              icon={<FaEdit />}
                              colorScheme="blue"
                              size={{ base: "xs", md: "sm" }}
                              onClick={() => handleEdit(task)}
                            />
                            <IconButton
                              icon={<FaTrash />}
                              colorScheme="red"
                              size={{ base: "xs", md: "sm" }}
                              onClick={() => handleDelete(task)}
                            />
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Modals */}
      <AddTask
        isOpen={isAddOpen}
        onClose={onAddClose}
        fetchTasks={fetchTasks}
      />

      {selectedTask && (
        <EditTask
          isOpen={isEditOpen}
          onClose={onEditClose}
          task={selectedTask}
          fetchTasks={fetchTasks}
        />
      )}

      {selectedTask && (
        <DeleteTask
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          taskId={selectedTask._id}
          fetchTasks={fetchTasks}
        />
      )}
    </Flex>
  );
}
