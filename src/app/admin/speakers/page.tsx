import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { getSpeakers, deleteSpeaker } from "@/app/actions/speakers";

export default async function SpeakersPage() {
  const speakers = await getSpeakers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Speakers</h1>
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
          <CardTitle className="text-white">All Speakers</CardTitle>
        </CardHeader>
        <CardContent>
          {speakers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No speakers found. Click "Add Speaker" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-muted-foreground text-sm">
                    <th className="py-4 px-4 font-medium">Image</th>
                    <th className="py-4 px-4 font-medium">Name</th>
                    <th className="py-4 px-4 font-medium">Role</th>
                    <th className="py-4 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {speakers.map((speaker) => (
                    <tr key={speaker.id} className="text-white">
                      <td className="py-4 px-4">
                        {speaker.imageUrl ? (
                          <img 
                            src={speaker.imageUrl} 
                            alt={speaker.name} 
                            className="w-10 h-10 rounded-full object-cover border border-white/10"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs">
                            N/A
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 font-medium">{speaker.name}</td>
                      <td className="py-4 px-4 text-muted-foreground">{speaker.role}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/speakers/${speaker.id}`} className="p-2 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-white">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <form action={async () => {
                            "use server";
                            await deleteSpeaker(speaker.id);
                          }}>
                            <button className="p-2 hover:bg-red-500/20 rounded-md transition-colors text-muted-foreground hover:text-ted-red">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

