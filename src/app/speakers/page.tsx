import Navbar from "@/components/Navbar";

const speakers = [
  { 
    name: "Dr. M A Saleem IPS", 
    role: "Director General of Police, CID Karnataka",
    bio: "A visionary leader in law enforcement and administrative excellence.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Saleem"
  },
  { 
    name: "Shri Aviram Sharma", 
    role: "Director of Airport Authority of India",
    bio: "Expert in aviation management and infrastructure development.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sharma"
  },
  { 
    name: "Dr. S. R. Ranganath", 
    role: "Physician and Healthcare Innovator",
    bio: "Pioneering new approaches to community healthcare and wellness.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ranganath"
  },
  { 
    name: "Smt. Roopa D. Moudgil", 
    role: "Inspector General of Police",
    bio: "Acclaimed officer known for her integrity and public service.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roopa"
  },
  { 
    name: "Dr. Shalini Rajneesh", 
    role: "Additional Chief Secretary",
    bio: "Leading figure in administrative reform and digital governance.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shalini"
  },
  { 
    name: "Mr. Ricky Kej", 
    role: "Grammy Award Winning Musician",
    bio: "Global environmentalist and world-renowned music composer.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ricky"
  }
];

export default function SpeakersPage() {
  return (
    <main className="min-h-screen bg-transparent text-white">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Our <span className="text-[#E62B1E]">Speakers</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Meet the visionaries who are weaving the threads of change at TEDxICEAS 2026.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {speakers.map((speaker, index) => (
              <div key={index} className="group relative">
                <div className="relative aspect-square rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#E62B1E] transition-all duration-500 mb-8 p-2">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white/5 relative">
                    <img 
                      src={speaker.image} 
                      alt={speaker.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#E62B1E]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-[#E62B1E] transition-colors">{speaker.name}</h3>
                  <p className="text-[#E62B1E] font-medium text-sm mb-4 uppercase tracking-wider">{speaker.role}</p>
                  <p className="text-gray-400 text-sm leading-relaxed px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {speaker.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nomination CTA */}
      <section className="py-20 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Have an idea worth spreading?</h2>
          <p className="text-gray-400 mb-8">We are always looking for voices that can challenge perspectives and inspire our community.</p>
          <button className="px-8 py-4 bg-[#E62B1E] rounded-full font-bold hover:bg-white hover:text-black transition-all duration-300">
            Nominate a Speaker
          </button>
        </div>
      </section>

      <footer className="py-20 px-6 text-center text-gray-500">
        <p>© 2026 TEDxICEAS. This independent TEDx event is operated under license from TED.</p>
      </footer>
    </main>
  );
}
