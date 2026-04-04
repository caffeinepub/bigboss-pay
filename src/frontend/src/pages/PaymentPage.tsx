import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Copy,
  Flame,
  Gift,
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
  type: "INR" | "USDT";
  usdtAmount?: number;
  ratePerUsdt?: number;
}

const INITIAL_INR_ORDERS: Order[] = [
  {
    id: "1",
    code: "INR-38291",
    amount: 305,
    income: 27.45,
    date: "25 Mar 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
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
    type: "INR",
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
    type: "INR",
  },
  {
    id: "4",
    code: "INR-31029",
    amount: 320,
    income: 28.8,
    date: "25 Mar 2026",
    status: "Failed",
    claimed: false,
    type: "INR",
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
    type: "INR",
  },
  {
    id: "6",
    code: "INR-62841",
    amount: 310,
    income: 27.9,
    date: "26 Mar 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
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
    type: "INR",
  },
  {
    id: "8",
    code: "INR-84012",
    amount: 340,
    income: 30.6,
    date: "26 Mar 2026",
    status: "Failed",
    claimed: false,
    type: "INR",
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
    type: "INR",
  },
  {
    id: "10",
    code: "INR-11348",
    amount: 315,
    income: 28.35,
    date: "27 Mar 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
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
    type: "INR",
  },
  {
    id: "12",
    code: "INR-33872",
    amount: 305,
    income: 27.45,
    date: "27 Mar 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "13",
    code: "INR-44193",
    amount: 500,
    income: 45.0,
    date: "28 Mar 2026",
    status: "Failed",
    claimed: false,
    type: "INR",
  },
  {
    id: "14",
    code: "INR-55304",
    amount: 390,
    income: 35.1,
    date: "28 Mar 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
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
    type: "INR",
  },
  {
    id: "16",
    code: "INR-77526",
    amount: 320,
    income: 28.8,
    date: "28 Mar 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
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
    type: "INR",
  },
  {
    id: "18",
    code: "INR-99748",
    amount: 320,
    income: 28.8,
    date: "29 Mar 2026",
    status: "Failed",
    claimed: false,
    type: "INR",
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
    type: "INR",
  },
  {
    id: "20",
    code: "INR-21960",
    amount: 310,
    income: 27.9,
    date: "29 Mar 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "21",
    code: "INR-34571",
    amount: 350,
    income: 31.5,
    date: "29 Mar 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "22",
    code: "INR-45682",
    amount: 620,
    income: 55.8,
    date: "29 Mar 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "23",
    code: "INR-56793",
    amount: 320,
    income: 28.8,
    date: "30 Mar 2026",
    status: "Failed",
    claimed: false,
    type: "INR",
  },
  {
    id: "24",
    code: "INR-67804",
    amount: 710,
    income: 63.9,
    date: "30 Mar 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "25",
    code: "INR-78915",
    amount: 365,
    income: 32.85,
    date: "30 Mar 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "26",
    code: "INR-89026",
    amount: 540,
    income: 48.6,
    date: "30 Mar 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "27",
    code: "INR-90137",
    amount: 305,
    income: 27.45,
    date: "30 Mar 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "28",
    code: "INR-12348",
    amount: 800,
    income: 72.0,
    date: "31 Mar 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "29",
    code: "INR-23459",
    amount: 315,
    income: 28.35,
    date: "31 Mar 2026",
    status: "Failed",
    claimed: false,
    type: "INR",
  },
  {
    id: "30",
    code: "INR-34560",
    amount: 590,
    income: 53.1,
    date: "31 Mar 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "31",
    code: "INR-45671",
    amount: 310,
    income: 27.9,
    date: "31 Mar 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "32",
    code: "INR-56782",
    amount: 760,
    income: 68.4,
    date: "31 Mar 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "33",
    code: "INR-67893",
    amount: 380,
    income: 34.2,
    date: "01 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "34",
    code: "INR-78904",
    amount: 470,
    income: 42.3,
    date: "01 Apr 2026",
    status: "Failed",
    claimed: false,
    type: "INR",
  },
  {
    id: "35",
    code: "INR-89015",
    amount: 650,
    income: 58.5,
    date: "01 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "36",
    code: "INR-90126",
    amount: 305,
    income: 27.45,
    date: "01 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "37",
    code: "INR-11237",
    amount: 910,
    income: 81.9,
    date: "01 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "38",
    code: "INR-22348",
    amount: 355,
    income: 31.95,
    date: "02 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "39",
    code: "INR-33459",
    amount: 680,
    income: 61.2,
    date: "02 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "40",
    code: "INR-44560",
    amount: 320,
    income: 28.8,
    date: "02 Apr 2026",
    status: "Failed",
    claimed: false,
    type: "INR",
  },
  {
    id: "41",
    code: "INR-55671",
    amount: 840,
    income: 75.6,
    date: "02 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "42",
    code: "INR-66782",
    amount: 330,
    income: 29.7,
    date: "02 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "43",
    code: "INR-77893",
    amount: 570,
    income: 51.3,
    date: "02 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "44",
    code: "INR-88904",
    amount: 315,
    income: 28.35,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "45",
    code: "INR-99015",
    amount: 990,
    income: 89.1,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "46",
    code: "INR-10126",
    amount: 345,
    income: 31.05,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "47",
    code: "INR-21237",
    amount: 700,
    income: 63.0,
    date: "03 Apr 2026",
    status: "Failed",
    claimed: false,
    type: "INR",
  },
  {
    id: "48",
    code: "INR-32348",
    amount: 305,
    income: 27.45,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "49",
    code: "INR-43459",
    amount: 860,
    income: 77.4,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "50",
    code: "INR-54560",
    amount: 375,
    income: 33.75,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "51",
    code: "INR-65671",
    amount: 530,
    income: 47.7,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "52",
    code: "INR-76782",
    amount: 315,
    income: 28.35,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "53",
    code: "INR-87893",
    amount: 920,
    income: 82.8,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
  {
    id: "54",
    code: "INR-98904",
    amount: 305,
    income: 27.45,
    date: "03 Apr 2026",
    status: "Failed",
    claimed: false,
    type: "INR",
  },
  {
    id: "55",
    code: "INR-09015",
    amount: 640,
    income: 57.6,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "INR",
  },
];

const INITIAL_USDT_ORDERS: Order[] = [
  {
    id: "u1",
    code: "USDT-10291",
    amount: 5,
    income: 0.45,
    date: "01 Apr 2026",
    status: "Succeed",
    claimed: false,
    hot: false,
    type: "USDT",
    usdtAmount: 5,
    ratePerUsdt: 113,
  },
  {
    id: "u2",
    code: "USDT-20834",
    amount: 10,
    income: 0.9,
    date: "01 Apr 2026",
    status: "Succeed",
    claimed: false,
    hot: true,
    type: "USDT",
    usdtAmount: 10,
    ratePerUsdt: 113,
  },
  {
    id: "u3",
    code: "USDT-31201",
    amount: 20,
    income: 1.8,
    date: "01 Apr 2026",
    status: "Succeed",
    claimed: false,
    hot: true,
    type: "USDT",
    usdtAmount: 20,
    ratePerUsdt: 114,
  },
  {
    id: "u4",
    code: "USDT-41029",
    amount: 8,
    income: 0.72,
    date: "02 Apr 2026",
    status: "Failed",
    claimed: false,
    type: "USDT",
    usdtAmount: 8,
    ratePerUsdt: 112,
  },
  {
    id: "u5",
    code: "USDT-52392",
    amount: 15,
    income: 1.35,
    date: "02 Apr 2026",
    status: "Succeed",
    claimed: false,
    hot: true,
    type: "USDT",
    usdtAmount: 15,
    ratePerUsdt: 113,
  },
  {
    id: "u6",
    code: "USDT-62841",
    amount: 25,
    income: 2.25,
    date: "02 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "USDT",
    usdtAmount: 25,
    ratePerUsdt: 114,
  },
  {
    id: "u7",
    code: "USDT-73923",
    amount: 50,
    income: 4.5,
    date: "02 Apr 2026",
    status: "Succeed",
    claimed: false,
    hot: true,
    type: "USDT",
    usdtAmount: 50,
    ratePerUsdt: 116,
  },
  {
    id: "u8",
    code: "USDT-84012",
    amount: 30,
    income: 2.7,
    date: "03 Apr 2026",
    status: "Failed",
    claimed: false,
    type: "USDT",
    usdtAmount: 30,
    ratePerUsdt: 111,
  },
  {
    id: "u9",
    code: "USDT-90234",
    amount: 12,
    income: 1.08,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
    hot: true,
    type: "USDT",
    usdtAmount: 12,
    ratePerUsdt: 115,
  },
  {
    id: "u10",
    code: "USDT-11348",
    amount: 7,
    income: 0.63,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "USDT",
    usdtAmount: 7,
    ratePerUsdt: 112,
  },
  {
    id: "u11",
    code: "USDT-22561",
    amount: 40,
    income: 3.6,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
    hot: true,
    type: "USDT",
    usdtAmount: 40,
    ratePerUsdt: 116,
  },
  {
    id: "u12",
    code: "USDT-33872",
    amount: 6,
    income: 0.54,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "USDT",
    usdtAmount: 6,
    ratePerUsdt: 113,
  },
  {
    id: "u13",
    code: "USDT-44193",
    amount: 100,
    income: 9.0,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
    hot: true,
    type: "USDT",
    usdtAmount: 100,
    ratePerUsdt: 115,
  },
  {
    id: "u14",
    code: "USDT-55304",
    amount: 18,
    income: 1.62,
    date: "03 Apr 2026",
    status: "Failed",
    claimed: false,
    type: "USDT",
    usdtAmount: 18,
    ratePerUsdt: 114,
  },
  {
    id: "u15",
    code: "USDT-66415",
    amount: 9,
    income: 0.81,
    date: "03 Apr 2026",
    status: "Succeed",
    claimed: false,
    type: "USDT",
    usdtAmount: 9,
    ratePerUsdt: 111,
  },
];

const USDT_ADDRESS = "TTv5LNczW5ETb17i9ZF6CRDLtc9E9uLZXM";

type Filter = "all" | "300-400" | "400-600" | "600+";
type UsdtFilter = "all" | "5-10" | "10-25" | "25+";
type PaymentTab = "INR" | "USDT";

interface Props {
  username: string;
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
  const [paymentTab, setPaymentTab] = useState<PaymentTab>("INR");

  // INR state
  const [orders, setOrders] = useState<Order[]>(INITIAL_INR_ORDERS);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  // USDT state
  const [usdtOrders, setUsdtOrders] = useState<Order[]>(INITIAL_USDT_ORDERS);
  const [usdtFilter, setUsdtFilter] = useState<UsdtFilter>("all");
  const [usdtSearch, setUsdtSearch] = useState("");

  // Shared claim state
  const [claimingOrder, setClaimingOrder] = useState<Order | null>(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [utr, setUtr] = useState("");
  const [utrError, setUtrError] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // USDT QR popup state
  const [showUsdtQr, setShowUsdtQr] = useState(false);
  const [usdtClaimOrder, setUsdtClaimOrder] = useState<Order | null>(null);
  const [addressCopied, setAddressCopied] = useState(false);

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

  // INR filters
  const filteredOrders = orders.filter((o) => {
    const matchFilter =
      filter === "all" ||
      (filter === "300-400" && o.amount >= 300 && o.amount <= 400) ||
      (filter === "400-600" && o.amount > 400 && o.amount <= 600) ||
      (filter === "600+" && o.amount > 600);
    const matchSearch =
      !search ||
      o.code.toLowerCase().includes(search.toLowerCase()) ||
      o.amount.toString().includes(search);
    return matchFilter && matchSearch;
  });

  // USDT filters
  const filteredUsdtOrders = usdtOrders.filter((o) => {
    const matchFilter =
      usdtFilter === "all" ||
      (usdtFilter === "5-10" && o.amount >= 5 && o.amount <= 10) ||
      (usdtFilter === "10-25" && o.amount > 10 && o.amount <= 25) ||
      (usdtFilter === "25+" && o.amount > 25);
    const matchSearch =
      !usdtSearch ||
      o.code.toLowerCase().includes(usdtSearch.toLowerCase()) ||
      o.amount.toString().includes(usdtSearch);
    return matchFilter && matchSearch;
  });

  const countAll = orders.length;
  const count1 = orders.filter(
    (o) => o.amount >= 300 && o.amount <= 400,
  ).length;
  const count2 = orders.filter((o) => o.amount > 400 && o.amount <= 600).length;
  const count3 = orders.filter((o) => o.amount > 600).length;

  const succeedOrders = orders.filter((o) => o.status === "Succeed");
  const totalPotentialEarn = succeedOrders.reduce(
    (sum, o) => sum + o.income,
    0,
  );

  const succeedUsdtOrders = usdtOrders.filter((o) => o.status === "Succeed");
  const totalUsdtEarn = succeedUsdtOrders.reduce((sum, o) => sum + o.income, 0);

  function handleOpenClaim(order: Order) {
    if (order.type === "USDT") {
      // For USDT orders: show QR + address popup
      setUsdtClaimOrder(order);
      setAddressCopied(false);
      setShowUsdtQr(true);
    } else {
      // For INR orders: show UTR/screenshot form
      setClaimingOrder(order);
      setOrderSubmitted(false);
      setUtr("");
      setUtrError("");
      setScreenshot(null);
    }
  }

  function handleUsdtDone() {
    if (usdtClaimOrder) {
      // Mark the USDT order as claimed
      setUsdtOrders((prev) =>
        prev.map((o) =>
          o.id === usdtClaimOrder.id ? { ...o, claimed: true } : o,
        ),
      );
      // Add to processing orders
      const processingOrder: ProcessingOrder = {
        id: usdtClaimOrder.id,
        utr: USDT_ADDRESS,
        amount:
          usdtClaimOrder.usdtAmount! * (usdtClaimOrder.ratePerUsdt ?? 113),
        date: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };
      onAddProcessingOrder(processingOrder);
      // Check bonus for 20 USDT
      if (usdtClaimOrder.usdtAmount === 20) setBonusClaimed(true);
    }
    setShowUsdtQr(false);
    setUsdtClaimOrder(null);
  }

  function handleCopyAddress() {
    navigator.clipboard.writeText(USDT_ADDRESS).then(() => {
      setAddressCopied(true);
      setTimeout(() => setAddressCopied(false), 2000);
    });
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

  // USDT QR Popup (shown as full-screen overlay)
  if (showUsdtQr && usdtClaimOrder) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="usdt-qr"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="min-h-screen bg-[#F0FAF8] px-4 pt-14 pb-8 flex flex-col"
        >
          <button
            type="button"
            onClick={() => {
              setShowUsdtQr(false);
              setUsdtClaimOrder(null);
            }}
            className="flex items-center gap-2 text-teal-600 font-semibold mb-5"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Payment
          </button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="bg-gradient-to-br from-teal-600 to-emerald-500 rounded-3xl p-5 text-white mb-5 shadow-lg text-center"
          >
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
              Sell USDT
            </p>
            <h2 className="text-xl font-bold">Send USDT to this Address</h2>
            <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 mt-2">
              <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
              <p className="text-xs font-bold">TRC20 Network Only</p>
            </div>
          </motion.div>

          {/* Order info */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-white rounded-2xl px-4 py-3 mb-4 shadow-card flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-muted-foreground">
                {usdtClaimOrder.code}
              </p>
              <p className="text-sm font-bold text-teal-700">
                ₮ {usdtClaimOrder.usdtAmount} USDT
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Rate</p>
              <p className="text-sm font-bold">
                ₹{usdtClaimOrder.ratePerUsdt}/USDT
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-sm font-bold text-green-600">
                ₹
                {(
                  usdtClaimOrder.usdtAmount! *
                  (usdtClaimOrder.ratePerUsdt ?? 113)
                ).toFixed(0)}
              </p>
            </div>
          </motion.div>

          {/* QR Code */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-5 mb-4 shadow-card flex flex-col items-center"
          >
            <img
              src="/assets/yhhjk-019d58f2-7add-7340-b5e2-637cb8b5e309.jpg"
              alt="USDT TRC20 QR Code"
              className="w-56 h-56 rounded-2xl border-4 border-teal-100 object-contain"
            />
            <p className="text-xs text-muted-foreground mt-3 font-medium">
              Scan QR to get the USDT address
            </p>
          </motion.div>

          {/* Address copy */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13 }}
            className="bg-white rounded-2xl p-4 mb-5 shadow-card"
          >
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
              USDT Address (TRC20)
            </p>
            <div className="bg-teal-50 border border-teal-200 rounded-xl px-3 py-2.5 mb-3">
              <p className="font-mono text-xs text-teal-800 break-all leading-relaxed">
                {USDT_ADDRESS}
              </p>
            </div>
            <Button
              onClick={handleCopyAddress}
              className={`w-full font-bold rounded-xl h-11 transition-all ${
                addressCopied
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-teal-600 hover:bg-teal-700 text-white"
              }`}
            >
              <Copy className="w-4 h-4 mr-2" />
              {addressCopied ? "Copied! ✓" : "Copy Address"}
            </Button>
          </motion.div>

          {/* Bonus reminder for 20 USDT */}
          {usdtClaimOrder.usdtAmount === 20 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-3 mb-4 flex items-center gap-3"
            >
              <Gift className="w-8 h-8 text-green-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-green-700">Bonus Order!</p>
                <p className="text-xs text-green-600">
                  Send 20 USDT and get{" "}
                  <span className="font-bold">10 USDT FREE</span> bonus!
                </p>
              </div>
            </motion.div>
          )}

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-5">
            <p className="text-xs font-bold text-amber-700 mb-0.5">
              ⚠️ Important
            </p>
            <p className="text-xs text-amber-600">
              Only send on the TRC20 network. Sending on any other network will
              result in permanent loss of funds.
            </p>
          </div>

          {/* Done Button */}
          <Button
            onClick={handleUsdtDone}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-12 text-base"
          >
            I have sent the USDT — Done
          </Button>
        </motion.div>
      </AnimatePresence>
    );
  }

  // INR Claim detail view
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
                  Scan QR &amp; complete within time limit
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Clock className="w-4 h-4 text-white/80" />
                  <span
                    className={`font-bold text-lg ${
                      timeLeft < 60 ? "text-red-200" : "text-white"
                    }`}
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
                    className={`w-full border-2 border-dashed rounded-xl p-4 flex flex-col items-center gap-2 transition-colors ${
                      screenshot
                        ? "border-green-400 bg-green-50"
                        : "border-orange-200 bg-orange-50 hover:border-orange-400"
                    }`}
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
      {/* Header Card — INR only */}
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
        <div className="bg-white/15 rounded-2xl px-4 py-3">
          <p className="text-white/60 text-[10px] mb-0.5">INR Balance</p>
          <p className="text-2xl font-bold">₹{balance.toFixed(0)}</p>
        </div>
        <p className="text-white/50 text-[10px] mt-3 flex items-center gap-1">
          <Zap className="w-3 h-3" /> Use Freecharge or Mobikwik wallet for
          payment
        </p>
      </motion.div>

      {/* INR / USDT Tab Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04 }}
        className="flex gap-2 mb-4"
      >
        <button
          type="button"
          onClick={() => setPaymentTab("INR")}
          className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all border-2 ${
            paymentTab === "INR"
              ? "bg-orange-500 text-white border-orange-500 shadow-md"
              : "bg-white text-foreground border-orange-200 hover:border-orange-400"
          }`}
        >
          🇮🇳 INR Orders
        </button>
        <button
          type="button"
          onClick={() => setPaymentTab("USDT")}
          className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all border-2 ${
            paymentTab === "USDT"
              ? "bg-teal-600 text-white border-teal-600 shadow-md"
              : "bg-white text-foreground border-teal-200 hover:border-teal-400"
          }`}
        >
          ₮ USDT Orders
        </button>
      </motion.div>

      {paymentTab === "INR" ? (
        <>
          {/* INR Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl p-4 shadow-card mb-4 border border-orange-100"
          >
            <p className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-orange-500" /> INR
              ANALYTICS
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-orange-50 rounded-xl p-3">
                <p className="text-[10px] text-orange-500 font-semibold uppercase tracking-wide">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {succeedOrders.length}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Succeed orders
                </p>
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

          {/* INR Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by code or amount..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl border-orange-200 focus-visible:ring-orange-400 bg-white"
            />
          </div>

          {/* INR Filters */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {[
              { key: "all" as Filter, label: `All (${countAll})` },
              { key: "300-400" as Filter, label: `₹300-400 (${count1})` },
              { key: "400-600" as Filter, label: `₹400-600 (${count2})` },
              { key: "600+" as Filter, label: `₹600+ (${count3})` },
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

          {/* INR Orders List */}
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
        </>
      ) : (
        <>
          {/* USDT Bonus Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.03 }}
            className="bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-400 rounded-3xl p-4 text-white mb-4 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                <Gift className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-bold text-base">🎁 Special USDT Bonus</p>
                <p className="text-white/90 text-xs mt-0.5">
                  Sell <span className="font-bold">20 USDT</span> and get{" "}
                  <span className="font-bold">10 USDT FREE!</span>
                </p>
                <p className="text-white/60 text-[10px] mt-0.5">
                  Rate: ₹111–₹116 per USDT · Min. sell: 5 USDT
                </p>
              </div>
            </div>
          </motion.div>

          {/* Bonus claimed notification */}
          {bonusClaimed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 w-full mb-4 text-white text-center shadow-lg"
            >
              <Gift className="w-8 h-8 mx-auto mb-2" />
              <p className="font-bold text-lg">🎉 Bonus Unlocked!</p>
              <p className="text-sm text-green-100">
                You sold 20 USDT —{" "}
                <span className="font-bold">+10 USDT FREE</span> bonus added to
                your account!
              </p>
            </motion.div>
          )}

          {/* USDT Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl p-4 shadow-card mb-4 border border-teal-100"
          >
            <p className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-teal-500" /> USDT
              ANALYTICS
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-teal-50 rounded-xl p-3">
                <p className="text-[10px] text-teal-600 font-semibold uppercase tracking-wide">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {succeedUsdtOrders.length}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Succeed orders
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-3">
                <p className="text-[10px] text-green-600 font-semibold uppercase tracking-wide">
                  Total Earn
                </p>
                <p className="text-2xl font-bold text-foreground">
                  ₮ {totalUsdtEarn.toFixed(2)}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Potential income
                </p>
              </div>
            </div>
          </motion.div>

          {/* USDT Rate Info */}
          <div className="bg-teal-50 border border-teal-200 rounded-2xl px-4 py-3 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-500 shrink-0" />
            <p className="text-xs text-teal-700">
              Current Rate:{" "}
              <span className="font-bold">₹111 – ₹116 / USDT</span>{" "}
              &nbsp;·&nbsp; Minimum Sell:{" "}
              <span className="font-bold">5 USDT</span>
            </p>
          </div>

          {/* USDT Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search USDT orders..."
              value={usdtSearch}
              onChange={(e) => setUsdtSearch(e.target.value)}
              className="pl-9 rounded-xl border-teal-200 focus-visible:ring-teal-400 bg-white"
            />
          </div>

          {/* USDT Filters */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {[
              { key: "all" as UsdtFilter, label: `All (${usdtOrders.length})` },
              { key: "5-10" as UsdtFilter, label: "5–10 USDT" },
              { key: "10-25" as UsdtFilter, label: "10–25 USDT" },
              { key: "25+" as UsdtFilter, label: "25+ USDT" },
            ].map((f) => (
              <button
                type="button"
                key={f.key}
                onClick={() => setUsdtFilter(f.key)}
                className={`shrink-0 text-[11px] font-semibold py-2 px-3 rounded-xl border transition-all ${
                  usdtFilter === f.key
                    ? "bg-teal-600 text-white border-teal-600 shadow-md"
                    : "bg-white text-foreground border-teal-200 hover:border-teal-400"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* USDT Orders List */}
          <div className="space-y-3">
            {filteredUsdtOrders.length === 0 && (
              <div className="bg-white rounded-2xl p-8 text-center shadow-card">
                <Search className="w-10 h-10 text-teal-200 mx-auto mb-3" />
                <p className="font-semibold text-foreground">
                  No USDT orders found
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your search or filter
                </p>
              </div>
            )}
            {filteredUsdtOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.025 }}
                className={`bg-white rounded-2xl p-4 shadow-card border transition-all ${
                  order.usdtAmount === 20
                    ? "border-green-300 hover:border-green-400"
                    : "border-transparent hover:border-teal-100"
                }`}
              >
                {/* Bonus badge for 20 USDT orders */}
                {order.usdtAmount === 20 && (
                  <div className="flex items-center gap-1.5 mb-2 bg-green-50 border border-green-200 rounded-xl px-2 py-1">
                    <Gift className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-[10px] font-bold text-green-700">
                      Sell this → Get 10 USDT FREE Bonus!
                    </span>
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="bg-teal-100 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        USDT
                      </span>
                      <span className="bg-teal-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        TRC20
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
                    <div className="flex flex-wrap gap-3">
                      <p className="text-sm text-foreground">
                        <span className="text-muted-foreground text-xs">
                          Sell:{" "}
                        </span>
                        <span className="font-bold">₮ {order.usdtAmount}</span>
                      </p>
                      <p className="text-sm text-foreground">
                        <span className="text-muted-foreground text-xs">
                          Rate:{" "}
                        </span>
                        <span className="font-bold text-teal-600">
                          ₹{order.ratePerUsdt}/USDT
                        </span>
                      </p>
                      <p className="text-sm text-foreground">
                        <span className="text-muted-foreground text-xs">
                          Income:{" "}
                        </span>
                        <span className="font-bold text-green-600">
                          +₮ {order.income.toFixed(2)}
                        </span>
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {order.code} · {order.date} · ₹
                      {(order.usdtAmount! * order.ratePerUsdt!).toFixed(0)} INR
                    </p>
                  </div>
                  <div className="ml-3 shrink-0">
                    {order.status === "Succeed" && !order.claimed ? (
                      <Button
                        size="sm"
                        onClick={() => handleOpenClaim(order)}
                        className={`text-white text-xs rounded-xl px-4 h-9 font-bold ${
                          order.usdtAmount === 20
                            ? "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 shadow-md"
                            : order.hot
                              ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-md"
                              : "bg-teal-600 hover:bg-teal-700"
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
        </>
      )}
    </div>
  );
}
