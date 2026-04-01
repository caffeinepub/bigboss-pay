import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Bell,
  ChevronRight,
  Copy,
  Gift,
  HelpCircle,
  Lock,
  LogOut,
  MessageCircle,
  Pencil,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import type { ProcessingOrder } from "../App";

interface Props {
  username: string;
  balance: number;
  processingOrders: ProcessingOrder[];
  onLogout: () => void;
  onChangeUsername: (newUsername: string) => string | null;
}

interface ChatMsg {
  id: string;
  from: "user" | "bot";
  text: string;
}

const UPI_SAFETY_RULES = [
  "Never share your UPI PIN with anyone, including bank employees or customer support.",
  "Do not scan unknown QR codes sent by strangers — scammers use fake QR codes to steal money.",
  "Always verify the recipient's UPI ID before sending money.",
  "Avoid using public Wi-Fi while making UPI payments.",
  "Enable app lock or biometric authentication for your UPI app.",
  "Never click on suspicious links claiming to be from your bank or payment app.",
  "Check the registered name before confirming any payment.",
  "Set a daily transaction limit on your UPI account to reduce fraud risk.",
  "Immediately report unauthorized transactions to your bank within 3 hours.",
  "Keep your UPI app updated to the latest version for security patches.",
  "Do not save your UPI PIN in notes, messages, or cloud storage.",
  "Be cautious of 'collect money' requests — accepting them sends money from your account.",
  "Never share OTP received on your phone with any third party.",
  "Use only official UPI apps (BHIM, PhonePe, GPay) — avoid third-party clones.",
  "Log out from UPI apps on shared or borrowed devices immediately after use.",
];

function getRandomRules(count = 5): string[] {
  return [...UPI_SAFETY_RULES].sort(() => Math.random() - 0.5).slice(0, count);
}

const HELP_QA: Record<string, string> = {
  withdraw:
    "To withdraw, go to Home tab and tap the Withdraw button. Minimum withdrawal is ₹500 and you need a UPI ID added in the TOOL tab.",
  upi: "Go to the TOOL tab to add your UPI ID. You can add multiple UPI IDs with a ₹1,00,000 limit each.",
  bonus:
    "₹400 welcome bonus is credited automatically on your first login. It is a one-time reward.",
  balance:
    "Your balance is shown on the Home tab and Profile tab. It updates after each transaction.",
  order:
    "Your orders appear in the Home tab. Payment orders show as Processing, withdrawal orders show as Pending.",
  payment:
    "Go to the Payment tab and tap Claim to make a deposit. You will need to enter a 12-digit UTR number.",
  commission: "BigBoss Pay charges 9% commission on all transactions.",
  default: "I'm not sure about that. Please contact support for more help.",
};

function getBotReply(msg: string): string {
  const m = msg.toLowerCase();
  for (const [key, reply] of Object.entries(HELP_QA)) {
    if (key !== "default" && m.includes(key)) return reply;
  }
  return HELP_QA.default;
}

function getReferralCode(username: string): string {
  const key = `bbp_ref_${username}`;
  let code = localStorage.getItem(key);
  if (!code) {
    const prefix = username.slice(0, 4).toUpperCase().padEnd(4, "X");
    const digits = Math.floor(1000 + Math.random() * 9000).toString();
    code = `BBP${prefix}${digits}`;
    localStorage.setItem(key, code);
  }
  return code;
}

function getUserLevel(
  username: string,
  ordersCount: number,
): { label: string; color: string; emoji: string } {
  const spins = Number.parseInt(
    localStorage.getItem(`bbp_spin_count_${username}`) || "0",
    10,
  );
  const score = spins + ordersCount;
  if (score >= 11)
    return { label: "Platinum", color: "text-purple-600", emoji: "💎" };
  if (score >= 6)
    return { label: "Gold", color: "text-amber-500", emoji: "🥇" };
  if (score >= 3)
    return { label: "Silver", color: "text-slate-500", emoji: "🥈" };
  return { label: "Bronze", color: "text-orange-700", emoji: "🥉" };
}

export default function MyPage({
  username,
  balance,
  processingOrders,
  onLogout,
  onChangeUsername,
}: Props) {
  const [showChangeUsername, setShowChangeUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameDone, setUsernameDone] = useState(false);

  const [showSecurity, setShowSecurity] = useState(false);
  const [safetyRules] = useState<string[]>(() => getRandomRules(5));
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinSaved, setPinSaved] = useState(
    () => !!localStorage.getItem(`bbp_pin_${username}`),
  );

  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [helpMsgs, setHelpMsgs] = useState<ChatMsg[]>([
    {
      id: "help-init",
      from: "bot",
      text: "Hi! I'm the Help Bot. Ask me anything about BigBoss Pay. Try: withdraw, UPI, bonus, payment, commission, balance, order.",
    },
  ]);
  const [helpInput, setHelpInput] = useState("");

  const [showSupport, setShowSupport] = useState(false);
  const [supportMsgs, setSupportMsgs] = useState<ChatMsg[]>([
    {
      id: "support-init",
      from: "bot",
      text: "Hello! Welcome to BigBoss Pay Support. How can I help you today?",
    },
  ]);
  const [supportInput, setSupportInput] = useState("");

  const [showReferral, setShowReferral] = useState(false);
  const [refCopied, setRefCopied] = useState(false);

  const helpEndRef = useRef<HTMLDivElement>(null);
  const supportEndRef = useRef<HTMLDivElement>(null);

  const referralCode = getReferralCode(username);
  const level = getUserLevel(username, processingOrders.length);
  const totalEarned = processingOrders.reduce((sum, o) => sum + o.amount, 0);
  const streak = Number.parseInt(
    localStorage.getItem(`bbp_streak_${username}`) || "1",
    10,
  );
  const initials = username.slice(0, 2).toUpperCase();

  function handleOpenChangeUsername() {
    setNewUsername("");
    setUsernameError("");
    setUsernameDone(false);
    setShowChangeUsername(true);
  }

  function handleSubmitUsername() {
    setUsernameError("");
    const val = newUsername.trim();
    if (!val) {
      setUsernameError("Please enter a username");
      return;
    }
    if (val.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return;
    }
    const err = onChangeUsername(val);
    if (err) {
      setUsernameError(err);
      return;
    }
    setUsernameDone(true);
  }

  function handleSavePin() {
    setPinError("");
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setPinError("PIN must be exactly 4 digits");
      return;
    }
    localStorage.setItem(`bbp_pin_${username}`, pin);
    setPinSaved(true);
    setPin("");
  }

  function sendHelpMsg() {
    const text = helpInput.trim();
    if (!text) return;
    const userMsg: ChatMsg = { id: Date.now().toString(), from: "user", text };
    const botMsg: ChatMsg = {
      id: `bot-${Date.now()}`,
      from: "bot",
      text: getBotReply(text),
    };
    setHelpMsgs((prev) => [...prev, userMsg, botMsg]);
    setHelpInput("");
    setTimeout(
      () => helpEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  }

  function sendSupportMsg() {
    const text = supportInput.trim();
    if (!text) return;
    const userMsg: ChatMsg = { id: Date.now().toString(), from: "user", text };
    const botReply: ChatMsg = {
      id: `support-${Date.now()}`,
      from: "bot",
      text: "Thank you for contacting support! Our team has received your message and will review it shortly. For urgent issues, please provide your username and order details.",
    };
    setSupportMsgs((prev) => [...prev, userMsg, botReply]);
    setSupportInput("");
    setTimeout(
      () => supportEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  }

  function copyReferral() {
    navigator.clipboard.writeText(referralCode).then(() => {
      setRefCopied(true);
      setTimeout(() => setRefCopied(false), 2000);
    });
  }

  const menuItems = [
    {
      icon: <Pencil className="w-5 h-5 text-orange-500" />,
      label: "Change Username",
      desc: "Update your display name",
      bg: "bg-orange-100",
      onClick: handleOpenChangeUsername,
    },
    {
      icon: <Gift className="w-5 h-5 text-pink-500" />,
      label: "Referral Code",
      desc: "Share & earn rewards",
      bg: "bg-pink-100",
      onClick: () => setShowReferral(true),
    },
    {
      icon: <Shield className="w-5 h-5 text-blue-500" />,
      label: "Account Security",
      desc: "UPI safety & PIN lock",
      bg: "bg-blue-100",
      onClick: () => setShowSecurity(true),
    },
    {
      icon: <Bell className="w-5 h-5 text-orange-500" />,
      label: "Notifications",
      desc: "Alerts & updates",
      bg: "bg-orange-100",
      onClick: () => setShowNotifications(true),
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-green-500" />,
      label: "Help Bot",
      desc: "Instant answers 24/7",
      bg: "bg-green-100",
      onClick: () => setShowHelp(true),
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-purple-500" />,
      label: "Contact Us",
      desc: "Talk to our support team",
      bg: "bg-purple-100",
      onClick: () => setShowSupport(true),
    },
  ];

  return (
    <div className="px-4 pt-4 pb-6">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-3xl p-6 text-white mb-5 shadow-xl"
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-amber-400/10 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-amber-400/10 rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <img
                src="/assets/photo_6229019837539749379_y-019d49aa-e135-73f4-a107-3edb35f48f21.jpg"
                alt="BigBoss Pay"
                className="w-8 h-8 rounded-full object-cover border-2 border-amber-400/60"
              />
              <span className="text-amber-400/80 text-xs font-semibold">
                BigBoss Pay
              </span>
            </div>
            <div className="bg-amber-400/20 border border-amber-400/30 rounded-xl px-3 py-1 flex items-center gap-1">
              <span>{level.emoji}</span>
              <span className="text-amber-300 text-xs font-bold">
                {level.label}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            {/* Logo as profile picture */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-amber-400/60 shadow-lg mb-3">
              <img
                src="/assets/photo_6229019837539749379_y-019d49aa-e135-73f4-a107-3edb35f48f21.jpg"
                alt="Profile Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold">{username}</h2>
            <p className="text-white/50 text-sm mt-0.5">BigBoss Pay Member</p>
            <div className="mt-1 bg-amber-400/20 border border-amber-400/30 rounded-full px-3 py-0.5">
              <span className="text-amber-300 text-xs font-mono tracking-wider">
                {initials}
              </span>
            </div>
          </div>

          <div className="mt-4 bg-amber-400/20 border border-amber-400/30 rounded-2xl px-5 py-3 text-center">
            <p className="text-white/50 text-xs">Current Balance</p>
            <p className="text-2xl font-bold text-amber-300">
              ₹{balance.toFixed(2)}
            </p>
          </div>

          {/* Profile Stats Row */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { label: "Orders", value: processingOrders.length },
              { label: "Earned", value: `₹${totalEarned.toFixed(0)}` },
              { label: "Streak", value: `${streak}🔥` },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/10 rounded-xl px-2 py-2 text-center"
              >
                <p className="font-bold text-sm text-amber-300">{s.value}</p>
                <p className="text-white/50 text-[10px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Menu Items */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl shadow-card divide-y divide-orange-50 mb-5"
      >
        {menuItems.map((item, i) => (
          <div
            key={item.label}
            data-ocid={`my.menu.item.${i + 1}`}
            onClick={item.onClick}
            onKeyDown={(e) => {
              if (e.key === "Enter") item.onClick();
            }}
            className="flex items-center gap-4 p-4 cursor-pointer hover:bg-orange-50/50 transition-colors"
          >
            <div
              className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}
            >
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {item.label}
              </p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </div>
        ))}
      </motion.div>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          data-ocid="my.logout.button"
          onClick={onLogout}
          className="w-full bg-red-50 hover:bg-red-100 text-red-500 font-bold rounded-2xl h-12 text-base border border-red-200"
          variant="ghost"
        >
          <LogOut className="w-5 h-5 mr-2" /> Logout
        </Button>
      </motion.div>

      <p className="text-center text-xs text-muted-foreground mt-6">
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

      {/* Change Username */}
      <Dialog open={showChangeUsername} onOpenChange={setShowChangeUsername}>
        <DialogContent className="max-w-[320px] rounded-3xl p-0 overflow-hidden border-0">
          <div className="bg-orange-500 pt-6 pb-5 px-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-white text-xl font-bold">
                Change Username
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="bg-white px-6 py-5">
            {usernameDone ? (
              <div className="text-center py-3">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-bold text-foreground">Username Updated!</p>
                <Button
                  onClick={() => setShowChangeUsername(false)}
                  className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-11"
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Current:{" "}
                  <span className="font-semibold text-foreground">
                    {username}
                  </span>
                </p>
                <Input
                  placeholder="Enter new username"
                  value={newUsername}
                  onChange={(e) => {
                    setNewUsername(e.target.value);
                    setUsernameError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmitUsername();
                  }}
                  className="rounded-xl border-orange-200 focus-visible:ring-orange-400"
                />
                {usernameError && (
                  <p className="text-red-500 text-sm">{usernameError}</p>
                )}
                <Button
                  onClick={handleSubmitUsername}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-11"
                >
                  Update Username
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Referral Dialog */}
      <Dialog open={showReferral} onOpenChange={setShowReferral}>
        <DialogContent className="max-w-[320px] rounded-3xl p-0 overflow-hidden border-0">
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 pt-6 pb-5 px-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
                <Gift className="w-5 h-5" /> Referral Code
              </DialogTitle>
            </DialogHeader>
            <p className="text-white/70 text-xs mt-1">
              Share your code & earn rewards
            </p>
          </div>
          <div className="bg-white px-6 py-6 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">
                YOUR REFERRAL CODE
              </p>
              <div className="bg-gray-50 border-2 border-dashed border-pink-200 rounded-2xl px-4 py-4 text-center">
                <p className="font-mono text-2xl font-bold tracking-widest text-foreground">
                  {referralCode}
                </p>
              </div>
            </div>
            <Button
              onClick={copyReferral}
              className={`w-full font-bold rounded-xl h-11 flex items-center justify-center gap-2 transition-colors ${
                refCopied
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-pink-500 hover:bg-pink-600"
              } text-white`}
            >
              <Copy className="w-4 h-4" />
              {refCopied ? "Copied!" : "Copy Code"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Invite friends to BigBoss Pay and earn referral bonuses when they
              sign up.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Account Security Dialog */}
      <Dialog open={showSecurity} onOpenChange={setShowSecurity}>
        <DialogContent className="max-w-[340px] rounded-3xl p-0 overflow-hidden border-0">
          <div className="bg-blue-600 pt-6 pb-5 px-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
                <Shield className="w-5 h-5" /> Account Security
              </DialogTitle>
            </DialogHeader>
            <p className="text-blue-100 text-xs mt-1">
              UPI Safety Rules — stay protected
            </p>
          </div>
          <div className="bg-white px-6 py-5 space-y-3 max-h-[70vh] overflow-y-auto">
            {safetyRules.map((rule, i) => (
              <div key={rule} className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">
                    {i + 1}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-snug">{rule}</p>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-4 mt-2">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-blue-500" />
                <p className="text-sm font-bold text-foreground">Set App PIN</p>
                {pinSaved && (
                  <span className="ml-auto text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    PIN Set ✓
                  </span>
                )}
              </div>
              {pinSaved ? (
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <p className="text-green-700 text-sm font-semibold">
                    Your account is PIN protected
                  </p>
                  <p className="text-green-600 text-xs mt-0.5">
                    App PIN has been set successfully
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setPinSaved(false);
                      localStorage.removeItem(`bbp_pin_${username}`);
                    }}
                    className="text-xs text-blue-500 mt-2 underline"
                  >
                    Change PIN
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Enter 4-digit PIN"
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
                      setPinError("");
                    }}
                    className="rounded-xl border-blue-200 focus-visible:ring-blue-400 tracking-widest"
                  />
                  {pinError && (
                    <p className="text-red-500 text-xs">{pinError}</p>
                  )}
                  <Button
                    onClick={handleSavePin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-10 text-sm"
                  >
                    Save PIN
                  </Button>
                </div>
              )}
            </div>
            <Button
              onClick={() => setShowSecurity(false)}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-11"
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-[320px] rounded-3xl p-0 overflow-hidden border-0">
          <div className="bg-orange-500 pt-6 pb-5 px-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
                <Bell className="w-5 h-5" /> Notifications
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="bg-white px-6 py-10 text-center">
            <div className="text-5xl mb-4">🔔</div>
            <p className="font-bold text-foreground">No Notifications</p>
            <p className="text-muted-foreground text-sm mt-2">
              You're all caught up! No new notifications at this time.
            </p>
            <Button
              onClick={() => setShowNotifications(false)}
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-11"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Help Bot */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent
          className="max-w-[340px] rounded-3xl p-0 overflow-hidden border-0 flex flex-col"
          style={{ maxHeight: "80vh" }}
        >
          <div className="bg-green-500 pt-5 pb-4 px-5 text-white shrink-0">
            <DialogHeader>
              <DialogTitle className="text-white text-lg font-bold flex items-center gap-2">
                <HelpCircle className="w-5 h-5" /> Help Bot
              </DialogTitle>
            </DialogHeader>
          </div>
          <div
            className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50"
            style={{ minHeight: 0 }}
          >
            {helpMsgs.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${msg.from === "user" ? "bg-green-500 text-white rounded-br-sm" : "bg-white text-foreground shadow-sm rounded-bl-sm"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={helpEndRef} />
          </div>
          <div className="px-4 py-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
            <Input
              placeholder="Ask a question..."
              value={helpInput}
              onChange={(e) => setHelpInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendHelpMsg();
              }}
              className="rounded-xl text-sm"
            />
            <Button
              onClick={sendHelpMsg}
              className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-4 shrink-0"
            >
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Support Bot */}
      <Dialog open={showSupport} onOpenChange={setShowSupport}>
        <DialogContent
          className="max-w-[340px] rounded-3xl p-0 overflow-hidden border-0 flex flex-col"
          style={{ maxHeight: "80vh" }}
        >
          <div className="bg-purple-500 pt-5 pb-4 px-5 text-white shrink-0">
            <DialogHeader>
              <DialogTitle className="text-white text-lg font-bold flex items-center gap-2">
                <MessageCircle className="w-5 h-5" /> Contact Support
              </DialogTitle>
            </DialogHeader>
            <p className="text-white/70 text-xs mt-1">
              We typically reply within 24 hours
            </p>
          </div>
          <div
            className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50"
            style={{ minHeight: 0 }}
          >
            {supportMsgs.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${msg.from === "user" ? "bg-purple-500 text-white rounded-br-sm" : "bg-white text-foreground shadow-sm rounded-bl-sm"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={supportEndRef} />
          </div>
          <div className="px-4 py-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
            <Input
              placeholder="Type your message..."
              value={supportInput}
              onChange={(e) => setSupportInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendSupportMsg();
              }}
              className="rounded-xl text-sm"
            />
            <Button
              onClick={sendSupportMsg}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl px-4 shrink-0"
            >
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
