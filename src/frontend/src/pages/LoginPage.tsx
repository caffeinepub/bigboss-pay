import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface Props {
  onLogin: (username: string, password: string) => string | null;
  onRegister: (username: string, password: string) => string | null;
}

export default function LoginPage({ onLogin, onRegister }: Props) {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);

  const [regUser, setRegUser] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regError, setRegError] = useState("");
  const [showRegPass, setShowRegPass] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    if (!loginUser.trim() || !loginPass.trim()) {
      setLoginError("Please fill in all fields");
      return;
    }
    const err = onLogin(loginUser.trim(), loginPass);
    if (err) setLoginError(err);
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegError("");
    if (!regUser.trim() || !regPass.trim() || !regConfirm.trim()) {
      setRegError("Please fill in all fields");
      return;
    }
    if (regPass !== regConfirm) {
      setRegError("Passwords do not match");
      return;
    }
    if (regPass.length < 8) {
      setRegError("Password must be at least 8 characters");
      return;
    }
    const err = onRegister(regUser.trim(), regPass);
    if (err) {
      setRegError(err);
    } else {
      setIsLoading(true);
      setLoadingProgress(0);
      let elapsed = 0;
      const interval = setInterval(() => {
        elapsed += 100;
        setLoadingProgress(Math.min((elapsed / 5000) * 100, 100));
        if (elapsed >= 5000) {
          clearInterval(interval);
          setIsLoading(false);
          setActiveTab("login");
          setRegUser("");
          setRegPass("");
          setRegConfirm("");
        }
      }, 100);
    }
  }

  return (
    <div className="min-h-screen bg-[#FEF3E8] flex flex-col">
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1a1a2e] flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <img
                src="/assets/photo_6229019837539749379_y-019d49aa-e135-73f4-a107-3edb35f48f21.jpg"
                alt="BigBoss Pay"
                className="w-28 h-28 rounded-full object-cover border-4 border-amber-400 shadow-lg mb-6"
              />
              <h2 className="text-3xl font-bold text-amber-400 mb-2">
                BigBoss Pay
              </h2>
              <p className="text-white/60 text-sm mb-10">
                Setting up your account...
              </p>
              <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <p className="text-white/50 text-xs mt-3">
                {Math.round(loadingProgress)}%
              </p>
              <p className="text-white/40 text-xs mt-6">
                Account created successfully! Redirecting to login...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-[#1a1a2e] px-6 pt-14 pb-10 rounded-b-[2.5rem]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-white"
        >
          <img
            src="/assets/photo_6229019837539749379_y-019d49aa-e135-73f4-a107-3edb35f48f21.jpg"
            alt="BigBoss Pay Logo"
            className="w-24 h-24 rounded-full object-cover border-4 border-amber-400 shadow-2xl mb-4"
          />
          <h1 className="text-3xl font-bold tracking-tight text-amber-400">
            BigBoss Pay
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Your trusted trading platform
          </p>
          <div className="mt-4 bg-amber-400/20 border border-amber-400/40 rounded-xl px-4 py-2 text-center">
            <p className="text-amber-300 font-semibold text-sm">
              🎁 Get ₹400 bonus on first login!
            </p>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex-1 px-5 pt-6 pb-8"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-orange-100 rounded-2xl p-1 mb-6">
            <TabsTrigger
              value="login"
              className="flex-1 rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white font-semibold"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="flex-1 rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white font-semibold"
            >
              Register
            </TabsTrigger>
          </TabsList>

          {/* LOGIN */}
          <TabsContent value="login">
            <div className="bg-white rounded-3xl shadow-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-5">
                Welcome back!
              </h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label
                    htmlFor="login-user"
                    className="text-sm font-semibold text-foreground/70 mb-1.5 block"
                  >
                    Username
                  </Label>
                  <Input
                    id="login-user"
                    placeholder="Enter username"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    className="rounded-xl border-orange-200 focus-visible:ring-orange-400"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="login-pass"
                    className="text-sm font-semibold text-foreground/70 mb-1.5 block"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-pass"
                      type={showLoginPass ? "text" : "password"}
                      placeholder="Enter password"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      className="rounded-xl border-orange-200 focus-visible:ring-orange-400 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showLoginPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                {loginError && (
                  <p className="text-red-500 text-sm font-medium">
                    {loginError}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-12 text-base"
                >
                  Login
                </Button>
              </form>
            </div>
          </TabsContent>

          {/* REGISTER */}
          <TabsContent value="register">
            <div className="bg-white rounded-3xl shadow-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-5">
                Create Account
              </h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label
                    htmlFor="reg-user"
                    className="text-sm font-semibold text-foreground/70 mb-1.5 block"
                  >
                    Username
                  </Label>
                  <Input
                    id="reg-user"
                    placeholder="Choose a username"
                    value={regUser}
                    onChange={(e) => setRegUser(e.target.value)}
                    className="rounded-xl border-orange-200 focus-visible:ring-orange-400"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="reg-pass"
                    className="text-sm font-semibold text-foreground/70 mb-1.5 block"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="reg-pass"
                      type={showRegPass ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      className="rounded-xl border-orange-200 focus-visible:ring-orange-400 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showRegPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Password must be at least 8 characters
                  </p>
                </div>
                <div>
                  <Label
                    htmlFor="reg-confirm"
                    className="text-sm font-semibold text-foreground/70 mb-1.5 block"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="reg-confirm"
                    type="password"
                    placeholder="Confirm password"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    className="rounded-xl border-orange-200 focus-visible:ring-orange-400"
                  />
                </div>
                {regError && (
                  <p className="text-red-500 text-sm font-medium">{regError}</p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-12 text-base"
                >
                  Register
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()} BigBoss Pay. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
