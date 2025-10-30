// bill.js

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
  Badge,
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
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaBars,
} from "react-icons/fa";
import { useRouter } from "next/router";
// Placeholder components for AddBill, EditBill, DeleteBill
// Replace with actual implementations
import AddBill from "@/components/AddBill";
import EditBill from "@/components/EditBill";
import DeleteBill from "@/components/DeleteBill";
import axios from "../api"; // Use the shared axios instance

export default function BillPage() {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const router = useRouter();
  const toast = useToast();
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

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    const token = localStorage.getItem("token");
    console.log("Token in localStorage:", token);
    console.log("Fetching bills...");
    try {
      const response = await axios.get("http://localhost:3001/getBills");
      console.log("Bills response:", response);
      setBills(response.data);
    } catch (error) {
      console.error("Error fetching bills:", error);
      toast({
        title: "Error",
        description: "Failed to fetch bills. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleEdit = (bill) => {
    setSelectedBill(bill);
    onEditOpen();
  };
  const handleDelete = (bill) => {
    setSelectedBill(bill);
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
        {/* Header with "Add Bill" Button */}
        <Flex
          justify="space-between"
          mb={6}
          align="center"
          mt={{ base: 16, md: 0 }}
        >
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
            Bills
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
            Add Bill
          </Button>
        </Flex>

        {/* Dashboard Section - Styled like Inventory.js */}
        <Grid templateColumns="repeat(3, 1fr)" gap={4} mb={6}>
          <GridItem bg="teal.400" p="4" borderRadius="md" color="white">
            <Flex align="center" justify="space-between">
              <Text fontSize="lg">{bills.length}</Text>
              <FaFileInvoiceDollar size="24px" />
            </Flex>
            <Text>Total Bills</Text>
          </GridItem>

          <GridItem bg="orange.400" p="4" borderRadius="md" color="white">
            <Flex align="center" justify="space-between">
              <Text fontSize="lg">
                {bills.filter((bill) => bill.status === "Pending").length}
              </Text>
              <FaCalendarAlt size="24px" />
            </Flex>
            <Text>Pending Bills</Text>
          </GridItem>

          <GridItem bg="green.400" p="4" borderRadius="md" color="white">
            <Flex align="center" justify="space-between">
              <Text fontSize="lg">
                {bills.filter((bill) => bill.status === "Paid").length}
              </Text>
              <FaFileInvoiceDollar size="24px" />
            </Flex>
            <Text>Paid Bills</Text>
          </GridItem>
        </Grid>

        {/* Pending Bills Section */}
        <Box mb={8}>
          <Text fontSize="lg" fontWeight="bold" mb={3}>
            Pending Bills
          </Text>
          <Box overflowX="auto">
            <Table variant="simple" minW="600px">
              <Thead>
                <Tr>
                  <Th fontSize={{ base: "xs", md: "sm" }}>Type</Th>
                  <Th fontSize={{ base: "xs", md: "sm" }}>Amount</Th>
                  <Th fontSize={{ base: "xs", md: "sm" }}>Due Date</Th>
                  <Th fontSize={{ base: "xs", md: "sm" }}>Status</Th>
                  <Th fontSize={{ base: "xs", md: "sm" }}>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {bills
                  .filter((bill) => bill.status === "Pending")
                  .map((bill) => (
                    <Tr key={bill._id}>
                      <Td fontSize={{ base: "xs", md: "sm" }}>
                        {bill.billType}
                      </Td>
                      <Td fontSize={{ base: "xs", md: "sm" }}>{bill.amount}</Td>
                      <Td fontSize={{ base: "xs", md: "sm" }}>
                        {new Date(bill.dueDate).toLocaleDateString()}
                      </Td>
                      <Td>
                        <Badge
                          colorScheme="yellow"
                          size={{ base: "sm", md: "md" }}
                        >
                          Pending
                        </Badge>
                      </Td>
                      <Td>
                        <Flex gap={1}>
                          <IconButton
                            icon={<FaEdit />}
                            onClick={() => handleEdit(bill)}
                            size={{ base: "xs", md: "sm" }}
                          />
                          <IconButton
                            icon={<FaTrash />}
                            colorScheme="red"
                            onClick={() => handleDelete(bill)}
                            size={{ base: "xs", md: "sm" }}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Box>
        </Box>

        {/* Paid Bills Section */}
        <Box mb={8}>
          <Text fontSize="lg" fontWeight="bold" mb={3}>
            Paid Bills
          </Text>
          <Box overflowX="auto">
            <Table variant="simple" minW="600px">
              <Thead>
                <Tr>
                  <Th fontSize={{ base: "xs", md: "sm" }}>Type</Th>
                  <Th fontSize={{ base: "xs", md: "sm" }}>Amount</Th>
                  <Th fontSize={{ base: "xs", md: "sm" }}>Due Date</Th>
                  <Th fontSize={{ base: "xs", md: "sm" }}>Status</Th>
                  <Th fontSize={{ base: "xs", md: "sm" }}>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {bills
                  .filter((bill) => bill.status === "Paid")
                  .map((bill) => (
                    <Tr key={bill._id}>
                      <Td fontSize={{ base: "xs", md: "sm" }}>
                        {bill.billType}
                      </Td>
                      <Td fontSize={{ base: "xs", md: "sm" }}>{bill.amount}</Td>
                      <Td fontSize={{ base: "xs", md: "sm" }}>
                        {new Date(bill.dueDate).toLocaleDateString()}
                      </Td>
                      <Td>
                        <Badge
                          colorScheme="green"
                          size={{ base: "sm", md: "md" }}
                        >
                          Paid
                        </Badge>
                      </Td>
                      <Td>
                        <Flex gap={1}>
                          <IconButton
                            icon={<FaEdit />}
                            onClick={() => handleEdit(bill)}
                            size={{ base: "xs", md: "sm" }}
                          />
                          <IconButton
                            icon={<FaTrash />}
                            colorScheme="red"
                            onClick={() => handleDelete(bill)}
                            size={{ base: "xs", md: "sm" }}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Box>
        </Box>

        {/* Modals */}
        <AddBill
          isOpen={isAddOpen}
          onClose={onAddClose}
          fetchBills={fetchBills}
        />
        {selectedBill && (
          <EditBill
            isOpen={isEditOpen}
            onClose={onEditClose}
            bill={selectedBill}
            fetchBills={fetchBills}
          />
        )}
        {selectedBill && (
          <DeleteBill
            isOpen={isDeleteOpen}
            onClose={onDeleteClose}
            billId={selectedBill._id}
            fetchBills={fetchBills}
          />
        )}
      </Box>
    </Flex>
  );
}
