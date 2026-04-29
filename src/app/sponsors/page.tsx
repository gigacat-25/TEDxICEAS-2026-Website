import Navbar from "@/components/Navbar";

const sponsorTiers = [
  {
    name: "Platinum",
    sponsors: [
      { name: "Global Tech", logo: "https://via.placeholder.com/200x100/111/fff?text=Global+Tech" },
      { name: "Future Systems", logo: "https://via.placeholder.com/200x100/111/fff?text=Future+Systems" }
    ]
  },
  {
    name: "Gold",
    sponsors: [
      { name: "Innovate AI", logo: "https://via.placeholder.com/150x75/111/fff?text=Innovate+AI" },
      { name: "Eco Solutions", logo: "https://via.placeholder.com/150x75/111/fff?text=Eco+Solutions" },
      { name: "Next Gen", logo: "https://via.placeholder.com/150x75/111/fff?text=Next+Gen" }
    ]
  },
  {
    name: "Silver",
    sponsors: [
      { name: "Media Partner", logo: "https://via.placeholder.com/120x60/111/fff?text=Media+Partner" },
      { name: "Tech Weekly", logo: "https://via.placeholder.com/120x60/111/fff?text=Tech+Weekly" },
      { name: "Community Hub", logo: "https://via.placeholder.com/120x60/111/fff?text=Community+Hub" },
      { name: "Digital First", logo: "https://via.placeholder.com/120x60/111/fff?text=Digital+First" }
    ]
  }
];

export default function SponsorsPage() {
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
            {sponsorTiers.map((tier, i) => (
              <div key={i} className="text-center">
                <h2 className="text-2xl font-bold text-gray-500 uppercase tracking-[0.3em] mb-12">{tier.name} Partners</h2>
                <div className="flex flex-wrap justify-center gap-12 md:gap-20">
                  {tier.sponsors.map((sponsor, j) => (
                    <div key={j} className="group relative w-48 md:w-64">
                      <div className="aspect-[2/1] bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center p-8 group-hover:border-[#E62B1E]/50 group-hover:bg-white/10 transition-all duration-500">
                        <img 
                          src={sponsor.logo} 
                          alt={sponsor.name}
                          className="w-full h-auto opacity-50 group-hover:opacity-100 transition-opacity duration-500 filter invert grayscale"
                        />
                      </div>
                      <p className="mt-4 text-sm text-gray-500 group-hover:text-white transition-colors">{sponsor.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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

      <footer className="py-20 px-6 text-center text-gray-500">
        <p>© 2026 TEDxICEAS. This independent TEDx event is operated under license from TED.</p>
      </footer>
    </main>
  );
}
