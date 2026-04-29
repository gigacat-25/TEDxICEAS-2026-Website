import Navbar from "@/components/Navbar";

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
          <div className="mt-12 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">What is TED?</h2>
              <p className="text-gray-400 leading-relaxed">
                TED is a nonprofit organization devoted to Ideas Worth Spreading, usually in the form of short, powerful talks delivered by today's leading thinkers and doers. Many of these talks are given at TED's annual conference in Vancouver, British Columbia, and made available, free, at TED.com.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">What is TEDx?</h2>
              <p className="text-gray-400 leading-relaxed">
                In the spirit of ideas worth spreading, TEDx is a program of local, self-organized events that bring people together to share a TED-like experience. At a TEDx event, TED Talks video and live speakers combine to spark deep discussion and connection.
              </p>
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

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/10 text-center text-gray-500">
        <p>© 2026 TEDxICEAS. This independent TEDx event is operated under license from TED.</p>
      </footer>
    </main>
  );
}
