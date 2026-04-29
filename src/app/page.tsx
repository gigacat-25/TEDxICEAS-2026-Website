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
    <div className="relative min-h-screen bg-transparent overflow-hidden">
      <ParticleSwarm />
      <Navbar />

      <main className="relative z-10 font-sans selection:bg-[#E62B1E] selection:text-white">

        {/* ── HERO ── Shape: Sphere */}
        <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center px-6 md:px-20 relative">
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-[#E62B1E] mb-6 font-medium">
            x = independently organized TED event
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none mb-4 uppercase">
            TEDx<span className="text-[#E62B1E]">ICEAS</span>
          </h1>
          <p className="text-2xl md:text-4xl font-light tracking-wide text-white/70 mb-3">
            What Shapes Us
          </p>
          <p className="text-sm md:text-base text-white/40 mb-10 uppercase tracking-widest">
            2026 · Bengaluru, India
          </p>
          <a
            href="#register"
            className="inline-block bg-[#E62B1E] border border-[#E62B1E] hover:bg-white hover:border-white hover:text-[#E62B1E] text-white font-bold text-sm px-10 py-4 uppercase tracking-[0.2em] transition-all duration-300"
          >
            Get Tickets
          </a>
        </section>

        {/* ── ABOUT ── Shape: Triangle */}
        <section id="about" className="min-h-screen flex flex-col justify-center px-6 md:px-20 lg:px-32 relative">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-[#E62B1E] mb-4">What is TEDx?</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-8">
              The <br /><span className="text-[#E62B1E]">Theme</span>
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-white/60 mb-6">
              In the spirit of discovering and spreading ideas, TED has created a program called TEDx — a series of local, self-organized events that bring people together to share a TED-like experience.
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-white/60">
              Our event is called <strong className="text-white">TEDxICEAS</strong>. At our event, TED Talks video and live speakers combine to spark deep discussion and connection. The TED Conference provides general guidance for the TEDx program, but individual TEDx events are self-organized.
            </p>
          </div>
        </section>

        {/* ── SPEAKERS ── Shape: Square */}
        <section id="speakers" className="min-h-screen flex flex-col justify-center px-6 md:px-20 lg:px-32 relative">
          <p className="text-xs uppercase tracking-[0.3em] text-[#E62B1E] mb-4">Our Lineup</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-12">
            Speakers
          </h2>
          <p className="text-sm md:text-base text-white/40 mb-10 max-w-xl">
            TEDxICEAS brings together thinkers, innovators, and changemakers. Each speaker was carefully selected for their unique perspective and ability to inspire.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {speakers.map((speaker, i) => (
              <div
                key={i}
                className="group bg-white/5 hover:bg-[#E62B1E]/10 p-6 transition-all duration-300 border border-white/10 hover:border-[#E62B1E]/30 rounded-lg backdrop-blur-sm"
              >
                <div className="text-3xl font-black text-white/10 group-hover:text-[#E62B1E]/40 transition-colors mb-4">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p className="text-white font-bold text-lg leading-tight mb-2">{speaker.name}</p>
                <p className="text-white/50 text-sm leading-relaxed">{speaker.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SCHEDULE ── Shape: Star */}
        <section id="schedule" className="min-h-screen flex flex-col justify-center px-6 md:px-20 lg:px-32 relative py-20">
          <p className="text-xs uppercase tracking-[0.3em] text-[#E62B1E] mb-4">April 17th, 2025</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-12">
            Schedule
          </h2>
          <div className="max-w-3xl flex flex-col gap-6">
            {schedule.map((item, i) => (
              <div
                key={i}
                className="group flex flex-col md:flex-row md:items-center gap-2 md:gap-10 p-4 border-l-2 border-white/10 hover:border-[#E62B1E] bg-white/[0.02] hover:bg-white/[0.04] transition-all"
              >
                <span className="text-sm text-[#E62B1E] md:w-32 shrink-0 font-medium tracking-wide">{item.time}</span>
                <span className="text-lg md:text-xl text-white/80 group-hover:text-white transition-colors">{item.event}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── VENUE + REGISTER ── Shape: Hexagon */}
        <section id="register" className="min-h-screen flex flex-col justify-center px-6 md:px-20 lg:px-32 relative">
          <div className="grid md:grid-cols-2 gap-20 bg-black/40 p-10 md:p-16 rounded-2xl border border-white/5 backdrop-blur-md">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#E62B1E] mb-4">Location</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-6">
                Venue
              </h2>
              <p className="text-white font-semibold text-xl mb-4">
                Impact College of Engineering and Applied Sciences
              </p>
              <p className="text-white/60 text-base leading-relaxed mb-6">
                Kodigehalli, 60 Feet Road, Sahakar Nagar,<br />
                Koti Hosahalli, Bengaluru, Karnataka 560092
              </p>
              <p className="text-white/40 text-sm">
                A green campus at the heart of Bengaluru — the Silicon Capital of India.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#E62B1E] mb-4">Register</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-6">
                Join Us
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-10">
                Be part of a transformative experience. Secure your seat for TEDxICEAS 2026 and be among the thinkers, creators, and changemakers shaping tomorrow.
              </p>
              <a
                href="#"
                className="inline-block border border-[#E62B1E] text-[#E62B1E] hover:bg-[#E62B1E] hover:text-white font-bold text-sm px-10 py-4 uppercase tracking-[0.2em] transition-all duration-300"
              >
                Get Tickets
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 px-6 md:px-20 py-12 bg-black/50 backdrop-blur-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <p className="text-white font-black text-xl tracking-tighter uppercase">
              TEDx<span className="text-[#E62B1E]">ICEAS</span>
            </p>
            <p className="text-white/30 text-xs mt-2">
              This independent TEDx event is operated under license from TED.
            </p>
          </div>
          <nav className="flex flex-wrap gap-6">
            {[
              { label: "Home", href: "#hero" },
              { label: "About", href: "#about" },
              { label: "Speakers", href: "#speakers" },
              { label: "Schedule", href: "#schedule" },
              { label: "Venue", href: "#register" },
              { label: "Tickets", href: "#register" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/40 hover:text-white text-xs uppercase tracking-[0.2em] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <p className="text-white/20 text-xs">© 2026 TEDxICEAS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
