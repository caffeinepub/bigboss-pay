import { CreditCard, Home, User, Wrench } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { ProcessingOrder, UserData } from "../App";
import HomePage from "./HomePage";
import MyPage from "./MyPage";
import PaymentPage from "./PaymentPage";
import StatisticsPage from "./StatisticsPage";

export type Tab = "home" | "payment" | "statistics" | "my";

interface Props {
  username: string;
  userData: UserData;
  onLogout: () => void;
  onUpdateBalance: (amount: number) => void;
  processingOrders: ProcessingOrder[];
  onAddProcessingOrder: (order: ProcessingOrder) => void;
  onChangeUsername: (newUsername: string) => string | null;
}

export default function MainApp({
  username,
  userData,
  onLogout,
  onUpdateBalance,
  processingOrders,
  onAddProcessingOrder,
  onChangeUsername,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [isLoading, setIsLoading] = useState(false);
  const [, forceUpdate] = useState(0);

  function getBalance(): number {
    try {
      const users = JSON.parse(localStorage.getItem("inr_users") || "{}");
      return users[username]?.balance ?? userData.balance;
    } catch {
      return userData.balance;
    }
  }

  function handleTabChange(tab: Tab) {
    if (tab === activeTab || isLoading) return;
    setIsLoading(true);
    const delay = 800 + Math.random() * 800;
    setTimeout(() => {
      setActiveTab(tab);
      setIsLoading(false);
    }, delay);
  }

  function handleClaim(amount: number) {
    onUpdateBalance(amount);
    forceUpdate((n) => n + 1);
  }

  function handleWithdraw(amount: number, upiId: string) {
    onUpdateBalance(-amount);
    const order: ProcessingOrder = {
      id: Date.now().toString(),
      utr: upiId,
      amount,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      type: "withdrawal",
      status: "pending",
    };
    onAddProcessingOrder(order);
    forceUpdate((n) => n + 1);
  }

  const balance = getBalance();

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Home", icon: <Home className="w-5 h-5" /> },
    {
      id: "payment",
      label: "Payment",
      icon: <CreditCard className="w-5 h-5" />,
    },
    { id: "statistics", label: "TOOL", icon: <Wrench className="w-6 h-6" /> },
    { id: "my", label: "My", icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FEF3E8]">
      {/* Top logo bar */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/90 backdrop-blur-sm border-b border-orange-100 px-4 py-2 z-40 flex items-center gap-2">
        <img
          src="/assets/photo_6229019837539749379_y-019d4996-dbf0-73f2-b2ea-91a0f26e3a81.jpg"
          alt="BigBoss Pay"
          className="w-9 h-9 rounded-full object-cover border-2 border-orange-300"
        />
        <span className="font-bold text-sm text-orange-600 tracking-wide">
          BigBoss Pay
        </span>
        {isLoading && (
          <div className="ml-auto flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pb-24 pt-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "home" && (
                <HomePage
                  username={username}
                  balance={balance}
                  processingOrders={processingOrders}
                  onGoToPayment={() => handleTabChange("payment")}
                  onWithdraw={handleWithdraw}
                  onUpdateBalance={onUpdateBalance}
                />
              )}
              {activeTab === "payment" && (
                <PaymentPage
                  balance={balance}
                  onClaim={handleClaim}
                  onAddProcessingOrder={onAddProcessingOrder}
                />
              )}
              {activeTab === "statistics" && (
                <StatisticsPage username={username} />
              )}
              {activeTab === "my" && (
                <MyPage
                  username={username}
                  balance={balance}
                  processingOrders={processingOrders}
                  onLogout={onLogout}
                  onChangeUsername={onChangeUsername}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-orange-100 px-2 py-2 z-50">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isCenter = tab.id === "statistics";
            return (
              <button
                type="button"
                key={tab.id}
                data-ocid={`nav.${tab.id}.tab`}
                onClick={() => handleTabChange(tab.id)}
                disabled={isLoading}
                className={`flex flex-col items-center gap-0.5 transition-colors ${isCenter ? "relative -mt-5" : ""} ${isLoading ? "opacity-60" : ""}`}
              >
                {isCenter ? (
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${isActive ? "bg-orange-500" : "bg-orange-400"}`}
                  >
                    <span className="text-white">{tab.icon}</span>
                  </div>
                ) : (
                  <div
                    className={`p-2 rounded-xl transition-colors ${isActive ? "text-orange-500" : "text-gray-400"}`}
                  >
                    {tab.icon}
                  </div>
                )}
                <span
                  className={`text-[10px] font-semibold ${
                    isCenter
                      ? isActive
                        ? "text-orange-500"
                        : "text-orange-400"
                      : isActive
                        ? "text-orange-500"
                        : "text-gray-400"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
