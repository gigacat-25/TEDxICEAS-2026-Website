"use client";

import { useState } from "react";
import { updateTicketPrices } from "@/app/actions/tickets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export function PriceEditor({ initialPrices }: { initialPrices: { student: number, general: number } }) {
  const [prices, setPrices] = useState(initialPrices);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setIsSaving(true);
    try {
      await updateTicketPrices(prices.student, prices.general);
      router.refresh();
      alert("Prices updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update prices.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="bg-black/40 border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Global Ticket Prices</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[0.6rem] uppercase tracking-widest text-white/40 font-bold">Student Ticket (₹)</label>
            <input 
              type="number"
              value={prices.student}
              onChange={(e) => setPrices({ ...prices, student: parseInt(e.target.value) || 0 })}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-ted-red transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[0.6rem] uppercase tracking-widest text-white/40 font-bold">General Ticket (₹)</label>
            <input 
              type="number"
              value={prices.general}
              onChange={(e) => setPrices({ ...prices, general: parseInt(e.target.value) || 0 })}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-ted-red transition-all"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 bg-ted-red hover:bg-red-700 text-white py-2 rounded font-bold text-xs uppercase tracking-widest transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          {isSaving ? "Saving..." : "Update Prices"}
        </button>
      </CardContent>
    </Card>
  );
}
