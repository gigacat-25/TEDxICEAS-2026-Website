import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2, User } from "lucide-react";
import Link from "next/link";
import { getTeamMembers, deleteTeamMember } from "@/app/actions/team";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function TeamPage() {
  let team: any[] = [];
  let error: string | null = null;
  try {
    team = await getTeamMembers();
  } catch (e: any) {
    console.error("Failed to fetch team members:", e);
    error = e.message || "Unknown error";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Team</h1>
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
          <CardTitle className="text-white">All Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-12">
              <p className="text-ted-red font-bold uppercase tracking-widest text-xs">Database Connection Error</p>
              <p className="text-white/40 text-[0.65rem] mt-2 font-mono">{error}</p>
            </div>
          ) : team.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No team members found. Click "Add Team Member" to create one.
            </div>
          ) : (
            <div className="grid gap-4">
              {team.map((member: any, index: number) => (
                <div 
                  key={`${member.id}-${index}`} 
                  className="flex items-center justify-between p-4 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-ted-red/20 flex items-center justify-center overflow-hidden border border-white/10">
                      {member.imageUrl ? (
                        <img 
                          src={member.imageUrl} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-ted-red" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role} • <span className="capitalize">{member.teamGroup}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/team/${member.id}`} className="p-2 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-white">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <DeleteButton 
                      id={member.id} 
                      onDelete={deleteTeamMember} 
                      confirmMessage={`Delete team member "${member.name}"?`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
