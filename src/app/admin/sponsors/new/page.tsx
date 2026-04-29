"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewSponsorPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/admin/sponsors");
    }, 1000);
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/sponsors"
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Sponsor</h1>
          <p className="text-muted-foreground mt-2">
            Add a new sponsor or partner.
          </p>
        </div>
      </div>

      <Card className="bg-black/40 border-white/10">
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Company Name</label>
              <input 
                id="name"
                required
                className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ted-red focus:border-transparent"
                placeholder="Acme Corp"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="tier" className="text-sm font-medium">Sponsorship Tier</label>
              <select 
                id="tier"
                required
                className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ted-red focus:border-transparent"
              >
                <option value="platinum">Platinum</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="partner">Partner</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">Website URL (Optional)</label>
              <input 
                id="url"
                type="url"
                className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ted-red focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Company Logo</label>
              <div className="border-2 border-dashed border-white/10 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors">
                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 5MB). SVG preferred.</p>
                <input type="file" className="hidden" accept="image/*" />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
              <Link 
                href="/admin/sponsors"
                className="px-4 py-2 rounded-md font-medium hover:bg-white/10 transition-colors"
              >
                Cancel
              </Link>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-ted-red hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Sponsor"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
