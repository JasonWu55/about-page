"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/60" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-zinc-100 font-bold text-lg tracking-tight">
          Jason<span className="text-indigo-400">.</span>
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="mailto:woowujasonwu@gmail.com"
              className="text-sm px-4 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
            >
              Contact
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-zinc-300 transition-all ${open ? "rotate-45 translate-y-[10px]" : ""}`} />
          <span className={`block w-5 h-px bg-zinc-300 transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-zinc-300 transition-all ${open ? "-rotate-45 -translate-y-[10px]" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800"
          >
            <ul className="flex flex-col px-6 py-4 gap-4">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-zinc-300 hover:text-zinc-100 transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="mailto:woowujasonwu@gmail.com" className="text-indigo-400">
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
