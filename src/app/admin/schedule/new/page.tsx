"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { addScheduleItem } from "@/app/actions/schedule";

export default function NewSchedulePage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ time: "", event: "", displayOrder: 0 });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const id = crypto.randomUUID();
      await addScheduleItem({ id, ...form });
      router.push("/admin/schedule");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to add schedule item.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/schedule" className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Add Schedule Item</h1>
          <p className="text-muted-foreground mt-2">Create a new timeline event.</p>
        </div>
      </div>

      <Card className="bg-black/40 border-white/10">
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-medium text-white">Time</label>
              <input id="time" name="time" required value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                placeholder="e.g. 09:00 – 09:45"
                className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ted-red focus:border-transparent" />
            </div>

            <div className="space-y-2">
              <label htmlFor="event" className="text-sm font-medium text-white">Event Description</label>
              <input id="event" name="event" required value={form.event}
                onChange={(e) => setForm({ ...form, event: e.target.value })}
                placeholder="e.g. Registration"
                className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ted-red focus:border-transparent" />
            </div>

            <div className="space-y-2">
              <label htmlFor="displayOrder" className="text-sm font-medium text-white">Display Order</label>
              <input id="displayOrder" name="displayOrder" type="number" required value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ted-red focus:border-transparent" />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
              <Link href="/admin/schedule" className="px-4 py-2 rounded-md font-medium text-white hover:bg-white/10 transition-colors">
                Cancel
              </Link>
              <button type="submit" disabled={isSubmitting}
                className="bg-ted-red hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 flex items-center gap-2">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Adding..." : "Add Item"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
