import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function TeamPage() {
  // In a real implementation, fetch team members from the database here
  const team = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground mt-2">
            Manage the core organizing team members.
          </p>
        </div>
        <Link 
          href="/admin/team/new"
          className="bg-ted-red hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Team Member
        </Link>
      </div>

      <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle>All Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          {team.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No team members found. Click "Add Team Member" to create one.
            </div>
          ) : (
            <div className="grid gap-4">
              {/* Team list will go here */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
