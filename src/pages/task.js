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
} from "@chakra-ui/react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { useRouter } from "next/router";
import axios from "axios";
import AddTask from "@/components/AddTask";
import EditTask from "@/components/EditTask";
import DeleteTask from "@/components/DeleteTask";

export default function TaskPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

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

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3001/gettasks"); // ✅ Updated port
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

  return (
    <Flex>
      {/* Sidebar */}
      <Flex
        w="250px"
        bg="purple.700"
        color="white"
        p="4"
        minH="100vh"
        direction="column"
      >
        <Text fontSize="24px" fontWeight="bold" mb="4">
          Family Hub
        </Text>
        {[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Tasks", href: "/task" },
          { label: "Appliance", href: "/appliance" },
          { label: "Bill", href: "/bills" },
          { label: "Inventory", href: "/inventory" },
          { label: "Calendar", href: "/calendar" },
          { label: "Users", href: "/user" },
        ].map((item) => (
          <Link
            key={item.href}
            w="full"
            px={5}
            py={3}
            color="white"
            _hover={{ bg: "teal.500" }}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}

        {/* Logout */}
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
      </Flex>

      {/* Main Content */}
      <Box flex="1" p="6" bg="gray.50">
        {/* Header */}
        <Flex justify="space-between" mb="6" align="center">
          <Text fontSize="2xl" fontWeight="bold">
            Tasks
          </Text>
        </Flex>

        {/* Tasks List */}
        {["Pending", "Completed"].map((status) => (
          <Box key={status} mb="6">
            <Text fontSize="lg" fontWeight="bold" mb="3">
              {status}
            </Text>
            <Table variant="simple" bg="white" boxShadow="md" borderRadius="md">
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Description</Th>
                  <Th>Due Date</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <Tr key={task._id}>
                      <Td>{task.title}</Td>
                      <Td>{task.description || "N/A"}</Td>
                      <Td>
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No Due Date"}
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={
                            task.status === "Completed" ? "green" : "yellow"
                          }
                        >
                          {task.status}
                        </Badge>
                      </Td>
                      <Td>
                        <Flex gap={2}>
                          <IconButton
                            icon={<FaEdit />}
                            colorScheme="blue"
                            size="sm"
                            onClick={() => handleEdit(task)}
                          />
                          <IconButton
                            icon={<FaTrash />}
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleDelete(task)}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
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
