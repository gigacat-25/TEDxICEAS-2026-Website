import ParticleSwarm from "@/components/ParticleSwarm";
import Navbar from "@/components/Navbar";

const speakers = [
  { name: "Dr. M A Saleem IPS", role: "Director General of Police, CID Karnataka" },
  { name: "Karen Vincent", role: "Standup Comedian · Entertainer · Influencer" },
  { name: "Jonathan Thomas Jai", role: "Journalist · Writer" },
  { name: "Rida Khan", role: "Content Creator" },
  { name: "Prahalad Kulkarni", role: "Former Indian Air Force Veteran" },
  { name: "Tezashwani Tomar", role: "Senior Brand Manager" },
  { name: "Dr. Bharat Bylappa", role: "Founder of Bharat Groups" },
  { name: "Dr. Alice Abraham", role: "Entrepreneur" },
  { name: "Prof. Ar. Vasanth K. Bhat", role: "Director, Impact School of Architecture" },
  { name: "Pramodh Chandrashekar", role: "Founder of Coincontra" },
];

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

export default function Home() {
  return (
    <div className="relative min-h-screen bg-charcoal text-[#f0f0f0]">
      {/* Background Particles Layer */}
      <ParticleSwarm />

      {/* Navigation */}
      <Navbar />

      {/* Content Layer */}
      <main className="relative z-10">

        {/* ── HERO SECTION ── */}
        <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-6 text-center select-none">
          <div className="relative z-10 text-center w-full px-6 max-w-7xl mx-auto">
            <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
              <p className="text-ted-red text-[0.65rem] md:text-[0.75rem] uppercase tracking-[0.6em] font-black">
                X = Independently Organized TED Event
              </p>
            </div>

            <h1 className="text-6xl md:text-9xl lg:text-[11rem] font-black uppercase tracking-tighter italic leading-[0.8] mb-16 animate-in zoom-in-95 fade-in duration-1000 delay-200 drop-shadow-2xl flex flex-wrap justify-center gap-x-6 md:gap-x-12">
              <span className="text-white">What</span>
              <span className="text-ted-red">Shapes</span>
              <span className="text-white">Us</span>
            </h1>

            <div className="flex flex-col items-center justify-center gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
              <a
                href="#about"
                className="px-16 py-6 bg-white text-charcoal font-black uppercase tracking-[0.3em] text-xs md:text-sm hover:bg-ted-red hover:text-white transition-all duration-500 shadow-2xl group"
              >
                The Experience
                <span className="inline-block ml-3 group-hover:translate-x-2 transition-transform">→</span>
              </a>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20">
            <div className="w-[1px] h-16 bg-white animate-pulse" />
          </div>
        </section>

        {/* ── THEME SECTION ── */}
        <section id="about" className="min-h-screen flex flex-col justify-center px-6 md:px-20 lg:px-40 py-32 bg-gradient-to-b from-transparent via-charcoal/40 to-transparent">
          <div className="max-w-4xl space-y-12">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-ted-red font-bold">The Concept</p>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-white">
              Every curve, <br className="hidden md:block" /> every <span className="text-ted-red italic">void</span>.
            </h2>
            <div className="grid md:grid-cols-2 gap-12 pt-8">
              <p className="text-lg md:text-xl text-white/50 leading-relaxed font-light">
                In the spirit of discovering and spreading ideas, TED has created TEDx — local, self-organized events that bring people together to share a TED-like experience.
              </p>
              <p className="text-lg md:text-xl text-white/50 leading-relaxed font-light">
                At <strong className="text-white font-medium">TEDxICEAS</strong>, live speakers and TED Talks videos combine to spark deep discussion. Our 2026 theme explores the forces, stories, and ideas that define our identity.
              </p>
            </div>
          </div>
        </section>

        {/* ── SPEAKERS SECTION ── */}
        <section id="speakers" className="min-h-screen py-32 px-6 md:px-20 lg:px-40 border-t border-white/5">
          <header className="mb-20 space-y-6">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-ted-red font-bold">Global Perspectives</p>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white">The Lineup</h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-px gap-y-px bg-white/10 border border-white/10 rounded-sm overflow-hidden">
            {speakers.map((s, i) => (
              <div key={i} className="group relative aspect-square bg-charcoal p-10 flex flex-col justify-between hover:bg-ted-red transition-all duration-700">
                <span className="text-5xl font-black text-white/5 group-hover:text-white/10 transition-colors uppercase select-none tracking-tighter">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-white font-bold text-xl md:text-2xl leading-none mb-3 group-hover:translate-x-2 transition-transform duration-500">{s.name}</h3>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-medium group-hover:text-white/70 transition-colors duration-500">{s.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SCHEDULE SECTION ── */}
        <section id="schedule" className="min-h-screen py-32 px-6 md:px-20 lg:px-40 bg-white/[0.01]">
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

        {/* ── VENUE & REGISTRATION ── */}
        <section id="register" className="min-h-screen py-32 px-6 md:px-20 lg:px-40 flex flex-col justify-center">
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
                <p className="text-base text-white/30 max-w-sm tracking-wide">
                  Join us at our tech-forward campus for an immersive day of cinematic talks and groundbreaking innovation.
                </p>
              </div>
            </div>

            <div className="bg-ted-red p-12 md:p-20 rounded-sm space-y-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="text-9xl font-black tracking-tighter">TEDx</span>
              </div>
              <div className="space-y-6 relative z-10">
                <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">SECURE YOUR SEAT.</h3>
                <p className="text-white/80 text-lg leading-relaxed font-medium">Limited spots available for the 2026 flagship event. Experience the viral energy live.</p>
              </div>
              <a href="#" className="relative z-10 flex items-center justify-between group bg-white px-10 py-6 text-ted-red font-black uppercase tracking-widest text-sm hover:translate-x-4 transition-all duration-300">
                Register Now
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 py-20 px-6 md:px-20 lg:px-40 bg-charcoal border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-4">
            <div className="h-10 md:h-12 w-fit">
              <img
                src="/logo-white.png"
                alt="TEDxICEAS Logo"
                className="h-full w-auto object-contain"
              />
            </div>
            <p className="text-white/20 text-[0.65rem] max-w-[200px] uppercase leading-relaxed tracking-widest">
              This independent TEDx event is operated under license from TED.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-20 gap-y-8">
            {['Facebook', 'Instagram', 'LinkedIn', 'Twitter'].map(s => (
              <a key={s} href="#" className="text-[0.65rem] uppercase tracking-widest font-bold text-white/40 hover:text-white transition-colors">{s}</a>
            ))}
          </div>
          <div className="text-right">
            <p className="text-white/10 text-[0.6rem] uppercase tracking-[0.4em]">&copy; 2026 All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
