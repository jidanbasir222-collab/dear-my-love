"use client";

import { motion } from "framer-motion";
import { Sparkles, Heart, ArrowDown } from "lucide-react";
import { useMusic } from "../MusicContext";

export default function HeroSection({ settings }) {
  const { startMusicOnUserAction } = useMusic();

  const coupleName1 = settings?.coupleName1 || "ahmad zaidan";
  const coupleName2 = settings?.coupleName2 || "zaskia nisa syabani";
  const websiteTitle = settings?.websiteTitle || "OUR LITTLE UNIVERSE";
  const tagline = settings?.tagline || "Every love story has a universe. This one is ours.";
  const heroPhoto = settings?.heroPhoto || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80";

  // Format anniversary display date
  const annivDateStr = settings?.anniversaryDate
    ? new Date(settings.anniversaryDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "22 November 2023";

  const handleOpenStory = () => {
    startMusicOnUserAction();
    const counterSection = document.getElementById("counter");
    if (counterSection) {
      counterSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4 sm:px-6 overflow-hidden starfield-glow"
    >
      {/* Decorative Golden Ambient Circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[550px] sm:h-[550px] bg-softPink/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-mutedGold/15 rounded-full blur-2xl pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Subtle Pill Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-softPink/60 border border-dustyRose/40 text-burgundy text-xs uppercase tracking-widest font-semibold mb-6 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-mutedGold" />
          <span>Kisah Cinta Kita Sejak {annivDateStr}</span>
          <Heart className="w-3.5 h-3.5 text-dustyRose fill-dustyRose" />
        </motion.div>

        {/* Website Title & Couple Name */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-burgundy leading-tight mb-3"
        >
          {websiteTitle}
        </motion.h1>

        {/* Subtitle / Romantic Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="font-love text-2xl sm:text-3xl md:text-4xl text-dustyRose-dark max-w-2xl mx-auto mb-8 font-medium"
        >
          "{tagline}"
        </motion.p>

        {/* Hero Couple Photo Presentation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative my-4 group"
        >
          {/* Golden Arch Glow Ring */}
          <div className="absolute -inset-3 bg-gradient-to-r from-softPink via-mutedGold/40 to-dustyRose rounded-[32px] blur-lg opacity-60 group-hover:opacity-80 transition duration-700"></div>

          {/* Polaroid Frame Card */}
          <div className="relative polaroid-card rounded-2xl max-w-xs sm:max-w-md w-full border border-dustyRose/20">
            <div className="relative aspect-[4/5] sm:aspect-[4/4.5] overflow-hidden rounded-xl bg-softPink/30">
              <img
                src={heroPhoto}
                alt={`${coupleName1} & ${coupleName2}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/40 via-transparent to-transparent"></div>
            </div>

            {/* Couple names signature on bottom of polaroid */}
            <div className="mt-4 flex items-center justify-between px-2">
              <div className="text-left">
                <span className="font-love text-2xl sm:text-3xl text-burgundy font-bold block">
                  {coupleName1} &amp; {coupleName2}
                </span>
                <span className="text-[11px] text-burgundy/60 tracking-wider uppercase font-semibold">
                  Dua Jiwa, Satu Semesta
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-softPink/50 flex items-center justify-center text-dustyRose">
                <Heart className="w-5 h-5 fill-dustyRose" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Button: "Buka Kisah Kita" (Open Our Story) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <button
            onClick={handleOpenStory}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-burgundy text-ivory font-serif tracking-wider text-base sm:text-lg font-semibold shadow-romantic hover:bg-burgundy-dark transition-all duration-300 hover:scale-105 active:scale-95 border border-mutedGold/40"
          >
            <Sparkles className="w-4 h-4 text-mutedGold group-hover:rotate-12 transition-transform" />
            <span>Buka Kisah Kita</span>
            <Heart className="w-4 h-4 text-softPink fill-softPink group-hover:scale-125 transition-transform" />
          </button>
          <p className="text-[11px] text-burgundy/60 tracking-wider">
            Klik untuk memulai petualangan cinta &amp; memutar melodi romantis
          </p>

          <button
            onClick={handleOpenStory}
            className="mt-2 text-burgundy/60 hover:text-burgundy animate-bounce transition-colors"
            aria-label="Gulir ke bawah"
          >
            <ArrowDown className="w-5 h-5 text-mutedGold" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
