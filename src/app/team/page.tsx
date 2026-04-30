import Navbar from "@/components/Navbar";
import { getTeamMembers } from "@/app/actions/team";

export default async function TeamPage() {
  let members: any[] = [];
  try {
    members = await getTeamMembers();
  } catch (error) {
    console.error("Failed to fetch team members:", error);
  }

  // Group members by teamGroup
  const groups = members.reduce((acc: any, member) => {
    const group = member.teamGroup || "other";
    if (!acc[group]) acc[group] = [];
    acc[group].push(member);
    return acc;
  }, {});

  const groupOrder = ["core", "technical", "design", "marketing", "speakers", "sponsorship", "other"];
  const sortedGroups = Object.keys(groups).sort((a, b) => {
    return groupOrder.indexOf(a) - groupOrder.indexOf(b);
  });

  const getGroupLabel = (group: string) => {
    switch (group) {
      case "core": return "Core Team";
      case "technical": return "Technical Team";
      case "design": return "Design & Creative";
      case "marketing": return "Marketing & PR";
      case "speakers": return "Speaker Curation";
      case "sponsorship": return "Sponsorship";
      default: return "Organizing Team";
    }
  };

  return (
    <main className="min-h-screen bg-transparent text-white">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              The <span className="text-[#E62B1E]">Team</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The dedicated individuals working behind the scenes to bring "Threads of Change" to life.
            </p>
          </div>

          <div className="space-y-24">
            {members.length === 0 ? (
              <div className="text-center py-20 text-white/20">
                Team details coming soon.
              </div>
            ) : (
              sortedGroups.map((groupKey) => (
                <div key={groupKey}>
                  <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
                    <span className="w-12 h-[2px] bg-[#E62B1E]" />
                    {getGroupLabel(groupKey)}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {groups[groupKey].map((member: any, j: number) => (
                      <div key={j} className="group">
                        <div className="aspect-[4/5] rounded-2xl bg-white/5 border border-white/10 overflow-hidden mb-4 relative">
                          <img 
                            src={member.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} 
                            alt={member.name}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                             <div className="flex gap-2">
                               <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-[#E62B1E] transition-colors cursor-pointer">
                                 <span className="text-xs font-bold">in</span>
                               </div>
                             </div>
                          </div>
                        </div>
                        <h3 className="font-bold group-hover:text-[#E62B1E] transition-colors">{member.name}</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{member.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Join the Team Section */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Want to help?</h2>
          <p className="text-gray-400 mb-8">We are looking for passionate volunteers for the 2026 event.</p>
          <button className="px-8 py-3 border border-[#E62B1E] text-[#E62B1E] rounded-full font-bold hover:bg-[#E62B1E] hover:text-white transition-all">
            Join the Crew
          </button>
        </div>
      </section>

      <footer className="py-20 px-6 text-center text-gray-500">
        <p>© 2026 TEDxICEAS. This independent TEDx event is operated under license from TED.</p>
      </footer>
    </main>
  );
}
