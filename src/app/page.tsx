"use client";

import { Download, FileVideo, FileText, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/VideoPlayer";
import { VideoControls } from "@/components/VideoControls";
import { SubtitleEditor } from "@/components/SubtitleEditor";
import { CurrentSubtitle } from "@/components/CurrentSubtitle";
import { useVideoStore } from "@/lib/store";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  const { 
    file, 
    subtitleFile,
    subtitles,
    adjustSubtitleTiming,
    exportSubtitles,
    totalAdjustment,
    removeVideo,
    removeSubtitles
  } = useVideoStore();
  
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-[1800px] mx-auto space-y-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Image src="/subtitle-icon.svg" alt="SRT Editor Logo" width={32} height={32} />
              <h1 className="text-4xl font-bold tracking-tight">SRT Subtitle Editor</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={exportSubtitles}
              disabled={!file}
              title="Export Subtitles"
            >
              <Download className="w-4 h-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
        
        <div className="flex gap-4">
          {/* Left Column - Subtitles (30%) */}
          <div className="w-[30%] space-y-4">
            <div className="relative">
              {subtitles.length > 0 && (
                <div className="flex items-center justify-between gap-2 mb-2 px-3 py-2 rounded-lg bg-muted">
                  <FileText className="w-4 h-4 text-primary" />
                  <p className="text-sm font-medium">
                    {subtitleFile ? subtitleFile.name : "Subtitles"}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeSubtitles()}
                    title="Remove Subtitles"
                  >
                    <X  />
                  </Button>
                </div>
              )}
              <SubtitleEditor />
            </div>
          </div>

          {/* Middle Column - Video (50%) */}
          <div className="w-[50%] space-y-4">
            <div className="relative">
              {file && (
                <div className="flex items-center justify-between gap-2 mb-2 px-3 py-2 rounded-lg bg-muted">
                  <FileVideo className="w-4 h-4 text-primary" />
                  <p className="text-sm font-medium">{file.name}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeVideo()}
                    title="Remove Video"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="border rounded-lg p-4 bg-card shadow-sm">
                <VideoPlayer />
              </div>
            </div>
            
            <VideoControls
              disabled={!file}
            />

            <CurrentSubtitle />
          </div>

          {/* Right Column - Time Adjustment (20%) */}
          <div className="w-[20%]">
            <div className="border rounded-lg p-4 bg-card shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Time Adjustment</h3>
                <span className="text-xs text-muted-foreground">Total: {totalAdjustment}ms</span>
              </div>
              
              <div className="space-y-2">
                {[1000, 500, 100, 50].map((ms) => (
                  <div key={ms} className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-12"
                      onClick={() => adjustSubtitleTiming(-ms)}
                    >
                      -
                    </Button>
                    <div className="flex-1 text-center border rounded-md py-1.5 text-sm">
                      {ms}ms
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-12"
                      onClick={() => adjustSubtitleTiming(ms)}
                    >
                      +
                    </Button>
                  </div>
                ))}

                <div className="h-px bg-border my-2" />
                
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => adjustSubtitleTiming(0)}
                >
                  Reset Timing
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
