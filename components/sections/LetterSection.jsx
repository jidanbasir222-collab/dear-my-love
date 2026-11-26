"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Heart, Sparkles, Feather, RotateCcw } from "lucide-react";

export default function LetterSection({ letter }) {
  const [isOpen, setIsOpen] = useState(false);

  const recipient = letter?.recipient || "Untuk zaskia nisa syabani, Bidadari Semestaku";
  const title = letter?.title || "Sebuah Surat Dari Lubuk Hatiku";
  const content =
    letter?.content ||
    `Sayangku,\n\nJika semesta ini begitu luas dan tanpa batas, maka rasa cintaku padamu jauh melampaui segala galaksi yang ada.\n\nTerima kasih telah hadir dalam hidupku, membawa pelangi pada hari-hari yang dulu terasa kelabu. Terima kasih atas setiap senyuman manismu yang selalu menjadi penenang di saat duniaku bising dan lelah, serta pelukan hangatmu yang selalu membuatku merasa memiliki rumah sejati.\n\nBersamamu, aku belajar bahwa mencintai bukanlah tentang menemukan kesempurnaan, melainkan tentang saling menggenggam erat dan bertumbuh bersama melintasi suka dan duka.\n\nSelamat hari jadi, cintaku. Aku mencintaimu hari ini, esok, dan selamanya.`;
  const signature = letter?.signature || "Dengan segenap cintaku, ahmad zaidan ❤️";
  const date = letter?.date || "22 November";

  return (
    <section id="letter" className="py-24 px-4 sm:px-6 relative bg-ivory-light">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-softPink/60 text-burgundy text-xs uppercase tracking-widest font-semibold mb-3 border border-dustyRose/30"
        >
          <Mail className="w-3.5 h-3.5 text-mutedGold" />
          <span>A LETTER FOR YOU</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-burgundy mb-3"
        >
          Sepucuk Surat Cinta Untukmu
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-burgundy/75 max-w-xl mx-auto mb-12"
        >
          Kata-kata yang kutulis tulus dari kedalaman hatiku, khusus untukmu di hari istimewa ini.
        </motion.p>

        {/* Interactive Envelope & Letter Container */}
        <div className="relative max-w-2xl mx-auto">
          {!isOpen ? (
            /* Closed Envelope View */
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="cursor-pointer group select-none"
              onClick={() => setIsOpen(true)}
            >
              <div className="relative bg-gradient-to-br from-softPink via-ivory to-softPink rounded-3xl p-8 sm:p-12 shadow-romantic border-2 border-dustyRose/40 hover:border-dustyRose transition-all duration-300 hover:scale-[1.02]">
                {/* Envelope Flap Triangles Visual */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[110px] sm:border-l-[160px] border-l-transparent border-r-[110px] sm:border-r-[160px] border-r-transparent border-t-[80px] sm:border-t-[110px] border-t-dustyRose/30 -z-0"></div>

                {/* Wax Seal with Gold Stamp */}
                <div className="relative z-10 flex flex-col items-center justify-center my-6 sm:my-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-burgundy shadow-glow border-2 border-mutedGold flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-mutedGold fill-mutedGold animate-pulse-subtle" />
                  </div>
                  <span className="mt-4 font-serif text-lg sm:text-xl font-bold text-burgundy">
                    {recipient}
                  </span>
                  <span className="text-xs text-dustyRose-dark uppercase tracking-widest font-semibold mt-1">
                    Sentuh segel lilin untuk membuka surat
                  </span>
                </div>

                {/* Corner Floral / Stardust Accents */}
                <Sparkles className="absolute bottom-4 left-4 w-5 h-5 text-mutedGold/60" />
                <Sparkles className="absolute top-4 right-4 w-5 h-5 text-mutedGold/60" />
              </div>
            </motion.div>
          ) : (
            /* Open Letter View with Parchment Paper */
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative parchment-texture rounded-3xl p-8 sm:p-14 shadow-letter border-2 border-dustyRose/30 text-left"
              >
                {/* Wax Seal Badge at the top */}
                <div className="flex items-center justify-between border-b border-dustyRose/20 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Feather className="w-5 h-5 text-mutedGold" />
                    <span className="font-serif text-xs uppercase tracking-widest text-mutedGold font-semibold">
                      SURAT DARI HATI
                    </span>
                  </div>
                  <span className="text-xs font-mono text-burgundy/60">{date}</span>
                </div>

                {/* Recipient */}
                <h3 className="font-love text-3xl sm:text-4xl text-burgundy font-bold mb-4">
                  {recipient},
                </h3>

                {/* Letter Content with elegant spacing and paragraph rendering */}
                <div className="space-y-4 font-sans text-sm sm:text-base text-burgundy/90 leading-relaxed tracking-wide">
                  {content.split("\n\n").map((para, i) => (
                    <p key={i} className="leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Signature */}
                <div className="mt-8 pt-6 border-t border-dustyRose/20 text-right">
                  <p className="font-love text-2xl sm:text-3xl text-burgundy font-bold">
                    {signature}
                  </p>
                </div>

                {/* Close Button to fold envelope back */}
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-softPink hover:bg-softPink-dark text-burgundy text-xs font-semibold tracking-wider transition-colors border border-dustyRose/30"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-mutedGold" />
                    <span>Lipat Kembali Surat</span>
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
