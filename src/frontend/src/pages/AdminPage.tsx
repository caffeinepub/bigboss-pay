import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { useState } from "react";
import type { ProcessingOrder, UsersStore } from "../App";

interface Props {
  processingOrders: ProcessingOrder[];
  onUpdateOrder: (orderId: string, status: "success" | "processing") => void;
  onLogout: () => void;
}

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

export default function AdminPage({
  processingOrders,
  onUpdateOrder,
  onLogout,
}: Props) {
  const [users, setUsers] = useState<UsersStore>(() => getUsers());
  const [editBalances, setEditBalances] = useState<Record<string, string>>({});
  const [savedMsg, setSavedMsg] = useState<Record<string, string>>({});

  function refreshUsers() {
    setUsers(getUsers());
  }

  function handleSaveBalance(username: string) {
    const val = Number.parseFloat(editBalances[username] ?? "");
    if (Number.isNaN(val) || val < 0) {
      setSavedMsg((m) => ({ ...m, [username]: "Invalid amount" }));
      return;
    }
    const u = getUsers();
    u[username].balance = val;
    saveUsers(u);
    refreshUsers();
    setEditBalances((e) => ({ ...e, [username]: "" }));
    setSavedMsg((m) => ({ ...m, [username]: "Saved!" }));
    setTimeout(() => setSavedMsg((m) => ({ ...m, [username]: "" })), 2000);
  }

  function handleApproveWithdrawal(orderId: string) {
    onUpdateOrder(orderId, "success");
  }

  const withdrawalOrders = processingOrders.filter(
    (o) =>
      o.type === "withdrawal" && o.status !== ("success" as unknown as string),
  );
  const userList = Object.entries(users).filter(([u]) => u !== "admin");

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#1a1a2e]/95 backdrop-blur border-b border-amber-400/30 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center">
            <span className="text-[#1a1a2e] font-black text-sm">A</span>
          </div>
          <div>
            <h1 className="font-bold text-amber-400 leading-tight">
              Admin Panel
            </h1>
            <p className="text-white/40 text-xs">BigBoss Pay</p>
          </div>
        </div>
        <Button
          onClick={onLogout}
          variant="outline"
          className="border-amber-400/40 text-amber-300 bg-transparent hover:bg-amber-400/10 text-xs h-8 px-3"
        >
          Logout
        </Button>
      </div>

      <div className="px-4 py-5 space-y-6 pb-12">
        {/* Withdrawal Approvals */}
        <section>
          <h2 className="text-sm font-bold text-amber-400 mb-3 uppercase tracking-widest">
            Pending Withdrawals
          </h2>
          {withdrawalOrders.length === 0 ? (
            <div className="bg-white/5 rounded-2xl p-6 text-center text-white/40 text-sm">
              No pending withdrawals
            </div>
          ) : (
            <div className="space-y-3">
              {withdrawalOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/8 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-white truncate">
                      UPI: {order.utr}
                    </p>
                    <p className="text-xs text-white/50 mt-0.5">
                      ₹{order.amount.toFixed(2)} · {order.date}
                    </p>
                    <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/15 px-2 py-0.5 rounded-full mt-1 inline-block">
                      {order.status === "pending" ? "Pending" : "Processing"}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleApproveWithdrawal(order.id)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl h-9 px-4 text-xs shrink-0"
                  >
                    ✓ Approve
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* User Balance Editor */}
        <section>
          <h2 className="text-sm font-bold text-amber-400 mb-3 uppercase tracking-widest">
            User Balances
          </h2>
          {userList.length === 0 ? (
            <div className="bg-white/5 rounded-2xl p-6 text-center text-white/40 text-sm">
              No users registered yet
            </div>
          ) : (
            <div className="space-y-3">
              {userList.map(([username, data]) => (
                <motion.div
                  key={username}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/8 border border-white/10 rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-white">{username}</p>
                      <p className="text-xs text-white/50">
                        Current: ₹{data.balance.toFixed(2)}
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-amber-400/20 rounded-full flex items-center justify-center">
                      <span className="text-amber-400 font-bold text-sm">
                        {username[0].toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      placeholder="New balance (₹)"
                      value={editBalances[username] ?? ""}
                      onChange={(e) =>
                        setEditBalances((b) => ({
                          ...b,
                          [username]: e.target.value,
                        }))
                      }
                      className="flex-1 h-9 text-sm bg-white/10 border-white/20 text-white placeholder:text-white/30 rounded-xl focus-visible:ring-amber-400"
                    />
                    <Button
                      onClick={() => handleSaveBalance(username)}
                      className="bg-amber-400 hover:bg-amber-500 text-[#1a1a2e] font-bold rounded-xl h-9 px-4 text-xs shrink-0"
                    >
                      Set
                    </Button>
                  </div>
                  {savedMsg[username] && (
                    <p
                      className={`text-xs mt-1.5 font-semibold ${
                        savedMsg[username] === "Saved!"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {savedMsg[username]}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
