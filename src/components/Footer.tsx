import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 py-20 px-6 md:px-20 lg:px-40 bg-transparent border-t border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 text-white/20">
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-white italic">TEDx<span className="text-ted-red">ICEAS</span></h3>
          <p className="text-[0.65rem] max-w-[200px] uppercase leading-relaxed tracking-widest">
            This independent TEDx event is operated under license from TED.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-20 gap-y-8">
          <div className="space-y-4">
             <p className="text-[0.6rem] uppercase tracking-widest font-bold text-white/40">Connect</p>
             <div className="flex flex-col gap-2">
               {['Instagram', 'LinkedIn', 'Twitter'].map(s => (
                 <a key={s} href="#" className="text-[0.65rem] uppercase tracking-widest font-bold hover:text-white transition-colors">{s}</a>
               ))}
             </div>
          </div>
          <div className="space-y-4">
             <p className="text-[0.6rem] uppercase tracking-widest font-bold text-white/40">Quick Links</p>
             <div className="flex flex-col gap-2">
               <Link href="/about" className="text-[0.65rem] uppercase tracking-widest font-bold hover:text-white transition-colors">About</Link>
               <Link href="/speakers" className="text-[0.65rem] uppercase tracking-widest font-bold hover:text-white transition-colors">Speakers</Link>
               <Link href="/sponsors" className="text-[0.65rem] uppercase tracking-widest font-bold hover:text-white transition-colors">Sponsors</Link>
               <Link href="/team" className="text-[0.65rem] uppercase tracking-widest font-bold hover:text-white transition-colors">Team</Link>
             </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[0.6rem] uppercase tracking-[0.4em] mb-2">&copy; 2026 All Rights Reserved</p>
          <a href="https://www.ted.com" target="_blank" rel="noopener noreferrer" className="text-[0.5rem] uppercase tracking-widest hover:text-white transition-colors">Visit TED.com</a>
        </div>
      </div>
    </footer>
  );
}
