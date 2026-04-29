"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const links = [
        { label: "About", href: "#about" },
        { label: "Speakers", href: "#speakers" },
        { label: "Schedule", href: "#schedule" },
        { label: "Venue", href: "#register" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 mix-blend-normal">
            {/* Glassmorphism bar */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm border-b border-white/5 pointer-events-none" />

            {/* Logo */}
            <a href="#hero" className="relative z-10 font-black text-lg tracking-tighter text-white">
                TEDx<span className="text-[#E62B1E]">ICEAS</span>
            </a>

            {/* Desktop nav */}
            <nav className="relative z-10 hidden md:flex items-center gap-8">
                {links.map((l) => (
                    <a
                        key={l.label}
                        href={l.href}
                        className="text-white/50 hover:text-white text-xs uppercase tracking-[0.2em] transition-colors duration-200"
                    >
                        {l.label}
                    </a>
                ))}
                <a
                    href="#register"
                    className="text-xs font-bold uppercase tracking-[0.2em] px-6 py-2.5 bg-[#E62B1E] hover:bg-white hover:text-[#E62B1E] text-white transition-all duration-200"
                >
                    Tickets
                </a>
            </nav>

            {/* Mobile hamburger */}
            <button
                className="relative z-10 md:hidden flex flex-col gap-1.5 p-2"
                onClick={() => setOpen(!open)}
                aria-label="Menu"
            >
                <span className={`block w-6 h-px bg-white transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block w-6 h-px bg-white transition-all duration-300 ${open ? "opacity-0" : ""}`} />
                <span className={`block w-6 h-px bg-white transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>

            {/* Mobile menu */}
            {open && (
                <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/5 flex flex-col px-6 py-8 gap-6 md:hidden">
                    {links.map((l) => (
                        <a
                            key={l.label}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="text-white/60 hover:text-white text-sm uppercase tracking-[0.2em] transition-colors"
                        >
                            {l.label}
                        </a>
                    ))}
                    <a
                        href="#register"
                        className="text-sm font-bold uppercase tracking-[0.2em] px-6 py-3 bg-[#E62B1E] text-white text-center"
                    >
                        Tickets
                    </a>
                </div>
            )}
        </header>
    );
}
