import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Flame,
  Search,
  TrendingUp,
  Upload,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ProcessingOrder } from "../App";

interface Order {
  id: string;
  code: string;
  amount: number;
  income: number;
  date: string;
  status: "Succeed" | "Failed";
  claimed: boolean;
  hot?: boolean;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: "1",
    code: "INR-38291",
    amount: 245,
    income: 22.05,
    date: "25 Mar 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "2",
    code: "INR-29834",
    amount: 310,
    income: 27.9,
    date: "25 Mar 2026",
    status: "Succeed",
    claimed: false,
    hot: true,
  },
  {
    id: "3",
    code: "INR-47201",
    amount: 780,
    income: 70.2,
    date: "25 Mar 2026",
    status: "Succeed",
    claimed: false,
    hot: true,
  },
  {
    id: "4",
    code: "INR-31029",
    amount: 290,
    income: 26.1,
    date: "25 Mar 2026",
    status: "Failed",
    claimed: false,
  },
  {
    id: "5",
    code: "INR-58392",
    amount: 560,
    income: 50.4,
    date: "26 Mar 2026",
    status: "Succeed",
    claimed: false,
    hot: true,
  },
  {
    id: "6",
    code: "INR-62841",
    amount: 220,
    income: 19.8,
    date: "26 Mar 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "7",
    code: "INR-71923",
    amount: 950,
    income: 85.5,
    date: "26 Mar 2026",
    status: "Succeed",
    claimed: false,
    hot: true,
  },
  {
    id: "8",
    code: "INR-84012",
    amount: 340,
    income: 30.6,
    date: "26 Mar 2026",
    status: "Failed",
    claimed: false,
  },
  {
    id: "9",
    code: "INR-90234",
    amount: 670,
    income: 60.3,
    date: "27 Mar 2026",
    status: "Succeed",
    claimed: false,
    hot: true,
  },
  {
    id: "10",
    code: "INR-11348",
    amount: 275,
    income: 24.75,
    date: "27 Mar 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "11",
    code: "INR-22561",
    amount: 820,
    income: 73.8,
    date: "27 Mar 2026",
    status: "Succeed",
    claimed: false,
    hot: true,
  },
  {
    id: "12",
    code: "INR-33872",
    amount: 215,
    income: 19.35,
    date: "27 Mar 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "13",
    code: "INR-44193",
    amount: 500,
    income: 45.0,
    date: "28 Mar 2026",
    status: "Failed",
    claimed: false,
  },
  {
    id: "14",
    code: "INR-55304",
    amount: 390,
    income: 35.1,
    date: "28 Mar 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "15",
    code: "INR-66415",
    amount: 730,
    income: 65.7,
    date: "28 Mar 2026",
    status: "Succeed",
    claimed: false,
    hot: true,
  },
  {
    id: "16",
    code: "INR-77526",
    amount: 260,
    income: 23.4,
    date: "28 Mar 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "17",
    code: "INR-88637",
    amount: 1000,
    income: 90.0,
    date: "28 Mar 2026",
    status: "Succeed",
    claimed: false,
    hot: true,
  },
  {
    id: "18",
    code: "INR-99748",
    amount: 320,
    income: 28.8,
    date: "29 Mar 2026",
    status: "Failed",
    claimed: false,
  },
  {
    id: "19",
    code: "INR-10859",
    amount: 880,
    income: 79.2,
    date: "29 Mar 2026",
    status: "Succeed",
    claimed: false,
    hot: true,
  },
  {
    id: "20",
    code: "INR-21960",
    amount: 235,
    income: 21.15,
    date: "29 Mar 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "21",
    code: "INR-34571",
    amount: 350,
    income: 31.5,
    date: "29 Mar 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "22",
    code: "INR-45682",
    amount: 620,
    income: 55.8,
    date: "29 Mar 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "23",
    code: "INR-56793",
    amount: 280,
    income: 25.2,
    date: "30 Mar 2026",
    status: "Failed",
    claimed: false,
  },
  {
    id: "24",
    code: "INR-67804",
    amount: 710,
    income: 63.9,
    date: "30 Mar 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "25",
    code: "INR-78915",
    amount: 365,
    income: 32.85,
    date: "30 Mar 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "26",
    code: "INR-89026",
    amount: 540,
    income: 48.6,
    date: "30 Mar 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "27",
    code: "INR-90137",
    amount: 225,
    income: 20.25,
    date: "30 Mar 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "28",
    code: "INR-12348",
    amount: 800,
    income: 72.0,
    date: "31 Mar 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "29",
    code: "INR-23459",
    amount: 315,
    income: 28.35,
    date: "31 Mar 2026",
    status: "Failed",
    claimed: false,
  },
  {
    id: "30",
    code: "INR-34560",
    amount: 590,
    income: 53.1,
    date: "31 Mar 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "31",
    code: "INR-45671",
    amount: 240,
    income: 21.6,
    date: "31 Mar 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "32",
    code: "INR-56782",
    amount: 760,
    income: 68.4,
    date: "31 Mar 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "33",
    code: "INR-67893",
    amount: 380,
    income: 34.2,
    date: "01 Apr 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "34",
    code: "INR-78904",
    amount: 470,
    income: 42.3,
    date: "01 Apr 2026",
    status: "Failed",
    claimed: false,
  },
  {
    id: "35",
    code: "INR-89015",
    amount: 650,
    income: 58.5,
    date: "01 Apr 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "36",
    code: "INR-90126",
    amount: 230,
    income: 20.7,
    date: "01 Apr 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "37",
    code: "INR-11237",
    amount: 910,
    income: 81.9,
    date: "01 Apr 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "38",
    code: "INR-22348",
    amount: 355,
    income: 31.95,
    date: "02 Apr 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "39",
    code: "INR-33459",
    amount: 680,
    income: 61.2,
    date: "02 Apr 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "40",
    code: "INR-44560",
    amount: 250,
    income: 22.5,
    date: "02 Apr 2026",
    status: "Failed",
    claimed: false,
  },
  {
    id: "41",
    code: "INR-55671",
    amount: 840,
    income: 75.6,
    date: "02 Apr 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "42",
    code: "INR-66782",
    amount: 330,
    income: 29.7,
    date: "02 Apr 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "43",
    code: "INR-77893",
    amount: 570,
    income: 51.3,
    date: "02 Apr 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "44",
    code: "INR-88904",
    amount: 270,
    income: 24.3,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "45",
    code: "INR-99015",
    amount: 990,
    income: 89.1,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "46",
    code: "INR-10126",
    amount: 345,
    income: 31.05,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "47",
    code: "INR-21237",
    amount: 700,
    income: 63.0,
    date: "03 Apr 2026",
    status: "Failed",
    claimed: false,
  },
  {
    id: "48",
    code: "INR-32348",
    amount: 215,
    income: 19.35,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "49",
    code: "INR-43459",
    amount: 860,
    income: 77.4,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "50",
    code: "INR-54560",
    amount: 375,
    income: 33.75,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "51",
    code: "INR-65671",
    amount: 530,
    income: 47.7,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "52",
    code: "INR-76782",
    amount: 255,
    income: 22.95,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "53",
    code: "INR-87893",
    amount: 920,
    income: 82.8,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
  },
  {
    id: "54",
    code: "INR-98904",
    amount: 305,
    income: 27.45,
    date: "03 Apr 2026",
    status: "Failed",
    claimed: false,
  },
  {
    id: "55",
    code: "INR-09015",
    amount: 640,
    income: 57.6,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
  },
];

type Filter = "all" | "210-300" | "300-400" | "500-1000";

interface Props {
  balance: number;
  onClaim: (amount: number) => void;
  onAddProcessingOrder: (order: ProcessingOrder) => void;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function PaymentPage({ balance, onAddProcessingOrder }: Props) {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [claimingOrder, setClaimingOrder] = useState<Order | null>(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [utr, setUtr] = useState("");
  const [utrError, setUtrError] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const fileRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (claimingOrder && !orderSubmitted) {
      setTimeLeft(600);
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [claimingOrder, orderSubmitted]);

  const filteredOrders = orders.filter((o) => {
    const matchFilter =
      filter === "all" ||
      (filter === "210-300" && o.amount >= 210 && o.amount <= 300) ||
      (filter === "300-400" && o.amount > 300 && o.amount <= 400) ||
      (filter === "500-1000" && o.amount >= 500 && o.amount <= 1000);
    const matchSearch =
      !search ||
      o.code.toLowerCase().includes(search.toLowerCase()) ||
      o.amount.toString().includes(search);
    return matchFilter && matchSearch;
  });

  const countAll = orders.length;
  const count1 = orders.filter(
    (o) => o.amount >= 210 && o.amount <= 300,
  ).length;
  const count2 = orders.filter((o) => o.amount > 300 && o.amount <= 400).length;
  const count3 = orders.filter(
    (o) => o.amount >= 500 && o.amount <= 1000,
  ).length;

  const succeedOrders = orders.filter((o) => o.status === "Succeed");
  const totalPotentialEarn = succeedOrders.reduce(
    (sum, o) => sum + o.income,
    0,
  );

  function handleOpenClaim(order: Order) {
    setClaimingOrder(order);
    setOrderSubmitted(false);
    setUtr("");
    setUtrError("");
    setScreenshot(null);
  }

  function handleCompleteOrder() {
    if (utr.length !== 12) {
      setUtrError("UTR number must be exactly 12 digits");
      return;
    }
    if (!screenshot) {
      setUtrError("Please upload a screenshot");
      return;
    }
    setUtrError("");
    if (timerRef.current) clearInterval(timerRef.current);
    const processingOrder: ProcessingOrder = {
      id: claimingOrder!.id,
      utr,
      amount: claimingOrder!.amount,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
    onAddProcessingOrder(processingOrder);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === claimingOrder!.id ? { ...o, claimed: true } : o,
      ),
    );
    setOrderSubmitted(true);
  }

  if (claimingOrder) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={orderSubmitted ? "processing" : "claim"}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="min-h-screen bg-[#FEF3E8] px-4 pt-14 pb-8"
        >
          <button
            type="button"
            onClick={() => {
              setClaimingOrder(null);
              setOrderSubmitted(false);
            }}
            className="flex items-center gap-2 text-orange-500 font-semibold mb-5"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Payment
          </button>

          {orderSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center pt-10"
            >
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Clock
                  className="w-12 h-12 text-orange-500 animate-spin"
                  style={{ animationDuration: "3s" }}
                />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Order Processing
              </h2>
              <p className="text-muted-foreground text-sm text-center mb-6">
                Your order is being verified. This may take a few minutes.
              </p>
              <div className="bg-white rounded-2xl p-5 w-full shadow-card">
                <div className="space-y-3">
                  {[
                    ["Order Code", claimingOrder.code],
                    ["Amount", `₹${claimingOrder.amount.toFixed(2)}`],
                    ["Income", `+₹${claimingOrder.income.toFixed(2)}`],
                    ["UTR Number", utr],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        {label}
                      </span>
                      <span className="text-sm font-semibold">{val}</span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                    <span className="text-xs font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">
                      Processing
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-5 text-center">
                Check the Home tab to track your order status.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="bg-gradient-to-br from-orange-600 to-orange-400 rounded-3xl p-5 text-white mb-5 shadow-lg">
                <h2 className="text-lg font-bold mb-1">Complete Payment</h2>
                <p className="text-white/80 text-xs">
                  Scan QR & complete within time limit
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Clock className="w-4 h-4 text-white/80" />
                  <span
                    className={`font-bold text-lg ${timeLeft < 60 ? "text-red-200" : "text-white"}`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-white/60 text-xs">remaining</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 mb-4 shadow-card flex flex-col items-center">
                <p className="text-sm font-semibold text-foreground mb-3">
                  Scan QR to Pay
                </p>
                <img
                  src="/assets/qr-019d4996-d5b1-72e4-bad0-876839db689c.jpg"
                  alt="UPI QR Code"
                  className="w-52 h-52 rounded-xl border-4 border-orange-100 object-contain"
                />
                <p className="font-bold text-orange-500 text-xl mt-3">
                  ₹{claimingOrder.amount.toFixed(2)}
                </p>
              </div>

              <div className="bg-white rounded-3xl p-5 mb-4 shadow-card space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-foreground mb-1.5 block">
                    UTR Number{" "}
                    <span className="text-muted-foreground font-normal">
                      (12 digits)
                    </span>
                  </Label>
                  <Input
                    placeholder="Enter 12-digit UTR number"
                    value={utr}
                    maxLength={12}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setUtr(val);
                      setUtrError("");
                    }}
                    className="rounded-xl border-orange-200 focus-visible:ring-orange-400 tracking-widest"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {utr.length}/12 digits
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-foreground mb-1.5 block">
                    Upload Screenshot
                  </Label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setScreenshot(f);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className={`w-full border-2 border-dashed rounded-xl p-4 flex flex-col items-center gap-2 transition-colors ${screenshot ? "border-green-400 bg-green-50" : "border-orange-200 bg-orange-50 hover:border-orange-400"}`}
                  >
                    {screenshot ? (
                      <>
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        <span className="text-xs text-green-600 font-semibold">
                          {screenshot.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-orange-400" />
                        <span className="text-xs text-orange-500 font-medium">
                          Tap to upload payment screenshot
                        </span>
                      </>
                    )}
                  </button>
                </div>
                {utrError && (
                  <p className="text-red-500 text-sm font-medium">{utrError}</p>
                )}
              </div>

              <Button
                onClick={handleCompleteOrder}
                disabled={timeLeft === 0}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-12 text-base"
              >
                {timeLeft === 0 ? "Time Expired" : "Complete Order"}
              </Button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="px-4 pt-4 pb-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 rounded-3xl p-5 text-white mb-5 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img
              src="/assets/photo_6229019837539749379_y-019d4996-dbf0-73f2-b2ea-91a0f26e3a81.jpg"
              alt="logo"
              className="w-8 h-8 rounded-full object-cover border-2 border-white/40"
            />
            <span className="text-white/90 text-xs font-bold tracking-wide">
              BigBoss Pay
            </span>
          </div>
          <div className="bg-white/20 rounded-xl px-3 py-1">
            <p className="text-[10px] text-white/70">Commission</p>
            <p className="text-xl font-bold leading-tight">9%</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/15 rounded-2xl px-3 py-2.5">
            <p className="text-white/60 text-[10px] mb-0.5">Balance</p>
            <p className="text-base font-bold">₹{balance.toFixed(0)}</p>
          </div>
          <div className="bg-white/15 rounded-2xl px-3 py-2.5">
            <p className="text-white/60 text-[10px] mb-0.5">Reward</p>
            <p className="text-base font-bold">₹0.00</p>
          </div>
          <div className="bg-white/15 rounded-2xl px-3 py-2.5">
            <p className="text-white/60 text-[10px] mb-0.5">Pending</p>
            <p className="text-base font-bold">₹0.00</p>
          </div>
        </div>
        <p className="text-white/50 text-[10px] mt-3 flex items-center gap-1">
          <Zap className="w-3 h-3" /> Use Freecharge or Mobikwik wallet for
          payment
        </p>
      </motion.div>

      {/* Analytics Summary */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-2xl p-4 shadow-card mb-4 border border-orange-100"
      >
        <p className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-orange-500" /> ANALYTICS
          OVERVIEW
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-orange-50 rounded-xl p-3">
            <p className="text-[10px] text-orange-500 font-semibold uppercase tracking-wide">
              Total Orders
            </p>
            <p className="text-2xl font-bold text-foreground">
              {succeedOrders.length}
            </p>
            <p className="text-[10px] text-muted-foreground">Succeed orders</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3">
            <p className="text-[10px] text-green-600 font-semibold uppercase tracking-wide">
              Total Earn
            </p>
            <p className="text-2xl font-bold text-foreground">
              ₹{totalPotentialEarn.toFixed(0)}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Potential income
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by code or amount..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl border-orange-200 focus-visible:ring-orange-400 bg-white"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {[
          { key: "all" as Filter, label: `All (${countAll})` },
          { key: "210-300" as Filter, label: `₹210-300 (${count1})` },
          { key: "300-400" as Filter, label: `₹300-400 (${count2})` },
          { key: "500-1000" as Filter, label: `₹500-1K (${count3})` },
        ].map((f) => (
          <button
            type="button"
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 text-[11px] font-semibold py-2 px-3 rounded-xl border transition-all ${
              filter === f.key
                ? "bg-orange-500 text-white border-orange-500 shadow-md"
                : "bg-white text-foreground border-orange-200 hover:border-orange-400"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-card">
            <Search className="w-10 h-10 text-orange-200 mx-auto mb-3" />
            <p className="font-semibold text-foreground">No orders found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your search or filter
            </p>
          </div>
        )}
        {filteredOrders.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className="bg-white rounded-2xl p-4 shadow-card border border-transparent hover:border-orange-100 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    INR
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      order.status === "Succeed"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {order.status}
                  </span>
                  {order.hot && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5" /> Hot
                    </span>
                  )}
                </div>
                <div className="flex gap-4">
                  <p className="text-sm text-foreground">
                    <span className="text-muted-foreground text-xs">
                      Amount:{" "}
                    </span>
                    <span className="font-bold">
                      ₹{order.amount.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-sm text-foreground">
                    <span className="text-muted-foreground text-xs">
                      Income:{" "}
                    </span>
                    <span className="font-bold text-green-600">
                      +₹{order.income.toFixed(2)}
                    </span>
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {order.code} · {order.date}
                </p>
              </div>
              <div className="ml-3 shrink-0">
                {order.status === "Succeed" && !order.claimed ? (
                  <Button
                    size="sm"
                    onClick={() => handleOpenClaim(order)}
                    className={`text-white text-xs rounded-xl px-4 h-9 font-bold ${
                      order.hot
                        ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md"
                        : "bg-orange-500 hover:bg-orange-600"
                    }`}
                  >
                    Claim
                  </Button>
                ) : order.claimed ? (
                  <span className="text-xs text-green-600 font-semibold bg-green-50 px-3 py-1.5 rounded-xl border border-green-200">
                    Claimed
                  </span>
                ) : (
                  <span className="text-xs text-red-400 font-semibold bg-red-50 px-3 py-1.5 rounded-xl border border-red-200">
                    Failed
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
