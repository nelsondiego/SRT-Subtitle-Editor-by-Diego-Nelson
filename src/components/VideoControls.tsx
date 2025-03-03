"use client";

import { Play, Pause, SkipBack, SkipForward, Clock, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVideoStore } from '@/lib/store';

interface VideoControlsProps {
  disabled: boolean;
}

export function VideoControls({ disabled }: VideoControlsProps) {
  const { 
    isPlaying, 
    currentTime, 
    togglePlay, 
    skipForward, 
    skipBackward, 
    stop,
  } = useVideoStore();

  const msToTime = (ms: number): string => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = (ms % 1000).toString().padStart(3, '0').slice(0, 3);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${milliseconds}`;
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      togglePlay();
    }
  };

  const handleSkipForward = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      skipForward();
    }
  };

  const handleSkipBackward = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      skipBackward();
    }
  };
  
  const handleStop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      stop();
    }
  };


  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={handleSkipBackward}
        disabled={disabled}
        title="Skip Backward 5s"
      >
        <SkipBack className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={handlePlayPause}
        disabled={disabled}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={handleStop}
        disabled={disabled}
        title="Stop"
      >
        <Square className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={handleSkipForward}
        disabled={disabled}
        title="Skip Forward 5s"
      >
        <SkipForward className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2 ml-4">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{msToTime(currentTime)}</span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        
      </div>
    </div>
  );
}