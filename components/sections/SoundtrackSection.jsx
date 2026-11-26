"use client";

import { useMusic } from "../MusicContext";
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function SoundtrackSection() {
  const {
    songs,
    currentSong,
    isPlaying,
    togglePlay,
    playSong,
    nextSong,
    prevSong,
    currentTime,
    duration,
    volume,
    setVolume,
    seekTo,
  } = useMusic();

  if (!currentSong) return null;

  return (
    <section id="soundtrack" className="py-24 px-4 sm:px-6 relative bg-ivory">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-softPink/60 text-burgundy text-xs uppercase tracking-widest font-semibold mb-3 border border-dustyRose/30"
          >
            <Music className="w-3.5 h-3.5 text-mutedGold" />
            <span>OUR SOUNDTRACK</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-burgundy mb-3"
          >
            Melodi &amp; Lagu Favorit Kita
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-burgundy/75"
          >
            Lagu-lagu yang menemani setiap perjalanan, obrolan larut malam, dan tawa kita berdua.
          </motion.p>
        </div>

        {/* Main Music Player Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-romantic border border-dustyRose/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Vinyl Disc Presentation */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-52 h-52 sm:w-64 sm:h-64">
              {/* Outer Golden Glow */}
              <div className="absolute inset-0 rounded-full bg-softPink blur-xl opacity-60"></div>

              {/* Vinyl Disc */}
              <div
                className={`relative w-full h-full rounded-full border-4 border-mutedGold/50 shadow-2xl overflow-hidden bg-burgundy-deep flex items-center justify-center ${
                  isPlaying ? "animate-[spin_6s_linear_infinite]" : ""
                }`}
              >
                {/* Vinyl Grooves concentric rings */}
                <div className="absolute inset-4 rounded-full border border-white/10"></div>
                <div className="absolute inset-8 rounded-full border border-white/10"></div>
                <div className="absolute inset-12 rounded-full border border-white/10"></div>

                {/* Center Label / Album Artwork */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-white shadow-inner">
                  <img
                    src={currentSong.coverUrl || "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80"}
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Spindle hole */}
                  <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-ivory border-2 border-burgundy"></div>
                </div>
              </div>
            </div>

            {/* Currently Playing Status Badge */}
            <div className="mt-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-softPink/60 text-burgundy text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-mutedGold" />
              <span>{isPlaying ? "Sedang Memutar" : "Lagu Terpilih"}</span>
            </div>
          </div>

          {/* Right Column: Song Info & Controls */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="mb-4">
              <span className="text-xs uppercase tracking-widest text-mutedGold font-semibold">
                TREK SAAT INI
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy mt-1">
                {currentSong.title}
              </h3>
              <p className="text-sm sm:text-base text-burgundy/75 font-medium mt-0.5">
                {currentSong.artist}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-5">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={(e) => seekTo(parseFloat(e.target.value))}
                className="w-full h-2 bg-softPink rounded-lg appearance-none cursor-pointer accent-burgundy"
              />
              <div className="flex justify-between text-xs text-burgundy/60 mt-1.5 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={prevSong}
                  className="p-3 text-burgundy/80 hover:text-burgundy hover:bg-softPink/40 rounded-full transition-colors active:scale-95"
                  title="Lagu Sebelumnya"
                >
                  <SkipBack className="w-5 h-5 fill-burgundy/30" />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-burgundy hover:bg-burgundy-dark text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                  title={isPlaying ? "Jeda" : "Putar"}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-ivory fill-ivory" />
                  ) : (
                    <Play className="w-6 h-6 text-ivory fill-ivory ml-0.5" />
                  )}
                </button>
                <button
                  onClick={nextSong}
                  className="p-3 text-burgundy/80 hover:text-burgundy hover:bg-softPink/40 rounded-full transition-colors active:scale-95"
                  title="Lagu Selanjutnya"
                >
                  <SkipForward className="w-5 h-5 fill-burgundy/30" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 bg-softPink/30 rounded-full border border-dustyRose/20">
                <button
                  onClick={() => setVolume(volume === 0 ? 0.75 : 0)}
                  className="text-burgundy/70 hover:text-burgundy"
                >
                  {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-mutedGold" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 sm:w-24 h-1.5 bg-dustyRose/40 rounded-lg appearance-none cursor-pointer accent-burgundy"
                />
              </div>
            </div>

            {/* Playlist Row */}
            <div className="border-t border-dustyRose/20 pt-4">
              <span className="text-xs font-semibold text-burgundy/70 mb-2 block">
                Pilih Dari Playlist Kita:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {songs.map((song) => {
                  const isCurrent = song.id === currentSong.id;
                  return (
                    <div
                      key={song.id}
                      onClick={() => playSong(song)}
                      className={`p-2.5 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all ${
                        isCurrent
                          ? "bg-softPink font-bold text-burgundy border border-dustyRose/40 shadow-sm"
                          : "hover:bg-softPink/30 text-burgundy/80 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate mr-2">
                        <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 bg-neutral-100">
                          <img
                            src={song.coverUrl || "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=150&q=80"}
                            alt={song.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="truncate">
                          <p className="truncate">{song.title}</p>
                          <p className="text-[10px] text-burgundy/60 font-normal">{song.artist}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-mutedGold font-mono shrink-0">{song.duration}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
