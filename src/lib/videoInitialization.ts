import { VideoState } from './store';

export const initializeVideo = (file: File, videoElement: HTMLVideoElement | null, set: (state: Partial<VideoState>) => void, get: () => VideoState) => {
  if (!videoElement) return;

  // Check if already loaded with the same file to prevent infinite updates
  if (videoElement.src && get().isLoaded) {
    const currentSrc = videoElement.src;
    const fileName = file.name;
    
    // If the video is already loaded with the same file, don't reinitialize
    if (currentSrc.includes(fileName)) return;
  }

  // Check if we're already in the process of loading this file
  // This prevents the infinite update loop
  const currentLoadingState = get();
  const isSameFile = currentLoadingState.file?.name === file.name;
  const isAlreadyLoading = !currentLoadingState.isLoaded && videoElement.src?.includes(file.name);
  
  // If we're already loading or have loaded the same file, don't reinitialize
  if (isSameFile && (isAlreadyLoading || currentLoadingState.isLoaded)) {
    console.log('File already loaded or loading, skipping re-initialization');
    return;
  }

  const url = URL.createObjectURL(file);
  videoElement.src = url;
  
  // Always reset the loaded state when initializing a new video
  set({ isLoaded: false, error: null, file });
  console.log('Video loading started, isLoaded set to false');

  // Set isLoaded to true when the video is ready to play
  videoElement.addEventListener('loadeddata', () => {
    console.log('Video data loaded, setting isLoaded to true');
    set({ isLoaded: true, error: null });
    
    // Check if we should autoplay
    if (get().isPlaying) {
      console.log('Attempting autoplay after load');
      videoElement.play().catch((error) => {
        console.error('Error during autoplay:', error);
        set({ isPlaying: false, error: 'Error during autoplay: ' + error.message });
      });
    }
  }, { once: true });

  videoElement.addEventListener('error', (e) => {
    console.error('Video error event:', e);
    URL.revokeObjectURL(url);
    set({ error: 'Failed to play video', isLoaded: false });
  }, { once: true });

  // Add a loadedmetadata event to ensure we know when video metadata is available
  videoElement.addEventListener('loadedmetadata', () => {
    console.log('Video metadata loaded, but waiting for full data load');
    // We don't set isLoaded=true here because we want to wait for loadeddata
  }, { once: true });
  
  // Add a waiting event to track buffering state
  videoElement.addEventListener('waiting', () => {
    console.log('Video is waiting for more data');
    set({ isBuffering: true });
  });
  
  // Add a playing event to track when buffering ends
  videoElement.addEventListener('playing', () => {
    console.log('Video is now playing');
    set({ isBuffering: false, isPlaying: true });
  });

  // Force the video element to load
  videoElement.load();
  
  return () => URL.revokeObjectURL(url);
};