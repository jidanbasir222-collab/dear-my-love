"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import FloatingHearts from "./FloatingHearts";
import FloatingMusicPlayer from "./FloatingMusicPlayer";
import ImageLightbox from "./ImageLightbox";
import HeroSection from "./sections/HeroSection";
import LoveCounterSection from "./sections/LoveCounterSection";
import JourneySection from "./sections/JourneySection";
import MemoriesSection from "./sections/MemoriesSection";
import LetterSection from "./sections/LetterSection";
import SoundtrackSection from "./sections/SoundtrackSection";
import SurpriseSection from "./sections/SurpriseSection";
import FutureSection from "./sections/FutureSection";
import FinalSection from "./sections/FinalSection";

export default function UniverseView({
  settings,
  milestones,
  memories,
  letter,
  surprise,
  bucketItems,
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleOpenLightbox = (imagesList, index) => {
    setLightboxImages(imagesList);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleJourneyImageClick = (photoUrl, title, caption) => {
    setLightboxImages([{ photoUrl, title, caption, date: "" }]);
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

  const handleNextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const handlePrevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  return (
    <div className="min-h-screen bg-ivory text-burgundy relative selection:bg-dustyRose selection:text-white">
      {/* Floating Ambient Hearts & Twinkles */}
      <FloatingHearts />

      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main>
        {/* Page 1: Welcome / Hero */}
        <HeroSection settings={settings} />

        {/* Page 2: Love Counter */}
        <LoveCounterSection settings={settings} />

        {/* Page 3: Our Journey */}
        <JourneySection
          milestones={milestones}
          onImageClick={handleJourneyImageClick}
        />

        {/* Page 4: Our Memories */}
        <MemoriesSection
          memories={memories}
          onOpenLightbox={handleOpenLightbox}
        />

        {/* Page 5: A Letter For You */}
        <LetterSection letter={letter} />

        {/* Page 6: Our Soundtrack */}
        <SoundtrackSection />

        {/* Page 7: Little Surprise */}
        <SurpriseSection surprise={surprise} />

        {/* Page 8: Our Future */}
        <FutureSection initialBucketItems={bucketItems} />

        {/* Page 9: Final Message */}
        <FinalSection settings={settings} />
      </main>

      {/* Persistent Floating Music Player */}
      <FloatingMusicPlayer />

      {/* Fullscreen Photo Lightbox Modal */}
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={lightboxImages}
        currentIndex={lightboxIndex}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />
    </div>
  );
}
