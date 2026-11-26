"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const audioRef = useRef(null);

  // Fetch playlist from API
  useEffect(() => {
    async function loadSongs() {
      try {
        const res = await fetch("/api/songs");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setSongs(data);
            const defaultIndex = data.findIndex((s) => s.isDefault);
            if (defaultIndex !== -1) {
              setCurrentSongIndex(defaultIndex);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load songs:", err);
      }
    }
    loadSongs();
  }, []);

  const currentSong = songs[currentSongIndex] || null;

  // Sync audio source when current song changes
  useEffect(() => {
    if (audioRef.current && currentSong?.audioUrl) {
      const wasPlaying = isPlaying;
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.load();
      if (wasPlaying && hasInteracted) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn("Autoplay blocked or audio load error:", err);
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

  // Triggered when user clicks "Buka Kisah Kita"
  const startMusicOnUserAction = () => {
    setHasInteracted(true);
    if (audioRef.current && currentSong && !isPlaying) {
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
        preload="metadata"
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
