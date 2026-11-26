"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, CheckCircle2, Circle, Sparkles, Heart, Plane, Utensils, Smile, Home } from "lucide-react";

export default function FutureSection({ initialBucketItems = [] }) {
  const [items, setItems] = useState(initialBucketItems);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [isUpdating, setIsUpdating] = useState(false);

  const categories = ["Semua", "Travel", "Kencan", "Pengalaman", "Mimpi Bersama"];

  const completedCount = items.filter((i) => i.completed).length;
  const totalCount = items.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredItems =
    activeCategory === "Semua"
      ? items
      : items.filter((i) => i.category === activeCategory);

  // Toggle completed status interactively
  const handleToggle = async (item) => {
    const newStatus = !item.completed;
    const nowStr = newStatus
      ? new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;

    // Optimistic UI update
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, completed: newStatus, completedDate: nowStr } : i
      )
    );

    try {
      await fetch(`/api/bucket/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: newStatus,
          completedDate: nowStr,
        }),
      });
    } catch (err) {
      console.error("Failed to update bucket status:", err);
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "Travel":
        return <Plane className="w-3.5 h-3.5 text-mutedGold" />;
      case "Kencan":
        return <Utensils className="w-3.5 h-3.5 text-mutedGold" />;
      case "Pengalaman":
        return <Smile className="w-3.5 h-3.5 text-mutedGold" />;
      case "Mimpi Bersama":
        return <Home className="w-3.5 h-3.5 text-mutedGold" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-mutedGold" />;
    }
  };

  return (
    <section id="future" className="py-24 px-4 sm:px-6 relative bg-ivory">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-softPink/60 text-burgundy text-xs uppercase tracking-widest font-semibold mb-3 border border-dustyRose/30"
          >
            <Compass className="w-3.5 h-3.5 text-mutedGold" />
            <span>OUR FUTURE</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-burgundy mb-3"
          >
            Daftar Impian &amp; Masa Depan Kita
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-burgundy/75"
          >
            Mimpi-mimpi kecil dan besar yang ingin kita wujudkan berdampingan, selangkah demi selangkah.
          </motion.p>
        </div>

        {/* Progress Bar Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-6 shadow-polaroid border border-dustyRose/30 mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-dustyRose fill-dustyRose" />
              <span className="font-serif font-bold text-base sm:text-lg text-burgundy">
                Kemajuan Impian Bersama
              </span>
            </div>
            <span className="font-mono text-sm sm:text-base font-bold text-mutedGold-dark">
              {completedCount} dari {totalCount} ({percentage}%)
            </span>
          </div>

          {/* Progress bar track */}
          <div className="w-full h-3 bg-softPink/50 rounded-full overflow-hidden p-0.5 border border-dustyRose/20">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${percentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-dustyRose to-mutedGold rounded-full"
            ></motion.div>
          </div>
        </motion.div>

        {/* Category Selector */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-burgundy text-ivory shadow-sm"
                    : "bg-white hover:bg-softPink/40 text-burgundy/80 border border-dustyRose/20"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Bucket List Cards */}
        <div className="space-y-3.5">
          <AnimatePresence>
            {filteredItems.map((item, idx) => {
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => handleToggle(item)}
                  className={`bg-white rounded-2xl p-4 sm:p-5 shadow-sm border transition-all duration-300 cursor-pointer flex items-start gap-4 group ${
                    item.completed
                      ? "border-mutedGold/50 bg-softPink/15"
                      : "border-dustyRose/20 hover:border-dustyRose/50 hover:shadow-md"
                  }`}
                >
                  {/* Checkbox Icon */}
                  <button
                    type="button"
                    className="mt-0.5 text-burgundy shrink-0 group-hover:scale-110 transition-transform"
                    aria-label={item.completed ? "Tandai belum selesai" : "Tandai sudah selesai"}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-mutedGold fill-softPink" />
                    ) : (
                      <Circle className="w-5 h-5 text-dustyRose" />
                    )}
                  </button>

                  {/* Item Text & Category */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h4
                        className={`font-serif text-base sm:text-lg font-bold transition-colors ${
                          item.completed
                            ? "text-burgundy/60 line-through decoration-mutedGold decoration-2"
                            : "text-burgundy"
                        }`}
                      >
                        {item.title}
                      </h4>

                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-softPink/50 text-[10px] font-semibold text-burgundy shrink-0">
                        {getCategoryIcon(item.category)}
                        {item.category}
                      </span>
                    </div>

                    {item.note && (
                      <p className="text-xs text-burgundy/75 mt-1 font-sans leading-relaxed">
                        {item.note}
                      </p>
                    )}

                    {item.completed && item.completedDate && (
                      <span className="inline-block mt-2 text-[10px] text-mutedGold-dark font-medium">
                        ✨ Terwujud pada: {item.completedDate}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
