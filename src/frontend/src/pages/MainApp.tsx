import { BarChart2, CreditCard, Home, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { ProcessingOrder, UserData } from "../App";
import HomePage from "./HomePage";
import MyPage from "./MyPage";
import PaymentPage from "./PaymentPage";
import StatisticsPage from "./StatisticsPage";

interface Props {
  username: string;
  userData: UserData;
  onLogout: () => void;
  onUpdateBalance: (amount: number) => void;
  processingOrders: ProcessingOrder[];
  onAddProcessingOrder: (order: ProcessingOrder) => void;
  onChangeUsername: (newUsername: string) => string | null;
}

type Tab = "home" | "payment" | "tool" | "my";

const TABS: {
  id: Tab;
  label: string;
  Icon: React.FC<{ className?: string }>;
}[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "payment", label: "Payment", Icon: CreditCard },
  { id: "tool", label: "Tool", Icon: BarChart2 },
  { id: "my", label: "My", Icon: User },
];

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
  const [loadingTab, setLoadingTab] = useState<Tab | null>(null);

  function handleTabChange(tab: Tab) {
    if (tab === activeTab || loadingTab) return;
    setLoadingTab(tab);
    setTimeout(() => {
      setActiveTab(tab);
      setLoadingTab(null);
    }, 600);
  }

  function handleGoToPayment() {
    handleTabChange("payment");
  }

  function handleWithdraw(amount: number, upiId: string) {
    onUpdateBalance(-amount);
    const order: ProcessingOrder = {
      id: `wd-${Date.now()}`,
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
  }

  return (
    <div className="min-h-screen bg-[#FEF3E8] flex flex-col">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-[#1a1a2e] px-5 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <img
            src="/assets/photo_6229019837539749379_y-019d49aa-e135-73f4-a107-3edb35f48f21.jpg"
            alt="BigBoss Pay"
            className="w-8 h-8 rounded-full object-cover border-2 border-amber-400"
          />
          <span className="text-amber-400 font-bold text-sm tracking-wide">
            BigBoss Pay
          </span>
        </div>
        <div className="bg-amber-400/20 rounded-xl px-3 py-1">
          <span className="text-amber-300 text-xs font-semibold">
            ₹{userData.balance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-14 pb-16 overflow-y-auto">
        <AnimatePresence mode="wait">
          {loadingTab ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-64"
            >
              <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            </motion.div>
          ) : (
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
                  balance={userData.balance}
                  processingOrders={processingOrders}
                  onGoToPayment={handleGoToPayment}
                  onWithdraw={handleWithdraw}
                  onUpdateBalance={onUpdateBalance}
                />
              )}
              {activeTab === "payment" && (
                <PaymentPage
                  username={username}
                  balance={userData.balance}
                  onClaim={onUpdateBalance}
                  onAddProcessingOrder={onAddProcessingOrder}
                />
              )}
              {activeTab === "tool" && <StatisticsPage username={username} />}
              {activeTab === "my" && (
                <MyPage
                  username={username}
                  balance={userData.balance}
                  processingOrders={processingOrders}
                  onLogout={onLogout}
                  onChangeUsername={onChangeUsername}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-orange-100 flex">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleTabChange(id)}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors ${
              activeTab === id
                ? "text-orange-500"
                : "text-muted-foreground hover:text-orange-400"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-semibold">{label}</span>
            {activeTab === id && (
              <div className="w-1 h-1 rounded-full bg-orange-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
