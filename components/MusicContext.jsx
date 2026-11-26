"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const MusicContext = createContext(null);

export function MusicProvider({ children, initialSongs = [] }) {
  const initialList = Array.isArray(initialSongs) && initialSongs.length > 0 ? initialSongs : [];
  const defaultIdx = initialList.findIndex((s) => s.isDefault);

  const [songs, setSongs] = useState(initialList);
  const [currentSongIndex, setCurrentSongIndex] = useState(defaultIdx >= 0 ? defaultIdx : 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const audioRef = useRef(null);

  // Fetch playlist from API in background to ensure sync with admin updates
  useEffect(() => {
    async function loadSongs() {
      try {
        const res = await fetch("/api/songs");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setSongs(data);
            setCurrentSongIndex((prev) => {
              if (prev >= data.length) {
                const def = data.findIndex((s) => s.isDefault);
                return def >= 0 ? def : 0;
              }
              return prev;
            });
          }
        }
      } catch (err) {
        console.warn("Client fetch /api/songs fallback to initial songs:", err);
      }
    }
    loadSongs();
  }, []);

  const currentSong = songs[currentSongIndex] || null;

  // Sync audio source when current song changes
  useEffect(() => {
    if (audioRef.current && currentSong?.audioUrl) {
      const wasPlaying = isPlaying;
      const targetSrc = currentSong.audioUrl;
      if (!audioRef.current.src.endsWith(targetSrc)) {
        audioRef.current.src = targetSrc;
        audioRef.current.load();
      }
      if (wasPlaying && hasInteracted) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn("Autoplay restriction or audio playback blocked:", err);
            setIsPlaying(false);
          });
      }
    }
  }, [currentSongIndex, songs]);

  // Volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle play / pause toggle
  const togglePlay = () => {
    setHasInteracted(true);
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const targetSrc = currentSong.audioUrl;
      if (!audioRef.current.src.endsWith(targetSrc)) {
        audioRef.current.src = targetSrc;
        audioRef.current.load();
      }
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Audio playback error:", err);
          setIsPlaying(false);
        });
    }
  };

  const playSong = (song) => {
    setHasInteracted(true);
    const index = songs.findIndex((s) => s.id === song.id);
    if (index !== -1) {
      setCurrentSongIndex(index);
      if (audioRef.current) {
        audioRef.current.src = song.audioUrl;
        audioRef.current.load();
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.warn(err));
      }
    }
  };

  const nextSong = () => {
    if (songs.length === 0) return;
    const nextIdx = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIdx);
  };

  const prevSong = () => {
    if (songs.length === 0) return;
    const prevIdx = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIdx);
  };

  const seekTo = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  // Triggered when user clicks "Buka Kisah Kita" (gesture unlocks browser audio)
  const startMusicOnUserAction = () => {
    setHasInteracted(true);
    if (audioRef.current && currentSong?.audioUrl) {
      const targetSrc = currentSong.audioUrl;
      if (!audioRef.current.src.endsWith(targetSrc)) {
        audioRef.current.src = targetSrc;
        audioRef.current.load();
      }
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Audio trigger error:", err));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    nextSong();
  };

  return (
    <MusicContext.Provider
      value={{
        songs,
        currentSong,
        currentSongIndex,
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
        isPlayerOpen,
        setIsPlayerOpen,
        startMusicOnUserAction,
      }}
    >
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={(e) => console.warn("Audio element error event:", e)}
        playsInline
        preload="auto"
      />
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
