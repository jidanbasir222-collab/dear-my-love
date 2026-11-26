"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Calendar, Tag, Maximize2 } from "lucide-react";

export default function MemoriesSection({ memories = [], onOpenLightbox }) {
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = [
    "Semua",
    "Kencan Pertama",
    "Liburan",
    "Momen Spesial",
    "Lucu / Random",
  ];

  const filteredMemories =
    selectedCategory === "Semua"
      ? memories
      : memories.filter((m) => m.category === selectedCategory);

  return (
    <section id="memories" className="py-24 px-4 sm:px-6 relative bg-ivory">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-softPink/60 text-burgundy text-xs uppercase tracking-widest font-semibold mb-3 border border-dustyRose/30"
          >
            <Camera className="w-3.5 h-3.5 text-mutedGold" />
            <span>OUR MEMORIES</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-burgundy mb-3"
          >
            Galeri Kenangan Manis
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-burgundy/75"
          >
            Setiap lembar foto polaroid membekukan sepotong kebahagiaan yang kita bagi bersama.
          </motion.p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-2.5 mb-14">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                  isActive
                    ? "bg-burgundy text-ivory shadow-md scale-105"
                    : "bg-white hover:bg-softPink/40 text-burgundy/80 border border-dustyRose/30"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Polaroid Scrapbook Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {filteredMemories.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group cursor-pointer"
                onClick={() => onOpenLightbox(filteredMemories, idx)}
              >
                {/* Polaroid Frame */}
                <div
                  className="polaroid-card rounded-xl border border-dustyRose/20 h-full flex flex-col justify-between"
                  style={{
                    transform: `rotate(${item.rotation || 0}deg)`,
                  }}
                >
                  {/* Photo area with zoom hover */}
                  <div className="relative aspect-[4/4.5] overflow-hidden rounded-lg bg-softPink/30 mb-4">
                    <img
                      src={item.photoUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Hover icon */}
                    <div className="absolute inset-0 bg-burgundy-deep/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-sm">
                        <Maximize2 className="w-5 h-5 text-ivory" />
                      </div>
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/90 text-burgundy text-[10px] font-semibold tracking-wider flex items-center gap-1 shadow-sm">
                      <Tag className="w-2.5 h-2.5 text-mutedGold" />
                      {item.category}
                    </div>
                  </div>

                  {/* Polaroid handwritten caption space */}
                  <div className="px-1 text-center">
                    <h3 className="font-serif text-lg font-bold text-burgundy mb-1">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="font-love text-base sm:text-lg text-dustyRose-dark leading-snug line-clamp-2">
                        "{item.caption}"
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-burgundy/50 font-mono">
                      <Calendar className="w-3 h-3 text-mutedGold" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredMemories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-burgundy/60 text-sm">Belum ada kenangan di kategori ini.</p>
          </div>
        )}
      </div>
    </section>
  );
}
