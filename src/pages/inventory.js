// inventory.js

import { useEffect, useState, useRef } from "react";
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
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Badge,
  HStack,
  VStack,
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
  FaShoppingCart,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaBars,
} from "react-icons/fa";
import { useRouter } from "next/router";
import axios from "../api";

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
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

  const cancelRef = useRef();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    purchaseDate: "",
    expirationDate: "",
    location: "",
    status: "Available",
  });

  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get("http://localhost:3001/inventory");
      setInventoryItems(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch inventory items",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        // Update existing item
        await axios.put(
          `http://localhost:3001/inventory/${selectedItem._id}`,
          formData
        );
        toast({
          title: "Success",
          description: "Inventory item updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onEditClose();
      } else {
        // Add new item
        await axios.post("http://localhost:3001/inventory", formData);
        toast({
          title: "Success",
          description: "Inventory item added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onAddClose();
      }
      fetchInventoryItems();
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save inventory item",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name || "",
      category: item.category || "",
      quantity: item.quantity || "",
      unit: item.unit || "",
      purchaseDate: item.purchaseDate
        ? new Date(item.purchaseDate).toISOString().split("T")[0]
        : "",
      expirationDate: item.expirationDate
        ? new Date(item.expirationDate).toISOString().split("T")[0]
        : "",
      location: item.location || "",
      status: item.status || "Available",
    });
    onEditOpen();
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/inventory/${selectedItem._id}`);
      toast({
        title: "Success",
        description: "Inventory item deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchInventoryItems();
      onDeleteClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete inventory item",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      quantity: "",
      unit: "",
      purchaseDate: "",
      expirationDate: "",
      location: "",
      status: "Available",
    });
    setSelectedItem(null);
  };

  const handleAddNew = () => {
    resetForm();
    onAddOpen();
  };

  const isExpiringSoon = (expirationDate) => {
    if (!expirationDate) return false;
    const expDate = new Date(expirationDate);
    const today = new Date();
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const isExpired = (expirationDate) => {
    if (!expirationDate) return false;
    const expDate = new Date(expirationDate);
    const today = new Date();
    return expDate < today;
  };

  const getStatusBadge = (item) => {
    if (isExpired(item.expirationDate)) {
      return <Badge colorScheme="red">Expired</Badge>;
    } else if (isExpiringSoon(item.expirationDate)) {
      return <Badge colorScheme="orange">Expiring Soon</Badge>;
    } else if (item.status === "Out of Stock") {
      return <Badge colorScheme="gray">Out of Stock</Badge>;
    } else {
      return <Badge colorScheme="green">Available</Badge>;
    }
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
        {/* Header with "Add Item" Button */}
        <Flex
          justify="space-between"
          mb={6}
          align="center"
          mt={{ base: 16, md: 0 }}
        >
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
            Inventory
          </Text>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="yellow"
            onClick={handleAddNew}
            borderRadius="md"
            px={4}
            py={2}
            size={{ base: "sm", md: "md" }}
          >
            Add Item
          </Button>
        </Flex>

        {/* Dashboard Section */}
        <Grid templateColumns="repeat(3, 1fr)" gap={4} mb={6}>
          <GridItem bg="teal.400" p="4" borderRadius="md" color="white">
            <Flex align="center" justify="space-between">
              <Text fontSize="lg">{inventoryItems.length}</Text>
              <FaShoppingCart size="24px" />
            </Flex>
            <Text>Total Items</Text>
          </GridItem>
          <GridItem bg="orange.400" p="4" borderRadius="md" color="white">
            <Flex align="center" justify="space-between">
              <Text fontSize="lg">
                {
                  inventoryItems.filter((item) =>
                    isExpiringSoon(item.expirationDate)
                  ).length
                }
              </Text>
              <FaCalendarAlt size="24px" />
            </Flex>
            <Text>Expiring Soon</Text>
          </GridItem>
          <GridItem bg="red.400" p="4" borderRadius="md" color="white">
            <Flex align="center" justify="space-between">
              <Text fontSize="lg">
                {
                  inventoryItems.filter((item) =>
                    isExpired(item.expirationDate)
                  ).length
                }
              </Text>
              <FaExclamationTriangle size="24px" />
            </Flex>
            <Text>Expired</Text>
          </GridItem>
        </Grid>

        {/* Inventory Table */}
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Item Name</Th>
              <Th>Category</Th>
              <Th>Quantity</Th>
              <Th>Date Bought</Th>
              <Th>Expiry Date</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {inventoryItems.map((item) => (
              <Tr key={item._id}>
                <Td>{item.name}</Td>
                <Td>
                  <Badge colorScheme="blue" variant="subtle">
                    {item.category}
                  </Badge>
                </Td>
                <Td>
                  {item.quantity} {item.unit}
                </Td>
                <Td>
                  {item.purchaseDate
                    ? new Date(item.purchaseDate).toLocaleDateString()
                    : "-"}
                </Td>
                <Td>
                  {item.expirationDate
                    ? new Date(item.expirationDate).toLocaleDateString()
                    : "-"}
                </Td>
                <Td>{getStatusBadge(item)}</Td>
                <Td>
                  <IconButton
                    icon={<FaEdit />}
                    onClick={() => handleEdit(item)}
                    mr={2}
                  />
                  <IconButton
                    icon={<FaTrash />}
                    colorScheme="red"
                    onClick={() => handleDelete(item)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Add Modal */}
        <Modal isOpen={isAddOpen} onClose={onAddClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Inventory Item</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Item Name</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter item name"
                    />
                  </FormControl>

                  <HStack spacing={4} w="full">
                    <FormControl isRequired>
                      <FormLabel>Category</FormLabel>
                      <Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="Select category"
                      >
                        <option value="Food">Food</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Tools">Tools</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Other">Other</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Status</FormLabel>
                      <Select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="Available">Available</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </Select>
                    </FormControl>
                  </HStack>

                  <HStack spacing={4} w="full">
                    <FormControl isRequired>
                      <FormLabel>Quantity</FormLabel>
                      <Input
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        placeholder="Enter quantity"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Unit</FormLabel>
                      <Select
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        placeholder="Select unit"
                      >
                        <option value="pieces">Pieces</option>
                        <option value="kg">Kilograms</option>
                        <option value="g">Grams</option>
                        <option value="liters">Liters</option>
                        <option value="ml">Milliliters</option>
                        <option value="boxes">Boxes</option>
                        <option value="bottles">Bottles</option>
                      </Select>
                    </FormControl>
                  </HStack>

                  <HStack spacing={4} w="full">
                    <FormControl>
                      <FormLabel>Date Bought</FormLabel>
                      <Input
                        name="purchaseDate"
                        type="date"
                        value={formData.purchaseDate}
                        onChange={handleInputChange}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Expiry Date</FormLabel>
                      <Input
                        name="expirationDate"
                        type="date"
                        value={formData.expirationDate}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  </HStack>

                  <FormControl>
                    <FormLabel>Location</FormLabel>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Kitchen, Bathroom, Garage"
                    />
                  </FormControl>

                  <HStack spacing={4} w="full" justify="flex-end">
                    <Button variant="ghost" onClick={onAddClose}>
                      Cancel
                    </Button>
                    <Button type="submit" colorScheme="purple">
                      Add Item
                    </Button>
                  </HStack>
                </VStack>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Edit Modal */}
        {selectedItem && (
          <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Inventory Item</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Item Name</FormLabel>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter item name"
                      />
                    </FormControl>

                    <HStack spacing={4} w="full">
                      <FormControl isRequired>
                        <FormLabel>Category</FormLabel>
                        <Select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          placeholder="Select category"
                        >
                          <option value="Food">Food</option>
                          <option value="Cleaning">Cleaning</option>
                          <option value="Tools">Tools</option>
                          <option value="Medicine">Medicine</option>
                          <option value="Other">Other</option>
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Status</FormLabel>
                        <Select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                        >
                          <option value="Available">Available</option>
                          <option value="Out of Stock">Out of Stock</option>
                        </Select>
                      </FormControl>
                    </HStack>

                    <HStack spacing={4} w="full">
                      <FormControl isRequired>
                        <FormLabel>Quantity</FormLabel>
                        <Input
                          name="quantity"
                          type="number"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          placeholder="Enter quantity"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Unit</FormLabel>
                        <Select
                          name="unit"
                          value={formData.unit}
                          onChange={handleInputChange}
                          placeholder="Select unit"
                        >
                          <option value="pieces">Pieces</option>
                          <option value="kg">Kilograms</option>
                          <option value="g">Grams</option>
                          <option value="liters">Liters</option>
                          <option value="ml">Milliliters</option>
                          <option value="boxes">Boxes</option>
                          <option value="bottles">Bottles</option>
                        </Select>
                      </FormControl>
                    </HStack>

                    <HStack spacing={4} w="full">
                      <FormControl>
                        <FormLabel>Date Bought</FormLabel>
                        <Input
                          name="purchaseDate"
                          type="date"
                          value={formData.purchaseDate}
                          onChange={handleInputChange}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Expiry Date</FormLabel>
                        <Input
                          name="expirationDate"
                          type="date"
                          value={formData.expirationDate}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </HStack>

                    <FormControl>
                      <FormLabel>Location</FormLabel>
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., Kitchen, Bathroom, Garage"
                      />
                    </FormControl>

                    <HStack spacing={4} w="full" justify="flex-end">
                      <Button variant="ghost" onClick={onEditClose}>
                        Cancel
                      </Button>
                      <Button type="submit" colorScheme="purple">
                        Update Item
                      </Button>
                    </HStack>
                  </VStack>
                </form>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Inventory Item
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete "{selectedItem?.name}"? This
                action cannot be undone.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDeleteClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </Flex>
  );
}
