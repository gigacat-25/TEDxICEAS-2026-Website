"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { updateTeamMember, getTeamMemberById } from "@/app/actions/team";

const TEAM_GROUPS = ["Core Team", "Design", "Marketing", "Logistics", "Technical", "Curation"];

export default function EditTeamMemberPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "", teamGroup: TEAM_GROUPS[0] });

  useEffect(() => {
    getTeamMemberById(id).then((member) => {
      if (!member) { router.push("/admin/team"); return; }
      setForm({ name: member.name, role: member.role, teamGroup: member.teamGroup ?? TEAM_GROUPS[0] });
      if (member.imageUrl) setPreviewUrl(member.imageUrl);
      setIsLoading(false);
    });
  }, [id, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imageUrl: string | undefined;
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);
        const res = await fetch("/api/upload", { method: "POST", body: uploadFormData });
        if (!res.ok) throw new Error("Upload failed");
        const { url } = await res.json() as { url: string };
        imageUrl = url;
      }
      await updateTeamMember(id, { ...form, ...(imageUrl ? { imageUrl } : {}) });
      router.push("/admin/team");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to update team member.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-ted-red" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/team" className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Edit Team Member</h1>
          <p className="text-muted-foreground mt-2">Update team member information.</p>
        </div>
      </div>

      <Card className="bg-black/40 border-white/10">
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-white">Full Name</label>
              <input id="name" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ted-red focus:border-transparent" />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-white">Role</label>
              <input id="role" required value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ted-red focus:border-transparent" />
            </div>

            <div className="space-y-2">
              <label htmlFor="teamGroup" className="text-sm font-medium text-white">Team Group</label>
              <select id="teamGroup" value={form.teamGroup}
                onChange={(e) => setForm({ ...form, teamGroup: e.target.value })}
                className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ted-red focus:border-transparent">
                {TEAM_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Profile Image</label>
              <div onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="max-h-48 rounded-md mb-2" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-white">Click to replace image</p>
                  </>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
              <Link href="/admin/team" className="px-4 py-2 rounded-md font-medium text-white hover:bg-white/10 transition-colors">
                Cancel
              </Link>
              <button type="submit" disabled={isSubmitting}
                className="bg-ted-red hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 flex items-center gap-2">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
