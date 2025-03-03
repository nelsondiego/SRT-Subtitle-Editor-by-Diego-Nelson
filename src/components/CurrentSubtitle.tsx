"use client";


import { useVideoStore } from "@/lib/store";



export function CurrentSubtitle() {
  // Get the preloaded current and next subtitle from the store
  const { currentSubtitle } = useVideoStore();

  

  return (
    <div>
      <p className="text-lg text-center font-medium leading-relaxed">{currentSubtitle?.text ?? ''}</p>
    
    </div>
  );
}