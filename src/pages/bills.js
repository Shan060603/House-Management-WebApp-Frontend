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
import AddBill from "@/components/AddBill";
import EditBill from "@/components/EditBill";
import DeleteBill from "@/components/DeleteBill";

export default function BillPage() {
  const router = useRouter();
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

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
    fetchBills();
  }, []);

 const fetchBills = async () => {
  try {
    const response = await axios.get("https://house-management-webapp-backend.onrender.com/bills");
    console.log("Bills response:", response.data);
    setBills(response.data);
  } catch (error) {
    console.error("Error fetching bills:", error);
  }
};

  
  
  

  // Open Edit Modal and set the selected bill
  const handleEdit = (bill) => {
    setSelectedBill(bill);
    onEditOpen();
  };

  // Open Delete Modal and set the selected bill ID
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
            Bills
          </Text>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="blue"
            onClick={onAddOpen}
          >
            Add Bill
          </Button>
        </Flex>

        {/* Bills List */}
        {["Pending", "Paid"].map((status) => (
          <Box key={status} mb="6">
            <Text fontSize="lg" fontWeight="bold" mb="3">
              {status}
            </Text>
            <Table variant="simple" bg="white" boxShadow="md" borderRadius="md">
              <Thead>
                <Tr>
                  <Th>Bill Type</Th>
                  <Th>Amount</Th>
                  <Th>Due Date</Th>
                  <Th>Who Paid</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {bills
                  .filter((bill) => bill.status === status)
                  .map((bill) => (
                    <Tr key={bill._id}>
                      <Td>{bill.billType}</Td>
                      <Td>₱{bill.amount.toFixed(2)}</Td>
                      <Td>
                        {bill.dueDate
                          ? new Date(bill.dueDate).toLocaleDateString()
                          : "No Due Date"}
                      </Td>
                      <Td>
  {bill.userDetails ? 
    (bill.userDetails.name || bill.userDetails.email) : 
    (typeof bill.userId === 'object' ? 
      (bill.userId.fullName || bill.userId.email || "No Name Set") : 
      (bill.userId || "Unknown User"))
  }
</Td>




                      <Td>
                        <Badge
                          colorScheme={
                            bill.status === "Paid" ? "green" : "red"
                          }
                        >
                          {bill.status}
                        </Badge>
                      </Td>
                      <Td>
                        <Flex gap={2}>
                          <IconButton
                            icon={<FaEdit />}
                            colorScheme="blue"
                            size="sm"
                            onClick={() => handleEdit(bill)}
                          />
                          <IconButton
                            icon={<FaTrash />}
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleDelete(bill)}
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
    </Flex>
  );
}
