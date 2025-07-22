import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Grid,
  GridItem,
  Link,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaWrench,
  FaCalendarAlt,
} from "react-icons/fa";
import { useRouter } from "next/router";
import axios from "../api"; // Use the shared axios instance
import AddAppliance from "@/components/AddAppliance";
import EditAppliance from "@/components/EditAppliance";
import DeleteAppliance from "@/components/DeleteAppliance";

export default function AppliancePage() {
  const [appliances, setAppliances] = useState([]);
  const [selectedAppliance, setSelectedAppliance] = useState(null);
  const router = useRouter();
  const toast = useToast(); // Initialize the toast hook at the top level of the component

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
    fetchAppliances();
  }, []);

  const fetchAppliances = async () => {
    const token = localStorage.getItem("token");
    console.log("Token in localStorage:", token);
    console.log("Fetching appliances...");
    try {
      const response = await axios.get("http://localhost:3001/getAppliances");
      console.log("Appliances response:", response);
      setAppliances(response.data); // Assuming response.data contains the array of appliances
    } catch (error) {
      console.error("Error fetching appliances:", error);
      toast({
        title: "Error",
        description: "Failed to fetch appliances. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left", // You can adjust the position as needed
      });
    }
  };

  const handleEdit = (appliance) => {
    console.log("Selected Appliance:", appliance); // Log to check the appliance data
    setSelectedAppliance(appliance);
    onEditOpen();
  };
  const handleDelete = (appliance) => {
    console.log("Deleting appliance with ID:", appliance._id); // Log the ID
    setSelectedAppliance(appliance);
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
          { label: "Assets", href: "/appliance" },
          { label: "Bill", href: "/bill" },
          { label: "Expenses", href: "/expense" },
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
        {/* Header with "Add Appliance" Button */}
        <Flex justify="space-between" mb="6" align="center">
          <Text fontSize="2xl" fontWeight="bold">
            Assets
          </Text>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="yellow"
            onClick={onAddOpen}
            borderRadius="md"
            px={4}
            py={2}
          >
            Add Assets
          </Button>
        </Flex>

        {/* Dashboard Section */}
        <Grid templateColumns="repeat(3, 1fr)" gap={4} mb={6}>
          <GridItem bg="teal.400" p="4" borderRadius="md" color="white">
            <Flex align="center" justify="space-between">
              <Text fontSize="lg">{appliances.length}</Text>
              <FaWrench size="24px" />
            </Flex>
            <Text>Total Assets</Text>
          </GridItem>
          <GridItem bg="orange.400" p="4" borderRadius="md" color="white">
            <Flex align="center" justify="space-between">
              <Text fontSize="lg">
                {
                  appliances.filter(
                    (appliance) =>
                      appliance.nextMaintenanceDate && // Check for existence here
                      new Date(appliance.nextMaintenanceDate) < new Date()
                  ).length
                }
              </Text>
              <FaCalendarAlt size="24px" />
            </Flex>
            <Text>Maintenance Due</Text>
          </GridItem>
          <GridItem bg="red.400" p="4" borderRadius="md" color="white">
            <Flex align="center" justify="space-between">
              <Text fontSize="lg">
                {
                  appliances.filter(
                    (appliance) => !appliance.nextMaintenanceDate
                  ).length
                }
              </Text>
              <FaTrash size="24px" />
            </Flex>
            <Text>Missing Maintenance Date</Text>
          </GridItem>
        </Grid>

        {/* Appliance Table */}
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Brand</Th>
              <Th>Date Bought</Th>
              <Th>Next Maintenance</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {appliances.map((appliance) => (
              <Tr key={appliance._id}>
                <Td>{appliance.name}</Td>
                <Td>{appliance.brand}</Td>
                <Td>{new Date(appliance.dateBought).toLocaleDateString()}</Td>
                <Td>
                  {appliance.nextMaintenanceDate
                    ? new Date(
                        appliance.nextMaintenanceDate
                      ).toLocaleDateString()
                    : "N/A"}
                </Td>
                <Td>
                  <IconButton
                    icon={<FaEdit />}
                    onClick={() => handleEdit(appliance)}
                    mr={2}
                  />
                  <IconButton
                    icon={<FaTrash />}
                    colorScheme="red"
                    onClick={() => handleDelete(appliance)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Modals */}
        <AddAppliance
          isOpen={isAddOpen}
          onClose={onAddClose}
          fetchAppliances={fetchAppliances}
        />
        {selectedAppliance && ( // Conditionally render EditAppliance
          <EditAppliance
            isOpen={isEditOpen}
            onClose={onEditClose}
            appliance={selectedAppliance} // Pass the entire appliance object
            fetchAppliances={fetchAppliances}
          />
        )}

        {selectedAppliance && (
          <DeleteAppliance
            isOpen={isDeleteOpen}
            onClose={onDeleteClose}
            applianceId={selectedAppliance._id}
            fetchAppliances={fetchAppliances}
          />
        )}
      </Box>
    </Flex>
  );
}
