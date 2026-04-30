"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { updateSpeaker, getSpeakerById } from "@/app/actions/speakers";

export default function EditSpeakerPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "", bio: "" });

  useEffect(() => {
    getSpeakerById(id).then((speaker) => {
      if (!speaker) { router.push("/admin/speakers"); return; }
      setForm({ name: speaker.name, role: speaker.role, bio: speaker.bio ?? "" });
      if (speaker.imageUrl) setPreviewUrl(speaker.imageUrl);
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
      await updateSpeaker(id, { ...form, ...(imageUrl ? { imageUrl } : {}) });
      router.push("/admin/speakers");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to update speaker.");
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
        <Link href="/admin/speakers" className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Edit Speaker</h1>
          <p className="text-muted-foreground mt-2">Update speaker information.</p>
        </div>
      </div>

      <Card className="bg-black/40 border-white/10">
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-white">Full Name</label>
              <input id="name" name="name" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ted-red focus:border-transparent" />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-white">Title/Role</label>
              <input id="role" name="role" required value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ted-red focus:border-transparent" />
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium text-white">Biography</label>
              <textarea id="bio" name="bio" rows={4} value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="flex w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ted-red focus:border-transparent resize-none" />
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
              <Link href="/admin/speakers" className="px-4 py-2 rounded-md font-medium text-white hover:bg-white/10 transition-colors">
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
