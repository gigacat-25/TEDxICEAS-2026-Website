import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getSpeakers } from "@/app/actions/speakers";
import { getSchedule } from "@/app/actions/schedule";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let speakers: any[] = [];
  let schedule: any[] = [];

  try {
    speakers = await getSpeakers();
    schedule = await getSchedule();
  } catch (error) {
    console.error("Failed to fetch dynamic content:", error);
    // In local dev, DB might not be bound. We could fallback to mock data or empty.
  }

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
                href="/dashboard"
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
              <div className="grid md:grid-cols-1 gap-12 pt-8">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white uppercase italic tracking-tighter">What is TEDx?</h3>
                  <p className="text-lg md:text-xl text-white/50 leading-relaxed font-light">
                    In the spirit of discovering and spreading ideas, TED has created a program called TEDx. TEDx is a program of local, self-organized events that bring people together to share a TED-like experience. Our event is called TEDxICEAS, where x = independently organized TED event. At our TEDxICEAS event, TED Talks video and live speakers will combine to spark deep discussion and connection in a small group. The TED Conference provides general guidance for the TEDx program, but individual TEDx events, including ours, are self-organized.
                  </p>
                  <a 
                    href="https://www.ted.com/about/programs-initiatives/tedx-program" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block text-ted-red hover:text-white transition-colors font-bold uppercase tracking-widest text-xs border-b border-ted-red pb-1"
                  >
                    Learn more about the TEDx program
                  </a>
                </div>
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



        {/* SCHEDULE SECTION */}
        <section id="schedule" className="min-h-screen py-32 px-6 md:px-20 lg:px-40 bg-transparent">
          <div className="max-w-5xl">
            <header className="mb-24 space-y-6 text-center md:text-left">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-ted-red font-bold">Program</p>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic">Timeline</h2>
            </header>
            <div className="divide-y divide-white/5">
              {schedule.map((item, i) => (
                <div key={item.id || i} className="group py-12 flex flex-col md:flex-row md:items-baseline gap-6 md:gap-16 hover:bg-white/[0.02] transition-colors relative overflow-hidden px-4">
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
              <Link href="/dashboard" className="relative z-10 flex items-center justify-between group bg-white px-10 py-6 text-ted-red font-black uppercase tracking-widest text-sm hover:translate-x-4 transition-all duration-300">
                Register Now
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
