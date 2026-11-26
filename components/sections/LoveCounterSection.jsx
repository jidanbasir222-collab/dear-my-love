"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Clock, CalendarHeart } from "lucide-react";

export default function LoveCounterSection({ settings }) {
  const anniversaryDate = settings?.anniversaryDate || "2023-11-22T00:00:00";
  const coupleName1 = settings?.coupleName1 || "ahmad zaidan";
  const coupleName2 = settings?.coupleName2 || "zaskia nisa syabani";

  const [timeTogether, setTimeTogether] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
  });

  useEffect(() => {
    function calculateTime() {
      const start = new Date(anniversaryDate);
      const now = new Date();

      if (isNaN(start.getTime())) return;

      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      let days = now.getDate() - start.getDate();
      let hours = now.getHours() - start.getHours();
      let minutes = now.getMinutes() - start.getMinutes();
      let seconds = now.getSeconds() - start.getSeconds();

      if (seconds < 0) {
        seconds += 60;
        minutes--;
      }
      if (minutes < 0) {
        minutes += 60;
        hours--;
      }
      if (hours < 0) {
        hours += 24;
        days--;
      }
      if (days < 0) {
        // days in previous month
        const prevMonthDate = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonthDate.getDate();
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }

      const diffMs = Math.max(0, now.getTime() - start.getTime());
      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      setTimeTogether({
        years: Math.max(0, years),
        months: Math.max(0, months),
        days: Math.max(0, days),
        hours: Math.max(0, hours),
        minutes: Math.max(0, minutes),
        seconds: Math.max(0, seconds),
        totalDays,
      });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [anniversaryDate]);

  const counterCards = [
    { label: "Tahun", value: timeTogether.years },
    { label: "Bulan", value: timeTogether.months },
    { label: "Hari", value: timeTogether.days },
    { label: "Jam", value: timeTogether.hours },
    { label: "Menit", value: timeTogether.minutes },
    { label: "Detik", value: timeTogether.seconds },
  ];

  const formattedStartDate = new Date(anniversaryDate).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section id="counter" className="py-24 px-4 sm:px-6 relative bg-ivory">
      {/* Decorative background embellishments */}
      <div className="max-w-5xl mx-auto text-center">
        {/* Section Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-softPink/60 text-burgundy text-xs uppercase tracking-widest font-semibold mb-3 border border-dustyRose/30"
        >
          <CalendarHeart className="w-3.5 h-3.5 text-mutedGold" />
          <span>WAKTU KITA BERSAMA</span>
        </motion.div>

        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-burgundy mb-3"
        >
          Detik Demi Detik Mencintaimu
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-burgundy/75 max-w-xl mx-auto mb-10"
        >
          Perjalanan indah {coupleName1} &amp; {coupleName2} yang dimulai sejak{" "}
          <span className="font-semibold text-burgundy underline decoration-mutedGold/60 underline-offset-4">
            {formattedStartDate}
          </span>
          .
        </motion.p>

        {/* Counter Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {counterCards.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + idx * 0.08 }}
              className="relative group"
            >
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-polaroid border border-dustyRose/25 hover:border-dustyRose transition-all duration-300 hover:-translate-y-1">
                {/* Gold star corner indicator */}
                <div className="absolute top-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-2.5 h-2.5 text-mutedGold" />
                </div>

                <div className="font-serif text-3xl sm:text-4xl font-bold text-burgundy tracking-tight">
                  {String(item.value).padStart(2, "0")}
                </div>

                <div className="mt-1 text-[11px] sm:text-xs uppercase tracking-wider text-dustyRose-dark font-semibold">
                  {item.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total Days Summary Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-10 inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-6 py-3 rounded-full bg-softPink/40 border border-dustyRose/30 text-burgundy shadow-sm"
        >
          <div className="flex items-center gap-1.5 font-medium text-xs sm:text-sm">
            <Clock className="w-4 h-4 text-mutedGold" />
            <span>Total lebih dari</span>
            <span className="font-serif font-bold text-base text-burgundy">
              {timeTogether.totalDays.toLocaleString("id-ID")} hari
            </span>
            <span>penuh kehangatan dan rasa syukur.</span>
          </div>
          <Heart className="w-4 h-4 text-dustyRose fill-dustyRose animate-pulse-subtle" />
        </motion.div>
      </div>
    </section>
  );
}
