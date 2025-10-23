import { useEffect, useState, useCallback } from "react";
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
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaWrench,
  FaCalendarAlt,
  FaBars,
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
  const isMobile = useBreakpointValue({ base: true, md: false });

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

  const fetchAppliances = useCallback(async () => {
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
  }, [toast]);

  useEffect(() => {
    fetchAppliances();
  }, [fetchAppliances]);

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
        {/* Header with "Add Appliance" Button */}
        <Flex
          justify="space-between"
          mb={6}
          align="center"
          mt={{ base: 16, md: 0 }}
        >
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
            Assets
          </Text>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="yellow"
            onClick={onAddOpen}
            borderRadius="md"
            px={4}
            py={2}
            size={{ base: "sm", md: "md" }}
          >
            Add Assets
          </Button>
        </Flex>

        {/* Dashboard Section */}
        {/* Dashboard Section - Styled like Inventory.js */}
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
                    (a) =>
                      a.nextMaintenanceDate &&
                      new Date(a.nextMaintenanceDate) < new Date()
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
                {appliances.filter((a) => !a.nextMaintenanceDate).length}
              </Text>
              <FaTrash size="24px" />
            </Flex>
            <Text>Missing Maintenance Date</Text>
          </GridItem>
        </Grid>

        {/* Appliance Table */}
        <Box overflowX="auto">
          <Table variant="simple" minW="600px">
            <Thead>
              <Tr>
                <Th fontSize={{ base: "xs", md: "sm" }}>Name</Th>
                <Th
                  fontSize={{ base: "xs", md: "sm" }}
                  display={{ base: "none", md: "table-cell" }}
                >
                  Brand
                </Th>
                <Th fontSize={{ base: "xs", md: "sm" }}>Date Bought</Th>
                <Th fontSize={{ base: "xs", md: "sm" }}>Next Maintenance</Th>
                <Th fontSize={{ base: "xs", md: "sm" }}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {appliances.map((appliance) => (
                <Tr key={appliance._id}>
                  <Td
                    fontSize={{ base: "xs", md: "sm" }}
                    maxW="150px"
                    isTruncated
                  >
                    {appliance.name}
                  </Td>
                  <Td
                    fontSize={{ base: "xs", md: "sm" }}
                    display={{ base: "none", md: "table-cell" }}
                  >
                    {appliance.brand}
                  </Td>
                  <Td fontSize={{ base: "xs", md: "sm" }}>
                    {new Date(appliance.dateBought).toLocaleDateString()}
                  </Td>
                  <Td fontSize={{ base: "xs", md: "sm" }}>
                    {appliance.nextMaintenanceDate
                      ? new Date(
                          appliance.nextMaintenanceDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </Td>
                  <Td>
                    <Flex gap={1}>
                      <IconButton
                        icon={<FaEdit />}
                        onClick={() => handleEdit(appliance)}
                        size={{ base: "xs", md: "sm" }}
                      />
                      <IconButton
                        icon={<FaTrash />}
                        colorScheme="red"
                        onClick={() => handleDelete(appliance)}
                        size={{ base: "xs", md: "sm" }}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

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
