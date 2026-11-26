"use client";

import { motion } from "framer-motion";
import { Compass, MapPin, Calendar, Sparkles, Heart } from "lucide-react";

export default function JourneySection({ milestones = [], onImageClick }) {
  return (
    <section id="journey" className="py-24 px-4 sm:px-6 relative bg-ivory-light">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-softPink/60 text-burgundy text-xs uppercase tracking-widest font-semibold mb-3 border border-dustyRose/30"
          >
            <Compass className="w-3.5 h-3.5 text-mutedGold" />
            <span>OUR JOURNEY</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-burgundy mb-3"
          >
            Langkah Demi Langkah Perjalanan Kita
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-burgundy/75"
          >
            Setiap tanggal menyimpan cerita, tawa, dan janji suci yang kita ukir di dalam hati.
          </motion.p>
        </div>

        {/* Timeline Path */}
        <div className="relative">
          {/* Vertical Center Line */}
          <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-dustyRose via-mutedGold to-dustyRose -translate-x-1/2"></div>

          {/* Milestone List */}
          <div className="space-y-12">
            {milestones.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline Heart Node */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-5 z-10 w-9 h-9 rounded-full bg-white border-2 border-mutedGold shadow-md flex items-center justify-center text-burgundy">
                    <Heart className="w-4 h-4 text-dustyRose fill-dustyRose" />
                  </div>

                  {/* Card Container */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className={`ml-12 md:ml-0 md:w-[45%] ${
                      isEven ? "md:pl-8 text-left" : "md:pr-8 md:text-right"
                    }`}
                  >
                    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-polaroid border border-dustyRose/20 hover:border-dustyRose/60 transition-all duration-300 group">
                      {/* Date Badge */}
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-softPink/50 text-burgundy text-xs font-semibold mb-3 ${
                          isEven ? "" : "md:ml-auto"
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5 text-mutedGold" />
                        <span>{item.date}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-burgundy mb-2">
                        {item.title}
                      </h3>

                      {/* Location if exists */}
                      {item.location && (
                        <div
                          className={`flex items-center gap-1 text-xs text-mutedGold-dark font-medium mb-3 ${
                            isEven ? "" : "md:justify-end"
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5 text-mutedGold shrink-0" />
                          <span>{item.location}</span>
                        </div>
                      )}

                      {/* Photo if exists */}
                      {item.photoUrl && (
                        <div
                          onClick={() => onImageClick && onImageClick(item.photoUrl, item.title, item.description)}
                          className="relative aspect-video rounded-xl overflow-hidden mb-4 cursor-pointer group-hover:shadow-md transition-all bg-softPink/30"
                        >
                          <img
                            src={item.photoUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-burgundy/80 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
