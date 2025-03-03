export type SupportedMimeType = 'video/mp4' | 'video/webm' | 'video/ogg' | 'video/x-matroska';

export const supportedMimeTypes: Record<SupportedMimeType, string[]> = {
  'video/mp4': [
    'video/mp4; codecs="avc1.42E01E,mp4a.40.2"',
    'video/mp4; codecs="avc1.4D401E,mp4a.40.2"',
    'video/mp4; codecs="avc1.58A01E,mp4a.40.2"',
    'video/mp4; codecs="avc1.64001E,mp4a.40.2"',
    'video/mp4' // Fallback sin codecs
  ],
  'video/webm': [
    'video/webm; codecs="vp8,vorbis"',
    'video/webm; codecs="vp9,opus"',
    'video/webm; codecs="vp8,opus"',
    'video/webm' // Fallback sin codecs
  ],
  'video/ogg': [
    'video/ogg; codecs="theora,vorbis"',
    'video/ogg' // Fallback sin codecs
  ],
  'video/x-matroska': [
    'video/x-matroska; codecs="avc1.4D401E,mp4a.40.2"',
    'video/x-matroska; codecs="avc1.64001E,mp4a.40.2"',
    'video/x-matroska; codecs="vp8,vorbis"',
    'video/x-matroska; codecs="vp9,opus"',
    'video/x-matroska' // Fallback sin codecs
  ]
};

// Tipos genéricos sin codecs como última opción
export const genericTypes = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/x-matroska'
];