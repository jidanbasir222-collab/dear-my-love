"use client";

import { useMusic } from "./MusicContext";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music2, Disc, ListMusic, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function FloatingMusicPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    nextSong,
    prevSong,
    currentTime,
    duration,
    volume,
    setVolume,
    seekTo,
    isPlayerOpen,
    setIsPlayerOpen,
    songs,
    playSong,
  } = useMusic();

  if (!currentSong) return null;

  return (
    <>
      {/* Floating Pill Mini Player (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-40 max-w-sm">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="romantic-glass rounded-full px-4 py-2.5 shadow-romantic flex items-center gap-3 border border-dustyRose/40 hover:border-dustyRose transition-all duration-300"
        >
          {/* Spinning Album Disc */}
          <div
            onClick={() => setIsPlayerOpen(true)}
            className="relative cursor-pointer group"
            title="Klik untuk membuka pemutar musik"
          >
            <div
              className={`w-10 h-10 rounded-full border-2 border-mutedGold/60 overflow-hidden shadow-sm flex items-center justify-center bg-burgundy-deep text-white ${
                isPlaying ? "animate-[spin_4s_linear_infinite]" : ""
              }`}
            >
              {currentSong.coverUrl ? (
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Disc className="w-5 h-5 text-mutedGold" />
              )}
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-mutedGold rounded-full ring-2 ring-white"></span>
          </div>

          {/* Song Info */}
          <div
            onClick={() => setIsPlayerOpen(true)}
            className="cursor-pointer max-w-[130px] sm:max-w-[160px] select-none"
          >
            <p className="text-xs font-semibold text-burgundy truncate">{currentSong.title}</p>
            <p className="text-[10px] text-burgundy/70 truncate">{currentSong.artist}</p>
          </div>

          {/* Quick Play/Pause Control */}
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-burgundy text-white hover:bg-burgundy-dark transition-colors flex items-center justify-center shadow-md active:scale-95"
            aria-label={isPlaying ? "Jeda" : "Putar"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-ivory fill-ivory" />
            ) : (
              <Play className="w-4 h-4 text-ivory fill-ivory ml-0.5" />
            )}
          </button>

          {/* Expand Full Player Button */}
          <button
            onClick={() => setIsPlayerOpen(!isPlayerOpen)}
            className="p-1.5 text-burgundy/80 hover:text-burgundy hover:bg-softPink/40 rounded-full transition-colors"
            title="Daftar Lagu"
          >
            <ListMusic className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* Full Romantic Music Modal */}
      <AnimatePresence>
        {isPlayerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy-deep/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-ivory border border-dustyRose/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsPlayerOpen(false)}
                className="absolute top-4 right-4 p-2 text-burgundy/70 hover:text-burgundy rounded-full hover:bg-softPink/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <span className="text-[11px] uppercase tracking-widest text-mutedGold font-semibold">
                  OUR SOUNDTRACK
                </span>
                <h3 className="font-serif text-2xl font-bold text-burgundy mt-1">Lagu Cinta Kita</h3>
              </div>

              {/* Album Art Vinyl Presentation */}
              <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 mb-6">
                <div
                  className={`w-full h-full rounded-2xl overflow-hidden shadow-polaroid border-4 border-white ${
                    isPlaying ? "scale-105" : "scale-100"
                  } transition-transform duration-500`}
                >
                  <img
                    src={currentSong.coverUrl || "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80"}
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Vinyl Grooves Graphic */}
                <div className="absolute -inset-2 rounded-2xl border border-mutedGold/30 -z-10 animate-pulse-subtle"></div>
              </div>

              {/* Track Details */}
              <div className="text-center mb-4">
                <h4 className="font-serif text-xl font-bold text-burgundy">{currentSong.title}</h4>
                <p className="text-sm text-burgundy/75 font-medium mt-1">{currentSong.artist}</p>
              </div>

              {/* Progress Slider */}
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => seekTo(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-softPink rounded-lg appearance-none cursor-pointer accent-burgundy"
                />
                <div className="flex justify-between text-[11px] text-burgundy/70 mt-1 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <button
                  onClick={prevSong}
                  className="p-3 text-burgundy/80 hover:text-burgundy hover:bg-softPink/40 rounded-full transition-colors active:scale-95"
                  title="Sebelumnya"
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
                    <Play className="w-6 h-6 text-ivory fill-ivory ml-1" />
                  )}
                </button>
                <button
                  onClick={nextSong}
                  className="p-3 text-burgundy/80 hover:text-burgundy hover:bg-softPink/40 rounded-full transition-colors active:scale-95"
                  title="Selanjutnya"
                >
                  <SkipForward className="w-5 h-5 fill-burgundy/30" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3 px-4 py-2 bg-softPink/30 rounded-full mb-6">
                <button
                  onClick={() => setVolume(volume === 0 ? 0.75 : 0)}
                  className="text-burgundy/70 hover:text-burgundy"
                >
                  {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-dustyRose/40 rounded-lg appearance-none cursor-pointer accent-burgundy"
                />
              </div>

              {/* Playlist drawer */}
              <div className="border-t border-dustyRose/20 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-burgundy flex items-center gap-1.5">
                    <Music2 className="w-3.5 h-3.5 text-mutedGold" /> Daftar Putar ({songs.length})
                  </span>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {songs.map((song) => {
                    const isSelected = song.id === currentSong.id;
                    return (
                      <div
                        key={song.id}
                        onClick={() => playSong(song)}
                        className={`p-2 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-softPink font-bold text-burgundy"
                            : "hover:bg-softPink/40 text-burgundy/80"
                        }`}
                      >
                        <div className="truncate mr-2">
                          <p className="truncate">{song.title}</p>
                          <p className="text-[10px] text-burgundy/60 font-normal">{song.artist}</p>
                        </div>
                        <span className="text-[10px] text-mutedGold font-mono">{song.duration}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
