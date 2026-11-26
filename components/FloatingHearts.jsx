"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function FloatingHearts() {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    // Generate gentle random particles
    const items = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.random() * 96 + 2,
      size: Math.random() * 14 + 10,
      duration: Math.random() * 8 + 12,
      delay: Math.random() * 8,
      type: i % 4 === 0 ? "star" : "heart",
      opacity: Math.random() * 0.4 + 0.25,
    }));
    setElements(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute"
          style={{
            left: `${el.left}%`,
            bottom: "-30px",
          }}
          initial={{ y: 0, opacity: 0, scale: 0.6 }}
          animate={{
            y: "-110vh",
            opacity: [0, el.opacity, el.opacity * 0.8, 0],
            scale: [0.6, 1, 0.9, 0.7],
            x: ["0px", `${(el.id % 2 === 0 ? 1 : -1) * 25}px`, "0px"],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {el.type === "heart" ? (
            <svg
              width={el.size}
              height={el.size}
              viewBox="0 0 24 24"
              fill="#D9A6AC"
              className="drop-shadow-sm text-dustyRose"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg
              width={el.size * 0.85}
              height={el.size * 0.85}
              viewBox="0 0 24 24"
              fill="#C7A36B"
              className="drop-shadow-sm text-mutedGold"
            >
              <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}
