import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Link,
  useToast,
  List,
  ListItem,
  Badge,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import axios from "../api";

const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [bills, setBills] = useState([]);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    import("react-calendar/dist/Calendar.css");
  }, []);

  // Fetch tasks and bills on mount
  useEffect(() => {
    const fetchTasksAndBills = async () => {
      try {
        const [tasksRes, billsRes] = await Promise.all([
          axios.get("http://localhost:3001/getTasks"),
          axios.get("http://localhost:3001/getBills"),
        ]);
        setTasks(tasksRes.data);
        setBills(billsRes.data);
      } catch (error) {
        console.error("Error fetching tasks or bills:", error);
        toast({
          title: "Error",
          description: "Failed to fetch tasks or bills.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchTasksAndBills();
  }, [toast]);

  // Helper: compare two dates in local time (year, month, day)
  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // Dates with tasks and bills (as local date strings)
  const taskDates = new Set(
    tasks
      .filter((task) => task.dueDate)
      .map((task) => new Date(task.dueDate).toDateString())
  );
  const billDates = new Set(
    bills
      .filter((bill) => bill.dueDate)
      .map((bill) => new Date(bill.dueDate).toDateString())
  );

  // Tasks and bills for selected date (local time)
  const tasksForSelectedDate = tasks.filter(
    (task) => task.dueDate && isSameDay(new Date(task.dueDate), date)
  );
  const billsForSelectedDate = bills.filter(
    (bill) => bill.dueDate && isSameDay(new Date(bill.dueDate), date)
  );

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
        <Box
          bg="white"
          p={5}
          borderRadius="md"
          boxShadow="lg"
          maxW="900px"
          maxH="650px"
          mx="auto"
        >
          <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
            Calendar
          </Text>
          <Box
            w="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginLeft={180}
            marginRight={180}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 700,
                margin: "0 auto",
                display: "block",
              }}
            >
              <Calendar
                onChange={setDate}
                value={date}
                tileContent={({ date: d, view }) => {
                  if (view === "month") {
                    const dStr = d.toDateString();
                    return (
                      <>
                        {taskDates.has(dStr) && (
                          <Badge colorScheme="teal" fontSize="xs" mt={1} mr={1}>
                            T
                          </Badge>
                        )}
                        {billDates.has(dStr) && (
                          <Badge colorScheme="orange" fontSize="xs" mt={1}>
                            B
                          </Badge>
                        )}
                      </>
                    );
                  }
                  return null;
                }}
                className="big-calendar"
              />
            </div>
          </Box>
          <Text mt={4} textAlign="center">
            Selected date: {date.toDateString()}
          </Text>
          <Box
            mt={4}
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
            gap={8}
          >
            {/* Tasks for this date */}
            <Box minW="220px">
              <Text fontWeight="bold" mb={2} textAlign="center">
                Tasks for this date:
              </Text>
              {tasksForSelectedDate.length === 0 ? (
                <Text textAlign="center" color="gray.500">
                  No tasks for this date.
                </Text>
              ) : (
                <List spacing={2} className="centered-list">
                  {tasksForSelectedDate.map((task) => (
                    <ListItem key={task._id}>
                      <Badge
                        colorScheme={
                          task.status === "Completed" ? "green" : "yellow"
                        }
                        mr={2}
                      >
                        {task.status}
                      </Badge>
                      {task.title}
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
            {/* Bills for this date */}
            <Box minW="220px">
              <Text fontWeight="bold" mb={2} textAlign="center">
                Bills for this date:
              </Text>
              {billsForSelectedDate.length === 0 ? (
                <Text textAlign="center" color="gray.500">
                  No bills for this date.
                </Text>
              ) : (
                <List spacing={2} className="centered-list">
                  {billsForSelectedDate.map((bill) => (
                    <ListItem key={bill._id}>
                      <Badge
                        colorScheme={
                          bill.status === "Paid" ? "green" : "orange"
                        }
                        mr={2}
                      >
                        {bill.status}
                      </Badge>
                      {bill.billType} - ₱{bill.amount}
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}

// Update the custom styles for the calendar to ensure perfect alignment of navigation, weekday header, and days grid
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
  .big-calendar .react-calendar {
    border: none !important;
    box-shadow: none;
    background: none;
    width: 100% !important;
    max-width: 900px !important;
    margin: 0 auto;
    padding: 40px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .big-calendar .react-calendar__navigation {
    border: 1px solid #bbb;
    border-radius: 6px 6px 0 0;
    background: #f7f7fa;
    width: 100%;
    max-width: 700px;
    margin: 0 auto 0.5rem auto;
  }

  .big-calendar .react-calendar__month-view__weekdays {
    background: #f7f7fa;
    font-size: 1.2rem;
    text-align: center;
    margin: 0 auto;
    max-width: 700px;
    width: 100%;
  }

  .big-calendar .react-calendar__month-view__weekdays__weekday {
    font-weight: 500;
    color: #333;
    padding: 8px 0;
  }

  .big-calendar .react-calendar__month-view__weekdays__weekday abbr {
    text-decoration: none !important;
    border-bottom: none !important;
  }

  .big-calendar .react-calendar__tile {
    min-height: 70px;
    font-size: 1.3rem;
    padding: 10px 0;
  }

  .centered-list {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

  document.head.appendChild(style);
}
