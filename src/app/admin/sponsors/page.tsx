import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { getSponsors, deleteSponsor } from "@/app/actions/sponsors";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function SponsorsPage() {
  let sponsors: any[] = [];
  let error: string | null = null;
  try {
    sponsors = await getSponsors();
  } catch (e: any) {
    console.error("Failed to fetch sponsors:", e);
    error = e.message || "Unknown error";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Sponsors</h1>
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
          <CardTitle className="text-white">All Sponsors</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-12">
              <p className="text-ted-red font-bold uppercase tracking-widest text-xs">Database Connection Error</p>
              <p className="text-white/40 text-[0.65rem] mt-2 font-mono">{error}</p>
            </div>
          ) : sponsors.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No sponsors found. Click "Add Sponsor" to create one.
            </div>
          ) : (
            <div className="grid gap-4">
              {sponsors.map((sponsor: any, index: number) => (
                <div 
                  key={`${sponsor.id}-${index}`} 
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
                      <h3 className="font-semibold text-white">{sponsor.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{sponsor.tier} Tier</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/sponsors/${sponsor.id}`} className="p-2 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-white">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <DeleteButton 
                      id={sponsor.id} 
                      onDelete={deleteSponsor} 
                      confirmMessage={`Delete sponsor "${sponsor.name}"?`}
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
