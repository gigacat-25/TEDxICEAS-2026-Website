"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  id: string;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  confirmMessage?: string;
}

export function DeleteButton({ id, onDelete, confirmMessage = "Are you sure you want to delete this item?" }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm(confirmMessage)) return;

    setIsDeleting(true);
    try {
      const result = await onDelete(id);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Failed to delete item");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 hover:bg-red-500/20 rounded-md transition-colors text-muted-foreground hover:text-ted-red disabled:opacity-50"
      title="Delete"
    >
      {isDeleting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
