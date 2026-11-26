"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useMusic } from "./MusicContext";
import { Sparkles, Menu, X, Lock, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isPlaying, togglePlay } = useMusic();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "#hero" },
    { name: "Hitungan Cinta", href: "#counter" },
    { name: "Perjalanan", href: "#journey" },
    { name: "Kenangan", href: "#memories" },
    { name: "Surat", href: "#letter" },
    { name: "Lagu Kita", href: "#soundtrack" },
    { name: "Kejutan", href: "#surprise" },
    { name: "Impian", href: "#future" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "romantic-glass py-3 shadow-sm border-b border-dustyRose/20"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="#hero" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-softPink flex items-center justify-center text-burgundy shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-mutedGold" />
          </div>
          <div>
            <span className="font-serif font-bold text-sm sm:text-base tracking-widest text-burgundy block">
              OUR LITTLE UNIVERSE
            </span>
            <span className="text-[10px] uppercase tracking-wider text-mutedGold font-semibold -mt-1 block">
              ahmad zaidan &amp; zaskia nisa syabani
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs uppercase tracking-wider font-medium text-burgundy/80 hover:text-burgundy hover:scale-105 transition-all duration-200"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Equalizer / Toggle button */}
          <button
            onClick={togglePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-softPink/60 hover:bg-softPink text-burgundy text-xs font-medium border border-dustyRose/30 transition-all duration-200"
            title={isPlaying ? "Jeda Musik" : "Putar Musik Latar"}
          >
            {isPlaying ? (
              <>
                <span className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-burgundy h-2 animate-[pulse_0.6s_ease-in-out_infinite]"></span>
                  <span className="w-0.5 bg-burgundy h-3 animate-[pulse_0.8s_ease-in-out_infinite]"></span>
                  <span className="w-0.5 bg-burgundy h-1.5 animate-[pulse_0.5s_ease-in-out_infinite]"></span>
                </span>
                <span className="hidden sm:inline text-[11px]">Musik Aktif</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-burgundy/60" />
                <span className="hidden sm:inline text-[11px] text-burgundy/70">Musik Senyap</span>
              </>
            )}
          </button>

          {/* Admin Dashboard Link */}
          <Link
            href="/admin"
            className="p-2 sm:px-3.5 sm:py-1.5 rounded-full bg-burgundy text-ivory hover:bg-burgundy-dark text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all duration-200 hover:shadow"
            title="Masuk ke Pengaturan Admin"
          >
            <Lock className="w-3.5 h-3.5 text-mutedGold" />
            <span className="hidden sm:inline text-[11px] tracking-wide">Admin</span>
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-burgundy hover:bg-softPink/40 rounded-full transition-colors"
            aria-label="Buka Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-ivory/95 backdrop-blur-md border-b border-dustyRose/30 px-6 py-5 shadow-lg overflow-hidden"
          >
            <div className="flex flex-col gap-3.5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-burgundy/90 hover:text-burgundy hover:translate-x-1 transition-all py-1 border-b border-softPink/40"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 py-2 px-4 rounded-xl bg-burgundy text-ivory text-center text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-mutedGold" />
                Masuk Ruang Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
