import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSponsors } from "@/app/actions/sponsors";

export default async function SponsorsPage() {
  let sponsors: any[] = [];
  try {
    sponsors = await getSponsors();
  } catch (error) {
    console.error("Failed to fetch sponsors:", error);
  }

  // Group sponsors by tier
  const tiers = sponsors.reduce((acc: any, sponsor) => {
    const tier = sponsor.tier || "General";
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(sponsor);
    return acc;
  }, {});

  // Order tiers: Platinum, Gold, Silver, Bronze, etc.
  const tierOrder = ["platinum", "gold", "silver", "bronze", "partner", "general"];
  const sortedTiers = Object.keys(tiers).sort((a, b) => {
    const indexA = tierOrder.indexOf(a.toLowerCase());
    const indexB = tierOrder.indexOf(b.toLowerCase());
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <main className="min-h-screen bg-transparent text-white">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Our <span className="text-[#E62B1E]">Partners</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Collaborating with organizations that believe in the power of ideas worth spreading.
            </p>
          </div>

          <div className="space-y-32">
            {sponsors.length === 0 ? (
              <div className="text-center py-20 text-white/20">
                Partner lineup coming soon.
              </div>
            ) : (
              sortedTiers.map((tierName, i) => (
                <div key={i} className="text-center">
                  <h2 className="text-2xl font-bold text-gray-500 uppercase tracking-[0.3em] mb-12">{tierName} Partners</h2>
                  <div className="flex flex-wrap justify-center gap-12 md:gap-20">
                    {tiers[tierName].map((sponsor: any, j: number) => (
                      <div key={j} className="group relative w-48 md:w-64">
                        <div className="aspect-[2/1] bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center p-8 group-hover:border-[#E62B1E]/50 group-hover:bg-white/10 transition-all duration-500">
                          <img 
                            src={sponsor.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${sponsor.name}`} 
                            alt={sponsor.name}
                            className="w-full h-auto opacity-50 group-hover:opacity-100 transition-opacity duration-500 filter invert grayscale group-hover:grayscale-0 group-hover:invert-0"
                          />
                        </div>
                        <p className="mt-4 text-sm text-gray-500 group-hover:text-white transition-colors">{sponsor.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Become a Sponsor CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl bg-white/5 border border-white/10 p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E62B1E]/10 blur-[100px] -z-10" />
          <h2 className="text-4xl font-bold mb-6">Partner with us</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Gain exposure to a diverse audience of thinkers, doers, and decision-makers at ICEAS.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="px-10 py-4 bg-[#E62B1E] rounded-full font-bold hover:scale-105 transition-transform">
              Download Sponsorship Prospectus
            </button>
            <button className="px-10 py-4 border border-white/20 rounded-full font-bold hover:bg-white/10 transition-colors">
              Contact Partnership Team
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
