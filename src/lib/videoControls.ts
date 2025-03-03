import { VideoState } from './store';

export const togglePlay = (videoElement: HTMLVideoElement | null, isPlaying: boolean, isLoaded: boolean, set: (state: Partial<VideoState>) => void) => {
  if (!videoElement) {
    console.error('Video element is null');
    return;
  }
  
  if (!isLoaded) {
    console.log('Video is not loaded yet, queuing play action for when it loads');
    // Instead of just returning, we set isPlaying to true so that when the video loads,
    // the loadeddata event handler in videoInitialization.ts will auto-play it
    set({ isPlaying: true });
    return;
  }

  if (!isPlaying) {
    console.log('Attempting to play video...');
    videoElement.play()
      .then(() => {
        console.log('Video playing successfully');
        set({ isPlaying: true, error: null });
      })
      .catch((error) => {
        console.error('Error playing video:', error);
        set({ error: 'Error playing video: ' + error.message, isPlaying: false });
      });
  } else {
    console.log('Pausing video');
    videoElement.pause();
    set({ isPlaying: false });
  }
};

export const skipForward = (videoElement: HTMLVideoElement | null, set: (state: Partial<VideoState>) => void) => {
  if (!videoElement) return;

  const newTime = Math.min(videoElement.duration, videoElement.currentTime + 5);
  videoElement.currentTime = newTime;
  set({ currentTime: Math.floor(newTime * 1000) });
};

export const skipBackward = (videoElement: HTMLVideoElement | null, set: (state: Partial<VideoState>) => void) => {
  if (!videoElement) return;

  const newTime = Math.max(0, videoElement.currentTime - 5);
  videoElement.currentTime = newTime;
  set({ currentTime: Math.floor(newTime * 1000) });
};

export const stop = (videoElement: HTMLVideoElement | null, set: (state: Partial<VideoState>) => void) => {
  if (!videoElement) return;

  videoElement.pause();
  videoElement.currentTime = 0;
  set({ isPlaying: false, currentTime: 0 });
};