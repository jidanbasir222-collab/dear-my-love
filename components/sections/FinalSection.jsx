"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, ArrowUp, Lock } from "lucide-react";
import Link from "next/link";

export default function FinalSection({ settings }) {
  const coupleName1 = settings?.coupleName1 || "ahmad zaidan";
  const coupleName2 = settings?.coupleName2 || "zaskia nisa syabani";
  const finalMessage =
    settings?.finalMessage ||
    "Terima kasih telah menjadi bagian terindah dalam setiap hariku. Bersamamu, hal-hal sederhana terasa begitu luar biasa. Selamat hari jadi, cintaku. Aku mencintaimu selamanya.";
  const finalPhoto =
    settings?.finalPhoto ||
    "/uploads/1795665089116-qiv8pc.jpeg";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="final" className="pt-24 pb-12 px-4 sm:px-6 relative bg-ivory-light overflow-hidden">
      {/* Background Stardust Ambient */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-softPink/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Animated Heart Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="relative mb-6"
        >
          <div className="w-16 h-16 rounded-full bg-softPink flex items-center justify-center text-burgundy shadow-glow">
            <Heart className="w-8 h-8 text-dustyRose fill-dustyRose animate-pulse" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-mutedGold animate-spin" />
        </motion.div>

        {/* Primary Closing Quote */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-burgundy leading-tight max-w-2xl mx-auto mb-4"
        >
          "Thank you for being my favorite part of every day."
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="font-love text-2xl sm:text-3xl text-dustyRose-dark font-medium mb-10"
        >
          Terima kasih telah menjadi bagian terindah dalam setiap hariku.
        </motion.p>

        {/* Closing Couple Photo Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="relative max-w-md w-full polaroid-card rounded-2xl mb-10 border border-dustyRose/20"
        >
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-softPink/20 mb-4">
            <img
              src={finalPhoto}
              alt={`${coupleName1} & ${coupleName2}`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="px-2 text-center">
            <p className="font-love text-2xl sm:text-3xl text-burgundy font-bold">
              {coupleName1} &amp; {coupleName2}
            </p>
            <p className="text-xs text-burgundy/60 tracking-wider uppercase font-semibold mt-0.5">
              Untuk Selamanya &amp; Satu Hari Lagi
            </p>
          </div>
        </motion.div>

        {/* Closing Romantic Narrative */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="max-w-xl mx-auto bg-white/70 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-dustyRose/30 shadow-sm mb-12"
        >
          <p className="text-sm sm:text-base text-burgundy/90 leading-relaxed italic">
            "{finalMessage}"
          </p>
        </motion.div>

        {/* Scroll Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-softPink/50 hover:bg-softPink text-burgundy text-xs font-semibold tracking-wider transition-all border border-dustyRose/30 hover:scale-105 active:scale-95 mb-16 shadow-sm"
        >
          <ArrowUp className="w-4 h-4 text-mutedGold" />
          <span>Kembali ke Awal Semesta</span>
        </button>

        {/* Footer Bottom Bar */}
        <div className="w-full border-t border-dustyRose/20 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-burgundy/60 gap-4">
          <p className="flex items-center gap-1.5">
            <span>Dibuat dengan segenap cinta untuk</span>
            <span className="font-serif font-bold text-burgundy">
              {coupleName1} &amp; {coupleName2}
            </span>
            <Heart className="w-3.5 h-3.5 text-dustyRose fill-dustyRose" />
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-1 text-burgundy/70 hover:text-burgundy font-medium transition-colors"
            >
              <Lock className="w-3 h-3 text-mutedGold" />
              <span>Ruang Pengaturan Pribadi</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
