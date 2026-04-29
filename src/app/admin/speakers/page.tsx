import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function SpeakersPage() {
  // In a real implementation, fetch speakers from the database here
  const speakers = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Speakers</h1>
          <p className="text-muted-foreground mt-2">
            Manage the speakers for the event.
          </p>
        </div>
        <Link 
          href="/admin/speakers/new"
          className="bg-ted-red hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Speaker
        </Link>
      </div>

      <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle>All Speakers</CardTitle>
        </CardHeader>
        <CardContent>
          {speakers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No speakers found. Click "Add Speaker" to create one.
            </div>
          ) : (
            <div className="grid gap-4">
              {/* Speaker list will go here */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
