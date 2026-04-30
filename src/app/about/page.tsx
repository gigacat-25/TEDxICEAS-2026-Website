import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-transparent text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            About <span className="text-[#E62B1E]">TEDx</span>ICEAS
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Threads of Change: Connecting ideas, community, and the future.
          </p>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/d0NHOpeczUU"
              title="What is TEDx?"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="mt-20 space-y-20">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold uppercase italic tracking-tighter">About TEDx, x = independently organized event</h2>
                <p className="text-gray-400 leading-relaxed text-lg">
                  In the spirit of discovering and spreading ideas, TEDx is a program of local, self-organized events that bring people together to share a TED-like experience. At a TEDx event, TED Talks video and live speakers combine to spark deep discussion and connection. These local, self-organized events are branded TEDx, where x = independently organized TED event. The TED Conference provides general guidance for the TEDx program, but individual TEDx events are self-organized. (Subject to certain rules and regulations.)
                </p>
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold uppercase italic tracking-tighter">About TED</h2>
                <p className="text-gray-400 leading-relaxed text-lg">
                  TED began in 1984 as a conference where Technology, Entertainment and Design converged, but today it spans a multitude of worldwide communities and initiatives exploring everything from science and business to education, arts and global issues. In addition to the TED Talks curated from our annual conferences and published on TED.com, we produce original podcasts, short video series, animated educational lessons (TED-Ed) and TV programs that are translated into more than 100 languages and distributed via partnerships around the world. Each year, thousands of independently run TEDx events. Through the Audacious Project, TED has helped catalyze $6.6 billion in funding for projects that support bold solutions to the world's most urgent challenges — working to make the world more beautiful, sustainable and just. In 2020, TED launched Countdown, an initiative to accelerate solutions to the climate crisis and mobilize a movement for a net-zero future, and in 2023 TED launched TED Democracy to spark a new kind of conversation focused on realistic pathways towards a more vibrant and equitable future. <a href="https://www.ted.com/about/programs-initiatives" target="_blank" rel="noopener noreferrer" className="text-ted-red hover:underline">View a full list of TED’s many programs and initiatives</a>.
                </p>
              </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8 bg-white/5 p-12 rounded-3xl border border-white/10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-widest font-bold text-gray-500">Follow TED on:</span>
                  <div className="flex gap-4">
                    <a href="https://www.facebook.com/TED" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest font-bold hover:text-ted-red transition-colors">Facebook</a>
                    <a href="https://www.instagram.com/ted" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest font-bold hover:text-ted-red transition-colors">Instagram</a>
                    <a href="https://www.linkedin.com/company/ted-conferences" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest font-bold hover:text-ted-red transition-colors">LinkedIn</a>
                    <a href="https://www.tiktok.com/@tedtoks" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest font-bold hover:text-ted-red transition-colors">TikTok</a>
                    <a href="https://twitter.com/TEDTalks" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest font-bold hover:text-ted-red transition-colors">X</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Threads of Change</h2>
          <p className="text-xl text-gray-300 leading-relaxed mb-12">
            The 2026 theme explores the intricate connections that weave our society together. Like threads in a tapestry, individual ideas and actions combine to create a larger picture of progress and transformation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[#E62B1E] text-4xl mb-4 font-bold">01</div>
              <h3 className="text-xl font-bold mb-2">Connect</h3>
              <p className="text-gray-400 text-sm">Building bridges between diverse disciplines and communities.</p>
            </div>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[#E62B1E] text-4xl mb-4 font-bold">02</div>
              <h3 className="text-xl font-bold mb-2">Catalyze</h3>
              <p className="text-gray-400 text-sm">Sparking conversations that lead to meaningful action.</p>
            </div>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[#E62B1E] text-4xl mb-4 font-bold">03</div>
              <h3 className="text-xl font-bold mb-2">Change</h3>
              <p className="text-gray-400 text-sm">Transforming our perspective and the world around us.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
