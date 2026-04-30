"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateTicketStatus, deleteTicket } from "@/app/actions/tickets";
import { Loader2, Trash2 } from "lucide-react";

export function TicketActions({ ticketId, initialStatus }: { ticketId: string, initialStatus: string }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsUpdating(true);
    try {
      await updateTicketStatus(ticketId, e.target.value);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    setIsDeleting(true);
    try {
      await deleteTicket(ticketId);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete ticket");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      <div className="relative">
        <select
          value={initialStatus}
          onChange={handleStatusChange}
          disabled={isUpdating || isDeleting}
          className="appearance-none bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-ted-red disabled:opacity-50"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {isUpdating && <Loader2 className="w-3 h-3 animate-spin absolute right-2 top-1.5 text-ted-red" />}
      </div>
      <button
        onClick={handleDelete}
        disabled={isUpdating || isDeleting}
        className="p-1.5 text-white/40 hover:text-ted-red hover:bg-ted-red/10 rounded transition-colors disabled:opacity-50"
      >
        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
