import Navbar from "@/components/Navbar";
import Link from "next/link";
import { getSpeakers } from "@/app/actions/speakers";
import { getSponsors } from "@/app/actions/sponsors";

export default async function Home() {
  let speakers: any[] = [];
  let sponsors: any[] = [];

  try {
    speakers = await getSpeakers();
    sponsors = await getSponsors();
  } catch (error) {
    console.error("Failed to fetch dynamic content:", error);
    // In local dev, DB might not be bound. We could fallback to mock data or empty.
  }

  const schedule = [
    { time: "09:00 – 09:45", event: "Registration" },
    { time: "09:45 – 10:10", event: "Opening Ceremony" },
    { time: "10:10 – 10:15", event: "Invocation Song" },
    { time: "10:15 – 10:20", event: "Lighting of the Lamp" },
    { time: "10:20 – 10:35", event: "Welcome · TEDx Video & Theme" },
    { time: "10:35 – 11:00", event: "Dr. Alice Abraham" },
    { time: "11:00 – 11:25", event: "Dr. M A Saleem" },
    { time: "11:25 – 11:50", event: "Dr. Bharath Bylappa" },
    { time: "11:50 – 12:05", event: "Short Break" },
    { time: "12:05 – 12:15", event: "Classical Dance Performance" },
    { time: "12:15 – 12:50", event: "Rida Khan" },
    { time: "12:50 – 01:15", event: "Prahalad Kulkarni" },
    { time: "01:15 – 02:15", event: "Lunch" },
    { time: "02:20 – 02:50", event: "Pramod Chandrashekar" },
    { time: "02:50 – 03:20", event: "Jonathan Thomas Jai" },
    { time: "03:20 – 03:30", event: "Magic Show" },
    { time: "03:30 – 04:00", event: "Tezashwani Tomar" },
    { time: "04:00 – 04:30", event: "Prof. Ar. Vasanth K. Bhat" },
    { time: "04:30 – 05:00", event: "Karen Vincent" },
    { time: "05:00 – 05:20", event: "Tea Break" },
    { time: "05:20 – 05:25", event: "Vote of Thanks" },
    { time: "05:25 onwards", event: "Band Performance" },
  ];

  return (
    <div className="relative min-h-screen text-[#f0f0f0]">
      <Navbar />
      <main className="relative z-10">
        {/* HERO SECTION */}
        <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-6 text-center select-none pt-10">
            <div className="space-y-4 mb-8">
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white animate-in fade-in slide-in-from-bottom-8 duration-1000">
                TEDx<span className="text-[#E62B1E]">ICEAS</span>
              </h1>
              <p className="text-2xl md:text-4xl font-light text-white/60 tracking-[0.2em] uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                Threads of Change
              </p>
            </div>
            <p className="text-lg md:text-2xl font-medium text-white/80 italic animate-in fade-in duration-1000 delay-400">
              April 17th 2025
            </p>
            <div className="pt-4 animate-in fade-in zoom-in-95 duration-1000 delay-500">
              <Link
                href="/#register"
                className="inline-block px-12 py-4 bg-white text-[#E62B1E] font-bold rounded-full hover:scale-105 hover:shadow-2xl hover:shadow-white/10 transition-all duration-300 shadow-xl"
              >
                Get Tickets
              </Link>
            </div>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20">
            <div className="w-[1px] h-12 bg-white animate-pulse" />
          </div>
        </section>

        {/* THEME SECTION */}
        <section id="about" className="min-h-screen flex flex-col justify-center px-6 md:px-20 lg:px-40 py-32 bg-transparent">
          <div className="max-w-6xl mx-auto space-y-20">
            <div className="max-w-4xl space-y-12">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-ted-red font-bold">The Concept</p>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-white">
                Unraveling the <br className="hidden md:block" /> tapestry of <span className="text-ted-red italic">ideas</span>.
              </h2>
              <div className="grid md:grid-cols-2 gap-12 pt-8">
                <p className="text-lg md:text-xl text-white/50 leading-relaxed font-light">
                  In the spirit of discovering and spreading ideas, TED has created TEDx — local, self-organized events that bring people together to share a TED-like experience.
                </p>
                <p className="text-lg md:text-xl text-white/50 leading-relaxed font-light">
                  At <strong className="text-white font-medium">TEDxICEAS</strong>, live speakers and TED Talks videos combine to spark deep discussion. Our 2026 theme, "Threads of Change", explores the forces, stories, and ideas that define our future.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM SECTION */}
        <section id="team" className="py-24 px-6 md:px-20 lg:px-40 bg-transparent">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">Our Team</h2>
            <div className="relative group max-w-4xl mx-auto mb-12">
              <div className="aspect-[16/9] rounded-[2rem] overflow-hidden border border-[#E62B1E]/20 shadow-[0_0_50px_rgba(230,43,30,0.1)]">
                <img 
                  src="https://via.placeholder.com/1200x675/111/fff?text=TEDxICEAS+Team+Photo" 
                  alt="TEDxICEAS Team"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <p className="max-w-5xl mx-auto text-base md:text-lg text-white/90 leading-relaxed mb-10 px-4">
              The <span className="text-[#E62B1E] font-bold">TEDxICEAS</span> team is composed of dedicated volunteers who are passionate about spreading ideas and creating a TED-like experience in our community.
            </p>
            <Link 
              href="/team" 
              className="inline-block px-10 py-3 bg-white text-[#E62B1E] font-bold rounded-xl hover:scale-105 transition-all duration-300"
            >
              Meet the Team
            </Link>
          </div>
        </section>

        {/* SPEAKERS SECTION */}
        <section id="speakers" className="min-h-screen py-32 px-6 md:px-20 lg:px-40 bg-transparent border-t border-white/5">
          <header className="mb-20 space-y-6">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-ted-red font-bold">Global Perspectives</p>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic">The Lineup</h2>
          </header>

          {speakers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-12 gap-y-16">
              {speakers.map((s, i) => (
                <div key={i} className="group space-y-6 text-center">
                  <div className="aspect-square rounded-full overflow-hidden border border-white/10 group-hover:border-ted-red transition-all duration-500 relative max-w-[200px] mx-auto">
                    <img 
                      src={s.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} 
                      alt={s.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-ted-red/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-white font-bold text-lg md:text-xl leading-tight group-hover:text-ted-red transition-colors">{s.name}</h3>
                    <p className="text-white/40 text-[0.6rem] uppercase tracking-widest font-medium leading-tight">{s.role}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-white/20">
              Speaker lineup coming soon.
            </div>
          )}
          
          <div className="mt-20 text-center">
             <Link href="/speakers" className="inline-block border border-white/20 px-12 py-5 text-[0.7rem] uppercase tracking-[0.4em] font-black hover:bg-white hover:text-charcoal transition-all">
                View Detailed Bios
             </Link>
          </div>
        </section>

        {/* SPONSORS SECTION */}
        {sponsors.length > 0 && (
          <section id="sponsors" className="py-32 px-6 md:px-20 lg:px-40 bg-transparent border-t border-white/5">
            <header className="mb-20 space-y-6 text-center">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-ted-red font-bold">Partners</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic">Our Sponsors</h2>
            </header>
            <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
              {sponsors.map((sponsor, i) => (
                <a key={i} href={sponsor.websiteUrl || "#"} target="_blank" rel="noopener noreferrer">
                  <img src={sponsor.logoUrl} alt={sponsor.name} className="h-12 md:h-16 w-auto object-contain" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* SCHEDULE SECTION */}
        <section id="schedule" className="min-h-screen py-32 px-6 md:px-20 lg:px-40 bg-transparent">
          <div className="max-w-5xl">
            <header className="mb-24 space-y-6 text-center md:text-left">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-ted-red font-bold">Program</p>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic">Timeline</h2>
            </header>
            <div className="divide-y divide-white/5">
              {schedule.map((item, i) => (
                <div key={i} className="group py-12 flex flex-col md:flex-row md:items-baseline gap-6 md:gap-16 hover:bg-white/[0.02] transition-colors relative overflow-hidden px-4">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-ted-red scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
                  <span className="text-sm font-mono text-ted-red/60 uppercase tracking-tighter shrink-0 md:w-32">{item.time}</span>
                  <span className="text-3xl md:text-5xl font-bold tracking-tighter text-white/80 group-hover:text-white group-hover:translate-x-4 transition-all duration-500 leading-none">
                    {item.event}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VENUE & REGISTRATION */}
        <section id="register" className="min-h-screen py-32 px-6 md:px-20 lg:px-40 flex flex-col justify-center bg-transparent">
          <div className="grid lg:grid-cols-2 gap-20 items-end">
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-ted-red font-bold">Location</p>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none">THE <br /> VENUE</h2>
              </div>
              <div className="space-y-6 text-white/50 text-xl font-light leading-relaxed">
                <p>
                  <span className="text-white font-bold block mb-2 text-2xl uppercase tracking-tighter italic">Impact College of Engineering</span>
                  Sahakar Nagar, Bengaluru, Karnataka 560092
                </p>
              </div>
            </div>
            <div className="bg-ted-red p-12 md:p-20 rounded-sm space-y-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="text-9xl font-black tracking-tighter">TEDx</span>
              </div>
              <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none relative z-10">SECURE YOUR SEAT.</h3>
              <a href="#" className="relative z-10 flex items-center justify-between group bg-white px-10 py-6 text-ted-red font-black uppercase tracking-widest text-sm hover:translate-x-4 transition-all duration-300">
                Register Now
                <span>→</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 py-20 px-6 md:px-20 lg:px-40 bg-transparent border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 text-white/20">
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-white italic">TEDx<span className="text-ted-red">ICEAS</span></h3>
            <p className="text-[0.65rem] max-w-[200px] uppercase leading-relaxed tracking-widest">
              This independent TEDx event is operated under license from TED.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-20 gap-y-8">
            {['Instagram', 'LinkedIn', 'Twitter'].map(s => (
              <a key={s} href="#" className="text-[0.65rem] uppercase tracking-widest font-bold hover:text-white transition-colors">{s}</a>
            ))}
          </div>
          <p className="text-[0.6rem] uppercase tracking-[0.4em]">&copy; 2026 All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}
