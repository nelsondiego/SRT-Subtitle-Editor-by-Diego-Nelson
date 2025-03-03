import { create } from 'zustand';
import { initializeVideo } from './videoInitialization';
import { togglePlay, skipForward, skipBackward, stop } from './videoControls';

interface Subtitle {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
}

export interface VideoState {
  file: File | null;
  subtitleFile: File | null;
  isPlaying: boolean;
  currentTime: number;
  isLoaded: boolean;
  isBuffering: boolean;
  error: string | null;
  videoElement: HTMLVideoElement | null;
  subtitles: Subtitle[];
  loading: boolean;
  currentSubtitle: Subtitle | null;
  nextSubtitle: Subtitle | null;
  totalAdjustment: number;
  setFile: (file: File | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setIsLoaded: (isLoaded: boolean) => void;
  setIsBuffering: (isBuffering: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  initializeVideo: (file: File) => void;
  handleTimeUpdate: () => void;
  togglePlay: () => void;
  skipForward: () => void;
  skipBackward: () => void;
  stop: () => void;
  setVideoElement: (element: HTMLVideoElement | null) => void;
  setSubtitles: (subtitles: Subtitle[]) => void;
  setLoading: (loading: boolean) => void;
  handleSubtitleFileUpload: (file: File) => Promise<void>;
  adjustSubtitleTiming: (ms: number) => void;
  updateSubtitlesState: (time: number) => void;
  exportSubtitles: () => void;
  removeVideo: () => void;
  removeSubtitles: () => void;
  deleteSubtitle: (id: number) => void;
  updateSubtitle: (id: number, text: string) => void;
}

const initialState = {
  file: null,
  subtitleFile: null,
  isPlaying: false,
  currentTime: 0,
  isLoaded: false,
  isBuffering: false,
  error: null,
  videoElement: null,
  subtitles: [],
  loading: false,
  currentSubtitle: null,
  nextSubtitle: null,
  totalAdjustment: 0,
};

export const useVideoStore = create<VideoState>()((set, get) => ({
  ...initialState,

  setFile: (file) => set({ file }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setIsLoaded: (isLoaded) => set({ isLoaded }),
  setIsBuffering: (isBuffering) => set({ isBuffering }),
  setError: (error) => set({ error }),
  setVideoElement: (element) => {
    set((state) => {
      if (state.videoElement === element) return state;
      return { videoElement: element };
    });
  },
  reset: () => set(initialState),

  initializeVideo: (file) => {
    const { videoElement } = get();
    return initializeVideo(file, videoElement, set, get);
  },

  handleTimeUpdate: () => {
    const { videoElement } = get();
    if (videoElement) {
      const time = Math.floor(videoElement.currentTime * 1000);
      set({ currentTime: time });
      get().updateSubtitlesState(time);
    }
  },

  togglePlay: () => {
    const { videoElement, isPlaying, isLoaded } = get();
    togglePlay(videoElement, isPlaying, isLoaded, set);
  },

  skipForward: () => {
    const { videoElement } = get();
    skipForward(videoElement, set);
  },

  skipBackward: () => {
    const { videoElement } = get();
    skipBackward(videoElement, set);
  },

  stop: () => {
    const { videoElement } = get();
    stop(videoElement, set);
  },

  setSubtitles: (subtitles) => set({ subtitles }),
  setLoading: (loading) => set({ loading }),

  handleSubtitleFileUpload: async (file) => {
    if (file && file.name.endsWith('.srt')) {
      set({ loading: true, subtitleFile: file });
      try {
        const buffer = await file.arrayBuffer();
        // Try multiple encodings to handle special characters properly
        // First try UTF-8
        let text = new TextDecoder('utf-8').decode(buffer);
        
        // Check if UTF-8 decoding produced replacement characters (�)
        // If so, try other common encodings
        if (text.includes('�')) {
          // Try ISO-8859-1 (Latin-1)
          const latin1Text = new TextDecoder('iso-8859-1').decode(buffer);
          
          // Try Windows-1252 (common for Spanish and other Latin languages)
          const windows1252Text = new TextDecoder('windows-1252').decode(buffer);
          
          // Use the encoding that seems to have fewer replacement characters
          // This is a simple heuristic but works in many cases
          if (latin1Text.includes('�') && !windows1252Text.includes('�')) {
            text = windows1252Text;
          } else if (!latin1Text.includes('�')) {
            text = latin1Text;
          }
          // If all encodings have replacement characters, we'll stick with UTF-8
        }

        const timeToMs = (timeStr: string): number => {
          const [time, ms] = timeStr.split(',');
          const [hours, minutes, seconds] = time.split(':').map(Number);
          return hours * 3600000 + minutes * 60000 + seconds * 1000 + parseInt(ms);
        };

        const parseSrt = (content: string): Subtitle[] => {
          const blocks = content.trim().split(/\n\s*\n/);
          return blocks.map(block => {
            const lines = block.trim().split('\n');
            const id = parseInt(lines[0]);
            const timeLine = lines[1];
            const text = lines.slice(2).join('\n');
            
            const [startStr, endStr] = timeLine.split(' --> ');
            
            return {
              id,
              startTime: timeToMs(startStr),
              endTime: timeToMs(endStr),
              text
            };
          });
        };

        const parsedSubtitles = parseSrt(text);
        set({ subtitles: parsedSubtitles });
      } catch (error) {
        console.error('Error parsing SRT file:', error);
      } finally {
        set({ loading: false });
      }
    }
  },

  adjustSubtitleTiming: (ms) => {
    const { subtitles, currentTime, totalAdjustment } = get();
    
    // If ms is 0, it means reset timing
    if (ms === 0) {
      // Apply the inverse of total adjustment to restore original timing
      const resetAdjustment = -totalAdjustment;
      const restoredSubtitles = subtitles.map(subtitle => ({
        ...subtitle,
        startTime: Math.max(0, subtitle.startTime + resetAdjustment),
        endTime: Math.max(0, subtitle.endTime + resetAdjustment)
      }));
      
      set({ 
        subtitles: restoredSubtitles,
        totalAdjustment: 0
      });
      
      get().updateSubtitlesState(currentTime);
      return;
    }
    
    const newSubtitles = subtitles.map(subtitle => ({
      ...subtitle,
      startTime: Math.max(0, subtitle.startTime + ms),
      endTime: Math.max(0, subtitle.endTime + ms)
    }));
    
    // Update the total adjustment
    set({ 
      subtitles: newSubtitles,
      totalAdjustment: totalAdjustment + ms 
    });
    
    get().updateSubtitlesState(currentTime);
  },
  
  updateSubtitlesState: (time) => {
    const { subtitles } = get();
    
    // Find current subtitle
    const currentSubtitle = subtitles.find(
      subtitle => time >= subtitle.startTime && time <= subtitle.endTime
    ) || null;
    
    // Find next subtitle
    let nextSubtitle = null;
    if (subtitles.length > 0) {
      // Find subtitles that start after current time
      const upcomingSubtitles = subtitles.filter(subtitle => subtitle.startTime > time);
      
      // Sort by start time and get the closest one
      if (upcomingSubtitles.length > 0) {
        nextSubtitle = upcomingSubtitles.sort((a, b) => a.startTime - b.startTime)[0];
      }
    }
    
    set({ currentSubtitle, nextSubtitle });
  },

  exportSubtitles: () => {
    const { subtitles, file } = get();
    
    if (!subtitles.length || !file) return;
    
    // Convert milliseconds to SRT time format
    const msToSrtTime = (ms: number): string => {
      const hours = Math.floor(ms / 3600000);
      const minutes = Math.floor((ms % 3600000) / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      const milliseconds = (ms % 1000).toString().padStart(3, '0');
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${milliseconds}`;
    };
    
    // Generate SRT content
    const srtContent = subtitles
      .sort((a, b) => a.startTime - b.startTime)
      .map((subtitle, index) => {
        const number = index + 1;
        const timeCode = `${msToSrtTime(subtitle.startTime)} --> ${msToSrtTime(subtitle.endTime)}`;
        return `${number}\n${timeCode}\n${subtitle.text}`;
      })
      .join('\n\n');
    
    // Create a blob with the SRT content
    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    
    // Get the video filename without extension
    const videoFileName = file.name;
    const baseFileName = videoFileName.substring(0, videoFileName.lastIndexOf('.')) || videoFileName;
    const srtFileName = `${baseFileName}.srt`;
    
    // Create a download link and trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = srtFileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  },

  removeVideo: () => {
    const { videoElement } = get();
    
    if (videoElement) {
      // Pause and reset video element
      videoElement.pause();
      videoElement.removeAttribute('src');
      videoElement.load();
      // Remove all event listeners by cloning and replacing the element
      const newVideo = videoElement.cloneNode() as HTMLVideoElement;
      videoElement.parentNode?.replaceChild(newVideo, videoElement);
      set({ videoElement: null });
    }
    
    // Reset video-related state
    set({
      file: null,
      isPlaying: false,
      currentTime: 0,
      isLoaded: false,
      isBuffering: false,
      error: null
    });
  },
  
  removeSubtitles: () => {
    // Reset subtitle-related state
    set({
      subtitles: [],
      currentSubtitle: null,
      nextSubtitle: null,
      totalAdjustment: 0,
      subtitleFile: null
    });
  },

  deleteSubtitle: (id: number) => {
    const { subtitles, currentTime } = get();
    const newSubtitles = subtitles.filter(subtitle => subtitle.id !== id);
    set({ subtitles: newSubtitles });
    get().updateSubtitlesState(currentTime);
  },

  updateSubtitle: (id: number, text: string) => {
    const { subtitles, currentTime } = get();
    const newSubtitles = subtitles.map(subtitle =>
      subtitle.id === id ? { ...subtitle, text } : subtitle
    );
    set({ subtitles: newSubtitles });
    get().updateSubtitlesState(currentTime);
  },
}));