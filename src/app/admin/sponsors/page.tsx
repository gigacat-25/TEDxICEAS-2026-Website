import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function SponsorsPage() {
  // In a real implementation, fetch sponsors from the database here
  const sponsors = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sponsors</h1>
          <p className="text-muted-foreground mt-2">
            Manage the sponsors and partners for the event.
          </p>
        </div>
        <Link 
          href="/admin/sponsors/new"
          className="bg-ted-red hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Sponsor
        </Link>
      </div>

      <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle>All Sponsors</CardTitle>
        </CardHeader>
        <CardContent>
          {sponsors.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No sponsors found. Click "Add Sponsor" to create one.
            </div>
          ) : (
            <div className="grid gap-4">
              {/* Sponsors list will go here */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
