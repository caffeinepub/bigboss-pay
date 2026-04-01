import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Plus, Trash2, Wrench } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface UpiEntry {
  id: string;
  upi: string;
  addedAt: string;
}

interface Props {
  username: string;
}

export default function StatisticsPage({ username }: Props) {
  const storageKey = `inr_upi_${username}`;

  function loadUpiList(): UpiEntry[] {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {
      return [];
    }
  }

  const [upiInput, setUpiInput] = useState("");
  const [upiError, setUpiError] = useState("");
  const [upiList, setUpiList] = useState<UpiEntry[]>(loadUpiList);
  const [successMsg, setSuccessMsg] = useState("");

  function saveUpiList(list: UpiEntry[]) {
    localStorage.setItem(storageKey, JSON.stringify(list));
  }

  function handleAddUpi() {
    setUpiError("");
    setSuccessMsg("");
    const val = upiInput.trim();
    if (!val) {
      setUpiError("Please enter a UPI ID");
      return;
    }
    if (!val.includes("@")) {
      setUpiError("Invalid UPI ID format (e.g. name@bank)");
      return;
    }
    if (upiList.find((u) => u.upi === val)) {
      setUpiError("This UPI ID is already added");
      return;
    }
    const entry: UpiEntry = {
      id: Date.now().toString(),
      upi: val,
      addedAt: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
    const updated = [...upiList, entry];
    setUpiList(updated);
    saveUpiList(updated);
    setUpiInput("");
    setSuccessMsg("UPI ID added successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  }

  function handleRemoveUpi(id: string) {
    const updated = upiList.filter((u) => u.id !== id);
    setUpiList(updated);
    saveUpiList(updated);
  }

  return (
    <div className="px-4 pt-14 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
          <Wrench className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">UPI Tool</h1>
          <p className="text-xs text-muted-foreground">
            Manage your UPI payment methods
          </p>
        </div>
      </div>

      {/* Limit Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-orange-500 rounded-2xl p-4 mb-5 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-xs">Per UPI Limit</p>
            <p className="text-2xl font-bold">₹1,00,000</p>
          </div>
          <div className="bg-white/20 rounded-xl px-3 py-2">
            <p className="text-xs text-white/80">Daily Limit</p>
            <p className="font-bold text-sm">₹1,00,000/UPI</p>
          </div>
        </div>
        <p className="text-white/60 text-[10px] mt-2">
          Maximum transaction limit per UPI ID is ₹1,00,000
        </p>
      </motion.div>

      {/* Add UPI Box */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl shadow-card p-5 mb-5"
      >
        <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-orange-500" /> Add Your UPI
        </h2>
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-semibold text-foreground/70 mb-1.5 block">
              UPI ID
            </Label>
            <Input
              placeholder="Enter UPI ID (e.g. name@okicici)"
              value={upiInput}
              onChange={(e) => {
                setUpiInput(e.target.value);
                setUpiError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddUpi();
              }}
              className="rounded-xl border-orange-200 focus-visible:ring-orange-400"
            />
          </div>
          {upiError && (
            <p className="text-red-500 text-sm font-medium">{upiError}</p>
          )}
          {successMsg && (
            <p className="text-green-600 text-sm font-medium flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> {successMsg}
            </p>
          )}
          <Button
            onClick={handleAddUpi}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-11"
          >
            Add UPI ID
          </Button>
        </div>
      </motion.div>

      {/* UPI List */}
      {upiList.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <h3 className="font-bold text-foreground text-sm">Your UPI IDs</h3>
          {upiList.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-4 shadow-card flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-sm text-foreground">
                  {entry.upi}
                </p>
                <p className="text-xs text-muted-foreground">
                  Added {entry.addedAt} · Limit: ₹1,00,000
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveUpi(entry.id)}
                className="w-8 h-8 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

      {upiList.length === 0 && (
        <div className="bg-white rounded-2xl p-6 text-center shadow-card">
          <Wrench className="w-8 h-8 text-orange-200 mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">No UPI IDs added yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add your UPI ID above to get started
          </p>
        </div>
      )}

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
    </div>
  );
}
