"use client";

import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Calendar, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageLightbox({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNext,
  onPrev,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onNext, onPrev, onClose]);

  if (!isOpen || !images || images.length === 0) return null;

  const current = images[currentIndex] || images[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy-deep/85 backdrop-blur-md"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
          aria-label="Tutup"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors z-50 active:scale-95"
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors z-50 active:scale-95"
            aria-label="Selanjutnya"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Polaroid Lightbox Container */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Main Photo with safe aspect */}
          <div className="relative w-full h-[52vh] sm:h-[58vh] bg-neutral-100 rounded-xl overflow-hidden flex items-center justify-center">
            <img
              src={current.photoUrl}
              alt={current.title}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Details footer in romantic typography */}
          <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-burgundy">
                {current.title}
              </h3>
              {current.caption && (
                <p className="text-xs sm:text-sm text-burgundy/80 font-handwriting text-base sm:text-lg mt-0.5">
                  "{current.caption}"
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-burgundy/60 shrink-0">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-mutedGold" />
                {current.date}
              </span>
              {current.category && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-softPink text-burgundy font-medium">
                  <Tag className="w-3 h-3 text-mutedGold" />
                  {current.category}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
