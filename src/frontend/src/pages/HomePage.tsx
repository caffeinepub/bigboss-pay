import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  ArrowDownToLine,
  Clock,
  CreditCard,
  Dices,
  Flame,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { ProcessingOrder } from "../App";

interface UpiEntry {
  id: string;
  upi: string;
}

type TxFilter = "today" | "week" | "all";

interface Props {
  username: string;
  balance: number;
  processingOrders: ProcessingOrder[];
  onGoToPayment: () => void;
  onWithdraw: (amount: number, upiId: string) => void;
  onUpdateBalance: (amount: number) => void;
}

export default function HomePage({
  username,
  balance,
  processingOrders,
  onGoToPayment,
  onWithdraw,
  onUpdateBalance,
}: Props) {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedUpi, setSelectedUpi] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawDone, setWithdrawDone] = useState(false);
  const [txFilter, setTxFilter] = useState<TxFilter>("all");
  const [spinMsg, setSpinMsg] = useState<string | null>(null);
  const [streak, setStreak] = useState(1);

  // Initialize streak on mount
  useEffect(() => {
    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem(`bbp_lastlogin_${username}`);
    const savedStreak = Number.parseInt(
      localStorage.getItem(`bbp_streak_${username}`) || "1",
      10,
    );

    if (!lastLogin) {
      localStorage.setItem(`bbp_lastlogin_${username}`, today);
      localStorage.setItem(`bbp_streak_${username}`, "1");
      setStreak(1);
    } else if (lastLogin === today) {
      setStreak(savedStreak);
    } else {
      const last = new Date(lastLogin);
      const now = new Date(today);
      const diffDays = Math.round(
        (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
      );
      const newStreak = diffDays === 1 ? savedStreak + 1 : 1;
      localStorage.setItem(`bbp_lastlogin_${username}`, today);
      localStorage.setItem(`bbp_streak_${username}`, newStreak.toString());
      setStreak(newStreak);
    }
  }, [username]);

  function handleDailySpin() {
    const today = new Date().toDateString();
    const spinKey = `bbp_spin_${username}_${today}`;
    if (localStorage.getItem(spinKey)) {
      setSpinMsg("already");
      return;
    }
    const bonus = Math.floor(Math.random() * 41) + 10; // 10-50
    localStorage.setItem(spinKey, "1");
    const spinCount = Number.parseInt(
      localStorage.getItem(`bbp_spin_count_${username}`) || "0",
      10,
    );
    localStorage.setItem(
      `bbp_spin_count_${username}`,
      (spinCount + 1).toString(),
    );
    onUpdateBalance(bonus);
    setSpinMsg(`won_${bonus}`);
  }

  function getUpiList(): UpiEntry[] {
    try {
      return JSON.parse(localStorage.getItem(`inr_upi_${username}`) || "[]");
    } catch {
      return [];
    }
  }

  function openWithdraw() {
    setWithdrawAmount("");
    setSelectedUpi("");
    setWithdrawError("");
    setWithdrawDone(false);
    setShowWithdraw(true);
  }

  function handleConfirmWithdraw() {
    setWithdrawError("");

    const amt = Number.parseFloat(withdrawAmount);
    if (!withdrawAmount || Number.isNaN(amt) || amt <= 0) {
      setWithdrawError("Please enter a valid amount");
      return;
    }
    if (amt < 500) {
      setWithdrawError("Minimum withdrawal amount is ₹500");
      return;
    }
    if (amt > balance) {
      setWithdrawError("Insufficient balance");
      return;
    }
    if (!selectedUpi) {
      setWithdrawError("Please select a UPI ID");
      return;
    }
    onWithdraw(amt, selectedUpi);
    setWithdrawDone(true);
  }

  function filterOrders(orders: ProcessingOrder[]): ProcessingOrder[] {
    if (txFilter === "all") return orders;
    const now = new Date();
    return orders.filter((o) => {
      const d = new Date(o.date);
      if (txFilter === "today") {
        return d.toDateString() === now.toDateString();
      }
      // week
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    });
  }

  const upiList = getUpiList();
  const filteredOrders = filterOrders(processingOrders);
  const pendingCount = processingOrders.filter(
    (o) => o.status === "pending",
  ).length;
  const totalClaimed = processingOrders.filter(
    (o) => !o.status || o.status === "processing",
  ).length;

  return (
    <div className="px-4 pt-14 pb-6">
      {/* Balance Card — INR only */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 rounded-3xl p-6 text-white mb-4 shadow-xl"
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/25 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium">Welcome back</p>
              <h2 className="font-bold text-lg leading-tight">{username}</h2>
            </div>
          </div>
          <p className="text-white/60 text-xs mb-2 font-semibold uppercase tracking-wide">
            Your Balance
          </p>
          <div className="bg-white/15 rounded-2xl px-4 py-3">
            <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wide mb-1">
              INR Balance
            </p>
            <p className="text-3xl font-bold leading-tight">
              ₹{balance.toFixed(2)}
            </p>
            <p className="text-white/50 text-[10px] mt-1">Commission: 9%</p>
          </div>
        </div>
      </motion.div>

      {/* Streak Card */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.04 }}
        className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl px-4 py-3 text-white mb-4 shadow-md flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5" />
          <div>
            <p className="font-bold text-sm">{streak} Day Streak</p>
            <p className="text-white/70 text-xs">
              Keep going! Login daily to earn more
            </p>
          </div>
        </div>
        <div className="bg-white/20 rounded-xl px-3 py-1.5">
          <p className="font-bold text-lg leading-tight">{streak}🔥</p>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="grid grid-cols-3 gap-2 mb-4"
      >
        {[
          {
            label: "Claimed",
            value: totalClaimed,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Pending",
            value: pendingCount,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
          },
          {
            label: "Streak Days",
            value: streak,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-3 text-center`}>
            <p className={`font-bold text-xl ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <motion.button
          type="button"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 }}
          onClick={openWithdraw}
          className="bg-orange-500 text-white rounded-2xl p-3 shadow-card flex flex-col items-center gap-1.5 hover:bg-orange-600 active:scale-95 transition-all"
        >
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <ArrowDownToLine className="w-4 h-4" />
          </div>
          <p className="font-bold text-xs">Withdraw</p>
        </motion.button>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={onGoToPayment}
          className="bg-white text-orange-500 rounded-2xl p-3 shadow-card flex flex-col items-center gap-1.5 hover:bg-orange-50 active:scale-95 transition-all border border-orange-100"
        >
          <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-orange-500" />
          </div>
          <p className="font-bold text-xs">Orders</p>
        </motion.button>

        <motion.button
          type="button"
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12 }}
          onClick={handleDailySpin}
          className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-3 shadow-card flex flex-col items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all"
        >
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <Dices className="w-4 h-4" />
          </div>
          <p className="font-bold text-xs">Daily Bonus</p>
        </motion.button>
      </div>

      {/* Spin Message */}
      {spinMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`rounded-2xl px-4 py-3 mb-4 flex items-center gap-3 ${
            spinMsg === "already"
              ? "bg-orange-50 border border-orange-200"
              : "bg-green-50 border border-green-200"
          }`}
        >
          <div className="text-xl">{spinMsg === "already" ? "⏳" : "🎉"}</div>
          <div>
            {spinMsg === "already" ? (
              <>
                <p className="font-bold text-sm text-orange-700">
                  Already claimed today
                </p>
                <p className="text-xs text-orange-500">
                  Come back tomorrow for more!
                </p>
              </>
            ) : (
              <>
                <p className="font-bold text-sm text-green-700">
                  You won ₹{spinMsg.split("_")[1]} bonus!
                </p>
                <p className="text-xs text-green-500">Added to your balance</p>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSpinMsg(null)}
            className="ml-auto text-muted-foreground text-xs"
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.14 }}
          className="bg-white rounded-2xl p-4 shadow-card"
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-orange-400" />
            <p className="text-xs text-muted-foreground">Total Deposit</p>
          </div>
          <p className="font-bold text-lg text-foreground">₹0.00</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.16 }}
          className="bg-white rounded-2xl p-4 shadow-card"
        >
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-amber-400" />
            <p className="text-xs text-muted-foreground">Total Sell</p>
          </div>
          <p className="font-bold text-lg text-foreground">₹0.00</p>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" /> Recent Orders
            {processingOrders.length > 0 && (
              <Badge className="bg-orange-100 text-orange-600 border-0 text-xs">
                {processingOrders.length}
              </Badge>
            )}
          </h3>
          <div className="flex gap-1">
            {(["today", "week", "all"] as TxFilter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setTxFilter(f)}
                className={`text-[10px] font-semibold px-2 py-1 rounded-lg transition-colors ${
                  txFilter === f
                    ? "bg-orange-500 text-white"
                    : "bg-white text-muted-foreground border border-orange-100"
                }`}
              >
                {f === "today" ? "Today" : f === "week" ? "Week" : "All"}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="space-y-3">
            {filteredOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`bg-white rounded-2xl p-4 shadow-card flex items-center justify-between border-l-4 ${
                  order.status === "pending"
                    ? "border-l-yellow-400"
                    : order.status === "success"
                      ? "border-l-green-400"
                      : "border-l-orange-400"
                }`}
              >
                <div>
                  {order.type === "withdrawal" ? (
                    <p className="font-semibold text-sm text-foreground">
                      UPI: {order.utr}
                    </p>
                  ) : (
                    <p className="font-semibold text-sm text-foreground">
                      UTR: {order.utr}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {order.date} · ₹{order.amount.toFixed(2)}
                    {order.type === "withdrawal" && " · Withdrawal"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {order.status === "pending" ? (
                    <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  ) : order.status === "success" ? (
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      ✓ Success
                    </span>
                  ) : (
                    <>
                      <Clock
                        className="w-4 h-4 text-orange-400 animate-spin"
                        style={{ animationDuration: "3s" }}
                      />
                      <span className="text-xs font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">
                        Processing
                      </span>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-8 text-center shadow-card"
          >
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-orange-300" />
            </div>
            <p className="font-semibold text-foreground">No orders yet</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Claim an order from the Payment tab to get started
            </p>
            <button
              type="button"
              onClick={onGoToPayment}
              className="text-xs font-bold text-orange-500 bg-orange-50 px-4 py-2 rounded-xl border border-orange-200"
            >
              Browse Orders →
            </button>
          </motion.div>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </p>

      {/* Withdrawal Dialog — INR only */}
      <Dialog
        open={showWithdraw}
        onOpenChange={(open) => {
          if (!open) setShowWithdraw(false);
        }}
      >
        <DialogContent className="max-w-[340px] rounded-3xl p-0 overflow-hidden border-0">
          <div className="pt-6 pb-5 px-6 text-white bg-gradient-to-br from-orange-600 to-orange-400">
            <DialogHeader>
              <DialogTitle className="text-white text-xl font-bold">
                Withdraw Funds
              </DialogTitle>
            </DialogHeader>
            <p className="text-white/70 text-xs mt-1">
              Minimum withdrawal: ₹500
            </p>
          </div>

          <div className="bg-white px-6 py-5 space-y-4">
            {withdrawDone ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-bold text-foreground text-lg">
                  Withdrawal Requested!
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Your withdrawal is pending review.
                </p>
                <Button
                  onClick={() => setShowWithdraw(false)}
                  className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-11"
                >
                  Done
                </Button>
              </div>
            ) : (
              <>
                {upiList.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="text-4xl mb-3">⚠️</div>
                    <p className="font-bold text-foreground">No UPI ID Found</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Please add a UPI ID in the TOOL tab first before
                      withdrawing.
                    </p>
                    <Button
                      onClick={() => setShowWithdraw(false)}
                      className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-11"
                    >
                      Go to TOOL tab
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-sm font-semibold text-foreground/70 mb-2">
                        Select UPI ID
                      </p>
                      <div className="space-y-2">
                        {upiList.map((u) => (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => setSelectedUpi(u.upi)}
                            className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors text-sm font-medium ${
                              selectedUpi === u.upi
                                ? "border-orange-500 bg-orange-50 text-orange-700"
                                : "border-gray-200 bg-gray-50 text-foreground hover:border-orange-300"
                            }`}
                          >
                            {u.upi}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground/70 mb-1.5">
                        Quick Amount
                      </p>
                      <div className="flex gap-2 mb-2">
                        {[500, 1000, 2000].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              setWithdrawAmount(preset.toString());
                              setWithdrawError("");
                            }}
                            className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-colors ${
                              withdrawAmount === preset.toString()
                                ? "bg-orange-500 text-white border-orange-500"
                                : "bg-orange-50 text-orange-600 border-orange-200 hover:border-orange-400"
                            }`}
                          >
                            ₹{preset}
                          </button>
                        ))}
                      </div>
                      <Input
                        type="number"
                        placeholder="Or enter custom amount"
                        value={withdrawAmount}
                        onChange={(e) => {
                          setWithdrawAmount(e.target.value);
                          setWithdrawError("");
                        }}
                        className="rounded-xl border-orange-200 focus-visible:ring-orange-400"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Available: ₹{balance.toFixed(2)}
                      </p>
                    </div>

                    {withdrawError && (
                      <p className="text-red-500 text-sm font-medium">
                        {withdrawError}
                      </p>
                    )}

                    <Button
                      onClick={handleConfirmWithdraw}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-11"
                    >
                      Confirm Withdrawal
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
