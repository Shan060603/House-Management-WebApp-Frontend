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
} from "@chakra-ui/react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaFileInvoiceDollar,
  FaCalendarAlt,
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
        {/* Header with "Add Bill" Button */}
        <Flex justify="space-between" mb="6" align="center">
          <Text fontSize="2xl" fontWeight="bold">
            Bills
          </Text>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="yellow"
            onClick={onAddOpen}
            borderRadius="md"
            px={4}
            py={2}
          >
            Add Bill
          </Button>
        </Flex>

        {/* Dashboard Section */}
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
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Type</Th>
                <Th>Amount</Th>
                <Th>Due Date</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bills
                .filter((bill) => bill.status === "Pending")
                .map((bill) => (
                  <Tr key={bill._id}>
                    <Td>{bill.billType}</Td>
                    <Td>{bill.amount}</Td>
                    <Td>{new Date(bill.dueDate).toLocaleDateString()}</Td>
                    <Td>
                      <Badge colorScheme="yellow">Pending</Badge>
                    </Td>
                    <Td>
                      <IconButton
                        icon={<FaEdit />}
                        onClick={() => handleEdit(bill)}
                        mr={2}
                      />
                      <IconButton
                        icon={<FaTrash />}
                        colorScheme="red"
                        onClick={() => handleDelete(bill)}
                      />
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Box>

        {/* Paid Bills Section */}
        <Box mb={8}>
          <Text fontSize="lg" fontWeight="bold" mb={3}>
            Paid Bills
          </Text>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Type</Th>
                <Th>Amount</Th>
                <Th>Due Date</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bills
                .filter((bill) => bill.status === "Paid")
                .map((bill) => (
                  <Tr key={bill._id}>
                    <Td>{bill.billType}</Td>
                    <Td>{bill.amount}</Td>
                    <Td>{new Date(bill.dueDate).toLocaleDateString()}</Td>
                    <Td>
                      <Badge colorScheme="green">Paid</Badge>
                    </Td>
                    <Td>
                      <IconButton
                        icon={<FaEdit />}
                        onClick={() => handleEdit(bill)}
                        mr={2}
                      />
                      <IconButton
                        icon={<FaTrash />}
                        colorScheme="red"
                        onClick={() => handleDelete(bill)}
                      />
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
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
