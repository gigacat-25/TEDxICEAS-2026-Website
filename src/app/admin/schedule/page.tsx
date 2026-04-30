import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit } from "lucide-react";
import Link from "next/link";
import { getSchedule, deleteScheduleItem } from "@/app/actions/schedule";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function SchedulePage() {
  let scheduleItems: any[] = [];
  let error: string | null = null;
  try {
    scheduleItems = await getSchedule();
  } catch (e: any) {
    console.error("Failed to fetch schedule:", e);
    error = e.message || "Unknown error";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Schedule</h1>
          <p className="text-muted-foreground mt-2">
            Manage the event schedule and timeline.
          </p>
        </div>
        <Link 
          href="/admin/schedule/new"
          className="bg-ted-red hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </Link>
      </div>

      <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-12">
              <p className="text-ted-red font-bold uppercase tracking-widest text-xs">Database Connection Error</p>
              <p className="text-white/40 text-[0.65rem] mt-2 font-mono">{error}</p>
            </div>
          ) : scheduleItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No schedule items found. Click "Add Item" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-muted-foreground text-sm">
                    <th className="py-4 px-4 font-medium">Time</th>
                    <th className="py-4 px-4 font-medium">Event</th>
                    <th className="py-4 px-4 font-medium">Order</th>
                    <th className="py-4 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {scheduleItems.map((item, index) => (
                    <tr key={`${item.id}-${index}`} className="text-white">
                      <td className="py-4 px-4 font-mono text-ted-red/80">{item.time}</td>
                      <td className="py-4 px-4 font-medium">{item.event}</td>
                      <td className="py-4 px-4 text-muted-foreground">{item.displayOrder}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/schedule/${item.id}`} className="p-2 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-white">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <DeleteButton 
                            id={item.id} 
                            onDelete={deleteScheduleItem} 
                            confirmMessage={`Delete "${item.event}" from schedule?`}
                          />
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
