"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, ArrowLeft, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { createTeamMember } from "@/app/actions/team";

export default function NewTeamMemberPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setImageUrl(data.url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please check your R2 configuration.");
    } finally {
      setIsUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      teamGroup: formData.get("teamGroup") as string,
      imageUrl: imageUrl,
    };

    try {
      await createTeamMember(data);
      router.push("/admin/team");
    } catch (error) {
      console.error("Error creating team member:", error);
      alert("Failed to save team member. Database connection error.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/team"
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Team Member</h1>
          <p className="text-muted-foreground mt-2">
            Add a new member to the core team.
          </p>
        </div>
      </div>

      <Card className="bg-black/40 border-white/10">
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <input 
                  id="name"
                  name="name"
                  required
                  className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ted-red focus:border-transparent"
                  placeholder="John Smith"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">Role</label>
                <input 
                  id="role"
                  name="role"
                  required
                  className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ted-red focus:border-transparent"
                  placeholder="Lead Organizer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="teamGroup" className="text-sm font-medium">Team Group</label>
              <select 
                id="teamGroup"
                name="teamGroup"
                required
                className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ted-red focus:border-transparent"
              >
                <option value="core">Core Team</option>
                <option value="technical">Technical</option>
                <option value="design">Design & Creative</option>
                <option value="marketing">Marketing & PR</option>
                <option value="speakers">Speaker Curation</option>
                <option value="sponsorship">Sponsorship</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Profile Image</label>
              <div 
                className="border-2 border-dashed border-white/10 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors relative"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                {imageUrl ? (
                  <div className="flex flex-col items-center">
                    <Check className="w-8 h-8 mb-4 text-green-500" />
                    <p className="text-sm font-medium text-green-500">Image uploaded successfully</p>
                    <p className="text-xs text-muted-foreground mt-1">{fileName}</p>
                  </div>
                ) : isUploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-8 h-8 mb-4 animate-spin text-ted-red" />
                    <p className="text-sm font-medium">Uploading to R2...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                  </>
                )}
                <input 
                  id="file-upload"
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
              <Link 
                href="/admin/team"
                className="px-4 py-2 rounded-md font-medium hover:bg-white/10 transition-colors"
              >
                Cancel
              </Link>
              <button 
                type="submit" 
                disabled={isSubmitting || isUploading}
                className="bg-ted-red hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Saving..." : "Save Team Member"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
