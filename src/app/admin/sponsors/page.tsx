import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { getSponsors, deleteSponsor } from "@/app/actions/sponsors";
import { revalidatePath } from "next/cache";

export default async function SponsorsPage() {
  let sponsors = [];
  try {
    sponsors = await getSponsors();
  } catch (error) {
    console.error("Failed to fetch sponsors:", error);
  }

  async function handleDelete(id: string) {
    "use server";
    await deleteSponsor(id);
    revalidatePath("/admin/sponsors");
  }

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
              {sponsors.map((sponsor: any) => (
                <div 
                  key={sponsor.id} 
                  className="flex items-center justify-between p-4 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 rounded bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 p-2">
                      {sponsor.logoUrl ? (
                        <img 
                          src={sponsor.logoUrl} 
                          alt={sponsor.name} 
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{sponsor.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{sponsor.tier} Tier</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/sponsors/${sponsor.id}`} className="p-2 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-white">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <form action={handleDelete.bind(null, sponsor.id)}>
                      <button 
                        type="submit"
                        className="p-2 hover:bg-red-500/20 rounded-md transition-colors text-muted-foreground hover:text-ted-red"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
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
