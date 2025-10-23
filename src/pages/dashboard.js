import {
  Box,
  Flex,
  Text,
  Grid,
  GridItem,
  Link,
  Button,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FaFacebook,
  FaTwitter,
  FaEye,
  FaComments,
  FaFileInvoiceDollar,
  FaWrench,
  FaShoppingCart,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaBars,
} from "react-icons/fa";
import { useRouter } from "next/router";
import axios from "../api";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [bills, setBills] = useState([]);
  const [appliances, setAppliances] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [tasksRes, billsRes, appliancesRes, inventoryRes] =
        await Promise.all([
          axios.get("http://localhost:3001/getTasks"),
          axios.get("http://localhost:3001/getBills"),
          axios.get("http://localhost:3001/getAppliances"),
          axios.get("http://localhost:3001/inventory"),
        ]);
      setTasks(tasksRes.data);
      setBills(billsRes.data);
      setAppliances(appliancesRes.data);
      setInventoryItems(inventoryRes.data);
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

  // Inventory stats
  const totalInventoryItems = inventoryItems.length;
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
  const expiringSoon = inventoryItems.filter((item) =>
    isExpiringSoon(item.expirationDate)
  ).length;
  const expired = inventoryItems.filter((item) =>
    isExpired(item.expirationDate)
  ).length;

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
          display="block"
          px={5}
          py={3}
          color="white"
          _active={{ bg: "teal.500", color: "white" }}
          _hover={{ bg: "teal.500", color: "white" }}
          href={item.href}
          onClick={isMobile ? onClose : undefined}
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
    <Flex h="100vh" overflow="hidden">
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          icon={<FaBars />}
          onClick={onOpen}
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
      <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="xs">
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
          h="100vh"
          direction="column"
        >
          <SidebarContent />
        </Flex>
      )}

      {/* Main Content */}
      <Box
        flex="1"
        p={{ base: 2, md: 4 }}
        bg="gray.50"
        h="100vh"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        {/* Header */}
        <Flex
          justify="space-between"
          align="center"
          mb={4}
          mt={{ base: 16, md: 0 }}
          flexShrink={0}
        >
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
            Welcome, Silveo Family!
          </Text>
        </Flex>

        {/* Status Cards */}
        <Flex flex="1" justify="center" align="center" overflow="hidden">
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(2, 1fr)",
            }}
            gap={{ base: 4, md: 6 }}
            maxW="1100px"
            w="100%"
            overflow="hidden"
            h="100%"
          >
            {/* Each card section */}
            {[
              {
                color: "blue.500",
                icon: FaComments,
                title: "Total Tasks",
                total: totalTasks,
                stats: [
                  { label: "Pending", value: pendingTasks },
                  { label: "Completed", value: completedTasks },
                ],
                list: tasks,
                nameKey: "title",
                dateKey: "dueDate",
                statusKey: "status",
              },
              {
                color: "purple.500",
                icon: FaFileInvoiceDollar,
                title: "Total Bills",
                total: totalBills,
                stats: [
                  { label: "Pending", value: pendingBills },
                  { label: "Paid", value: paidBills },
                ],
                list: bills,
                nameKey: "billType",
                dateKey: "dueDate",
                statusKey: "status",
              },
              {
                color: "teal.400",
                icon: FaWrench,
                title: "Total Assets",
                total: totalAssets,
                stats: [
                  { label: "Maintenance Due", value: maintenanceDue },
                  {
                    label: "Missing Maintenance Date",
                    value: missingMaintenance,
                  },
                ],
                list: appliances,
                nameKey: "name",
                dateKey: "brand",
              },
              {
                color: "green.500",
                icon: FaShoppingCart,
                title: "Total Inventory",
                total: totalInventoryItems,
                stats: [
                  { label: "Expiring Soon", value: expiringSoon },
                  { label: "Expired", value: expired },
                ],
                list: inventoryItems.slice(0, 3),
                nameKey: "name",
                dateKey: "quantity",
              },
            ].map((card, index) => (
              <GridItem
                key={index}
                bg={card.color}
                p={{ base: 4, md: 6 }}
                borderRadius="2xl"
                color="white"
                boxShadow="xl"
                overflow="hidden"
                display="flex"
                flexDirection="column"
              >
                <Flex align="center" justify="space-between" mb={2}>
                  <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
                    {card.total}
                  </Text>
                  <card.icon size="40px" />
                </Flex>
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="semibold">
                  {card.title}
                </Text>

                {/* Stats */}
                {card.stats.map((stat, i) => (
                  <Text fontSize="sm" mt={1} key={i}>
                    {stat.label}: <b>{stat.value}</b>
                  </Text>
                ))}

                {/* Scrollable list inside the card */}
                <Box
                  mt={3}
                  bg="white"
                  borderRadius="lg"
                  p={2}
                  color="gray.800"
                  flex="1"
                  overflowY="auto"
                >
                  {card.list.length === 0 ? (
                    <Text color="gray.400" fontSize="sm">
                      No data found.
                    </Text>
                  ) : (
                    card.list.map((item, idx) => (
                      <Box
                        key={item._id || idx}
                        py={1}
                        borderBottom={
                          idx !== card.list.length - 1
                            ? "1px solid #E2E8F0"
                            : "none"
                        }
                      >
                        <Text fontWeight="bold" fontSize="sm">
                          {item[card.nameKey]}
                        </Text>
                        {item[card.dateKey] && (
                          <Text fontSize="xs" color="gray.500">
                            {typeof item[card.dateKey] === "string"
                              ? `Info: ${item[card.dateKey]}`
                              : ""}
                          </Text>
                        )}
                        {item.status && (
                          <Text
                            fontSize="xs"
                            color={
                              item.status === "Completed" ||
                              item.status === "Paid"
                                ? "green.600"
                                : "orange.600"
                            }
                          >
                            Status: {item.status}
                          </Text>
                        )}
                      </Box>
                    ))
                  )}
                </Box>
              </GridItem>
            ))}
          </Grid>
        </Flex>
      </Box>
    </Flex>
  );
}
