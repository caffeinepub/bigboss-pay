import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import MainApp from "./pages/MainApp";

export interface UserData {
  password: string;
  balance: number;
  deposit: number;
  sell: number;
  commission: number;
  hasBonus: boolean;
}

export interface ProcessingOrder {
  id: string;
  utr: string;
  amount: number;
  date: string;
  type?: "payment" | "withdrawal";
  status?: "processing" | "pending" | "success";
}

export type UsersStore = Record<string, UserData>;

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin";

function getUsers(): UsersStore {
  try {
    return JSON.parse(localStorage.getItem("inr_users") || "{}");
  } catch {
    return {};
  }
}

function saveUsers(users: UsersStore) {
  localStorage.setItem("inr_users", JSON.stringify(users));
}

function getOrders(username: string): ProcessingOrder[] {
  try {
    return JSON.parse(localStorage.getItem(`inr_orders_${username}`) || "[]");
  } catch {
    return [];
  }
}

function saveOrders(username: string, orders: ProcessingOrder[]) {
  localStorage.setItem(`inr_orders_${username}`, JSON.stringify(orders));
}

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [processingOrders, setProcessingOrders] = useState<ProcessingOrder[]>(
    [],
  );

  function handleLogin(username: string, password: string): string | null {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setLoggedInUser(ADMIN_USER);
      setIsAdmin(true);
      const allOrders: ProcessingOrder[] = [];
      const users = getUsers();
      for (const u of Object.keys(users)) {
        const orders = getOrders(u);
        allOrders.push(...orders);
      }
      setProcessingOrders(allOrders);
      return null;
    }
    const users = getUsers();
    if (!users[username]) return "Username not found";
    if (users[username].password !== password) return "Incorrect password";
    setLoggedInUser(username);
    setIsAdmin(false);
    setUserData(users[username]);
    setProcessingOrders(getOrders(username));
    return null;
  }

  function handleRegister(username: string, password: string): string | null {
    if (username === ADMIN_USER) return "Username not allowed";
    const users = getUsers();
    if (users[username]) return "Username already taken";
    const newUser: UserData = {
      password,
      balance: 400,
      deposit: 0,
      sell: 0,
      commission: 9,
      hasBonus: true,
    };
    users[username] = newUser;
    saveUsers(users);
    // Give new users 5 USDT welcome bonus
    localStorage.setItem(`bbp_usdt_${username}`, "5");
    return null;
  }

  function handleLogout() {
    setLoggedInUser(null);
    setIsAdmin(false);
    setUserData(null);
    setProcessingOrders([]);
  }

  function handleUpdateBalance(amount: number) {
    if (!loggedInUser || !userData) return;
    const users = getUsers();
    users[loggedInUser].balance = (users[loggedInUser].balance || 0) + amount;
    saveUsers(users);
    setUserData({ ...users[loggedInUser] });
  }

  function handleAddProcessingOrder(order: ProcessingOrder) {
    if (!loggedInUser) return;
    const updated = [
      ...processingOrders,
      { ...order, status: "processing" as const },
    ];
    setProcessingOrders(updated);
    saveOrders(loggedInUser, updated);
  }

  function handleUpdateOrder(
    orderId: string,
    status: "success" | "processing",
  ) {
    const allOrderKeys = Object.keys(localStorage).filter((k) =>
      k.startsWith("inr_orders_"),
    );
    for (const key of allOrderKeys) {
      try {
        const orders: ProcessingOrder[] = JSON.parse(
          localStorage.getItem(key) || "[]",
        );
        const idx = orders.findIndex((o) => o.id === orderId);
        if (idx !== -1) {
          orders[idx].status = status;
          localStorage.setItem(key, JSON.stringify(orders));
          break;
        }
      } catch {
        // ignore
      }
    }
    setProcessingOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
  }

  function handleChangeUsername(newUsername: string): string | null {
    if (!loggedInUser || !userData) return "Not logged in";
    if (newUsername === ADMIN_USER) return "Username not allowed";
    const users = getUsers();
    if (users[newUsername]) return "Username already taken";
    users[newUsername] = { ...users[loggedInUser] };
    const orders = getOrders(loggedInUser);
    saveOrders(newUsername, orders);
    localStorage.removeItem(`inr_orders_${loggedInUser}`);
    delete users[loggedInUser];
    saveUsers(users);
    setLoggedInUser(newUsername);
    setUserData(users[newUsername]);
    return null;
  }

  if (!loggedInUser) {
    return (
      <>
        <LoginPage onLogin={handleLogin} onRegister={handleRegister} />
        <Toaster richColors position="top-center" />
      </>
    );
  }

  if (isAdmin) {
    return (
      <>
        <AdminPage
          processingOrders={processingOrders}
          onUpdateOrder={handleUpdateOrder}
          onLogout={handleLogout}
        />
        <Toaster richColors position="top-center" />
      </>
    );
  }

  return (
    <>
      <MainApp
        username={loggedInUser}
        userData={userData!}
        onLogout={handleLogout}
        onUpdateBalance={handleUpdateBalance}
        processingOrders={processingOrders}
        onAddProcessingOrder={handleAddProcessingOrder}
        onChangeUsername={handleChangeUsername}
      />
      <Toaster richColors position="top-center" />
    </>
  );
}
