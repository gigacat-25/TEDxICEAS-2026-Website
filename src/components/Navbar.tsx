"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const links = [
        { label: "Home", href: "/" },
        { label: "Speakers", href: "/speakers" },
        { label: "Sponsors", href: "/sponsors" },
        { label: "Team", href: "/team" },
        { label: "About", href: "/about" },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled
                ? "py-4 bg-charcoal/80 backdrop-blur-xl border-white/5"
                : "py-8 bg-transparent border-transparent"
                } px-6 md:px-16 flex items-center justify-between`}
        >
            {/* Brand */}
            <Link
                href="/"
                className="block h-10 md:h-12 hover:opacity-80 transition-opacity"
            >
                <img
                    src="/logo-white.png"
                    alt="TEDxICEAS Logo"
                    className="h-full w-auto object-contain"
                />
            </Link>

            {/* Desktop */}
            <nav className="hidden md:flex items-center gap-12">
                {links.map((l) => (
                    <Link
                        key={l.label}
                        href={l.href}
                        className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white/40 hover:text-white transition-colors"
                    >
                        {l.label}
                    </Link>
                ))}
                <Link
                    href="/#register"
                    className="text-[0.65rem] font-bold uppercase tracking-[0.2em] px-8 py-3 bg-ted-red hover:bg-white hover:text-ted-red text-white transition-all duration-300"
                >
                    Tickets
                </Link>
            </nav>

            {/* Mobile Trigger */}
            <button
                className="md:hidden flex flex-col gap-1.5 p-2"
                onClick={() => setOpen(!open)}
            >
                <div className={`w-6 h-[1.5px] bg-white transition-all ${open ? "rotate-45 translate-y-[3.5px]" : ""}`} />
                <div className={`w-6 h-[1.5px] bg-white transition-all ${open ? "opacity-0" : ""}`} />
                <div className={`w-6 h-[1.5px] bg-white transition-all ${open ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
            </button>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 bg-charcoal/98 backdrop-blur-2xl transition-all duration-500 flex flex-col p-12 gap-8 md:hidden ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
                    }`}
            >
                <div className="flex justify-between items-center mb-8">
                    <span className="font-black text-xl tracking-tighter">TEDx<span className="text-ted-red">ICEAS</span></span>
                    <button onClick={() => setOpen(false)} className="text-white/40 uppercase text-[0.6rem] tracking-widest">Close</button>
                </div>
                {links.map((l) => (
                    <Link
                        key={l.label}
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="text-2xl font-black uppercase tracking-tighter text-white hover:text-ted-red"
                    >
                        {l.label}
                    </Link>
                ))}
                <Link
                    href="/#register"
                    onClick={() => setOpen(false)}
                    className="mt-4 text-center bg-ted-red text-white py-5 font-bold uppercase tracking-widest text-xs"
                >
                    Get Tickets
                </Link>
            </div>
        </header>
    );
}

