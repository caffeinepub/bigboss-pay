import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
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
  status?: "processing" | "pending";
}

export type UsersStore = Record<string, UserData>;

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

function getCurrentUser(): string | null {
  return localStorage.getItem("inr_current_user");
}

function setCurrentUser(username: string | null) {
  if (username) {
    localStorage.setItem("inr_current_user", username);
  } else {
    localStorage.removeItem("inr_current_user");
  }
}

export default function App() {
  const [currentUser, setCurrentUserState] = useState<string | null>(() =>
    getCurrentUser(),
  );
  const [showBonusPopup, setShowBonusPopup] = useState(false);
  const [processingOrders, setProcessingOrders] = useState<ProcessingOrder[]>(
    [],
  );

  function handleLogin(username: string, password: string): string | null {
    const users = getUsers();
    if (!users[username]) return "User not found";
    if (users[username].password !== password) return "Incorrect password";
    setCurrentUser(username);
    setCurrentUserState(username);

    if (!users[username].hasBonus) {
      users[username].hasBonus = true;
      users[username].balance += 400;
      saveUsers(users);
      setTimeout(() => setShowBonusPopup(true), 400);
    }
    return null;
  }

  function handleRegister(username: string, password: string): string | null {
    const users = getUsers();
    if (users[username]) return "Username already taken";
    users[username] = {
      password,
      balance: 0,
      deposit: 0,
      sell: 0,
      commission: 0,
      hasBonus: false,
    };
    saveUsers(users);
    return null;
  }

  function handleLogout() {
    setCurrentUser(null);
    setCurrentUserState(null);
  }

  function updateBalance(amount: number) {
    if (!currentUser) return;
    const users = getUsers();
    users[currentUser].balance += amount;
    saveUsers(users);
  }

  function addProcessingOrder(order: ProcessingOrder) {
    setProcessingOrders((prev) => [...prev, order]);
  }

  function handleChangeUsername(newUsername: string): string | null {
    if (!currentUser) return "Not logged in";
    const users = getUsers();
    if (users[newUsername]) return "Username already taken";
    const userData = users[currentUser];
    delete users[currentUser];
    users[newUsername] = userData;
    saveUsers(users);
    setCurrentUser(newUsername);
    setCurrentUserState(newUsername);
    return null;
  }

  const userData = currentUser ? getUsers()[currentUser] : null;

  return (
    <div className="min-h-screen bg-[#FEF3E8] flex items-start justify-center">
      <div className="w-full max-w-[430px] min-h-screen relative">
        {currentUser && userData ? (
          <MainApp
            username={currentUser}
            userData={userData}
            onLogout={handleLogout}
            onUpdateBalance={updateBalance}
            processingOrders={processingOrders}
            onAddProcessingOrder={addProcessingOrder}
            onChangeUsername={handleChangeUsername}
          />
        ) : (
          <LoginPage onLogin={handleLogin} onRegister={handleRegister} />
        )}
      </div>

      {/* ₹400 Bonus Popup */}
      <Dialog open={showBonusPopup} onOpenChange={setShowBonusPopup}>
        <DialogContent className="max-w-[320px] rounded-3xl p-0 overflow-hidden border-0">
          <div className="bg-orange-500 pt-8 pb-6 px-6 text-center text-white">
            <div className="text-5xl mb-3">🎁</div>
            <h2 className="text-2xl font-bold">Welcome Bonus!</h2>
            <p className="text-white/80 text-sm mt-1">
              Congratulations on joining INR Trade
            </p>
          </div>
          <div className="bg-white px-6 py-6 text-center">
            <p className="text-4xl font-bold text-orange-500">₹400</p>
            <p className="text-muted-foreground text-sm mt-1">
              has been credited to your account
            </p>
            <div className="mt-4 bg-orange-50 rounded-2xl p-3">
              <p className="text-xs text-orange-600 font-medium">
                This bonus is a one-time first login reward. Start trading to
                earn more!
              </p>
            </div>
            <Button
              onClick={() => setShowBonusPopup(false)}
              className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-11"
            >
              Claim Bonus 🎉
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster richColors position="top-center" />
    </div>
  );
}
