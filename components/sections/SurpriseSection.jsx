"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Heart, Sparkles, PartyPopper, RotateCcw, Award } from "lucide-react";
import confetti from "canvas-confetti";

export default function SurpriseSection({ surprise }) {
  const [isOpened, setIsOpened] = useState(false);

  const boxTitle = surprise?.boxTitle || "Ada Satu Kejutan Kecil Untukmu...";
  const boxSubtitle = surprise?.boxSubtitle || "Sentuh kotak kado ini untuk membukanya";
  const message =
    surprise?.message ||
    "Selamat Hari Jadi, Sayangku! Dari miliaran jiwa dan bintang di alam semesta ini, takdir mempertemukanku denganmu. Kamu adalah anugerah terindah yang Tuhan titipkan padaku. Aku sangat mencintaimu, hari ini dan selamanya! ✨💖";
  const photoUrl =
    surprise?.photoUrl ||
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80";
  const badge = surprise?.badge || "Kado Cinta Abadi";
  const couponText =
    surprise?.couponText ||
    "🎫 Kupon Spesial: Berlaku selamanya untuk pelukan tanpa batas, es krim gratis saat kamu sedih, dan kencan impian kemanapun kamu inginkan!";

  const handleOpenGift = () => {
    setIsOpened(true);

    // Burst romantic confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D9A6AC", "#743B4A", "#C7A36B", "#F3D5D8", "#FFD700"],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#D9A6AC", "#C7A36B"],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#743B4A", "#F3D5D8"],
        });
      }, 250);
    } catch (e) {
      console.warn("Confetti error:", e);
    }
  };

  return (
    <section id="surprise" className="py-24 px-4 sm:px-6 relative bg-ivory-light overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-softPink/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto text-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-softPink/60 text-burgundy text-xs uppercase tracking-widest font-semibold mb-3 border border-dustyRose/30"
        >
          <Gift className="w-3.5 h-3.5 text-mutedGold" />
          <span>LITTLE SURPRISE</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-burgundy mb-3"
        >
          {boxTitle}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-burgundy/75 max-w-xl mx-auto mb-12"
        >
          {boxSubtitle}
        </motion.p>

        {/* Gift Box / Revealed Content */}
        <div className="relative max-w-lg mx-auto">
          {!isOpened ? (
            /* Closed 3D Gift Box */
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="cursor-pointer group select-none flex flex-col items-center"
              onClick={handleOpenGift}
            >
              <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center">
                {/* Glow ring */}
                <div className="absolute -inset-4 bg-mutedGold/20 rounded-full blur-xl group-hover:bg-mutedGold/30 transition duration-500 animate-pulse-subtle"></div>

                {/* Gift Box Body */}
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 bg-gradient-to-br from-burgundy to-burgundy-dark rounded-3xl shadow-2xl border-2 border-mutedGold/60 flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  {/* Satin Ribbon Horizontal */}
                  <div className="absolute inset-y-0 w-8 bg-gradient-to-r from-mutedGold-light via-mutedGold to-mutedGold-dark shadow-sm"></div>

                  {/* Satin Ribbon Vertical */}
                  <div className="absolute inset-x-0 h-8 bg-gradient-to-b from-mutedGold-light via-mutedGold to-mutedGold-dark shadow-sm"></div>

                  {/* Ribbon Bow on Top */}
                  <div className="relative z-10 w-16 h-16 rounded-full bg-mutedGold border-2 border-white shadow-glow flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                    <Heart className="w-8 h-8 fill-burgundy text-burgundy" />
                  </div>
                </div>
              </div>

              <span className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-burgundy text-ivory text-xs font-semibold tracking-wider shadow-md group-hover:bg-burgundy-dark transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-mutedGold" />
                Ketuk Untuk Membuka Kado
              </span>
            </motion.div>
          ) : (
            /* Opened Surprise Card */
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: "spring", damping: 20, stiffness: 250 }}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-mutedGold/50 text-left relative overflow-hidden"
              >
                {/* Celebration Header */}
                <div className="flex items-center justify-between pb-4 border-b border-dustyRose/20 mb-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-softPink text-burgundy text-xs font-bold">
                    <Award className="w-3.5 h-3.5 text-mutedGold" />
                    <span>{badge}</span>
                  </div>
                  <div className="flex items-center gap-1 text-mutedGold">
                    <PartyPopper className="w-4 h-4 animate-bounce" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Kejutan Terbuka!
                    </span>
                  </div>
                </div>

                {/* Surprise Photo */}
                {photoUrl && (
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 shadow-md bg-softPink/20">
                    <img
                      src={photoUrl}
                      alt="Kejutan Romantis"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/30 to-transparent"></div>
                  </div>
                )}

                {/* Hidden Message */}
                <div className="mb-6">
                  <p className="font-love text-2xl sm:text-3xl text-burgundy leading-snug mb-3">
                    "{message}"
                  </p>
                </div>

                {/* Lifetime Love Coupon */}
                {couponText && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-softPink-light via-softPink to-softPink-light border border-dashed border-burgundy/40 text-burgundy shadow-inner mb-6">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-mutedGold shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                        {couponText}
                      </p>
                    </div>
                  </div>
                )}

                {/* Reset / Close Button */}
                <div className="text-center pt-2">
                  <button
                    onClick={() => setIsOpened(false)}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-softPink hover:bg-softPink-dark text-burgundy text-xs font-semibold tracking-wider transition-colors border border-dustyRose/30"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-mutedGold" />
                    <span>Tutup Kembali Kotak Kado</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
