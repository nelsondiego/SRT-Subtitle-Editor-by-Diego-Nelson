"use client";

import { FileVideo, Upload } from 'lucide-react';
import { useVideoStore } from '@/lib/store';

export function VideoPlayer() {
  const { 
    file,
    videoElement,
    setFile,
    setVideoElement,
    initializeVideo,
    handleTimeUpdate
  } = useVideoStore();
  
  const handleVideoRef = (element: HTMLVideoElement | null) => {
    if (element) {
      const handleTimeUpdateEvent = () => {
        handleTimeUpdate();
      };

      element.addEventListener('timeupdate', handleTimeUpdateEvent);
      
      // Only initialize video if we haven't set the video element yet
      if (!videoElement) {
        setVideoElement(element);
        if (file) {
          initializeVideo(file);
        }
      }

      return () => {
        element.removeEventListener('timeupdate', handleTimeUpdateEvent);
      };
    }
  };

  const handleFileSelect = (file: File) => {
    setFile(file);
    initializeVideo(file);
  };

  if (!file) {
    return (
      <label className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
        <div className="text-center">
          <FileVideo className="w-10 h-10 mx-auto text-muted-foreground" />
          <Upload className="w-6 h-6 mt-4 mx-auto text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Drop video file or click to upload</p>
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />
        </div>
      </label>
    );
  }

  return (
    <video
      ref={handleVideoRef}
      className="w-full aspect-video bg-black rounded-lg"
      playsInline
      preload="auto"
    />
  );
}