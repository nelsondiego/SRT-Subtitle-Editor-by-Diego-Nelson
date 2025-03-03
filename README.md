# SRT Subtitle Editor
by Diego Nelson

## Overview
A modern web application for editing and synchronizing SRT subtitle files with video content. Built with Next.js and React.

![SRT Subtitle Editor Screenshot](/public/srt-suntitle-editor-movies.jpg)

## Features

- **Video Support**: Upload and play video files directly in the browser
- **SRT Subtitle Support**: Load and edit SRT subtitle files with multi-encoding support (UTF-8, ISO-8859-1, Windows-1252)
- **Real-time Synchronization**: View subtitles in sync with video playback
- **Time Adjustment**: Fine-tune subtitle timing with millisecond precision
  - Adjust timing by ±1000ms, ±500ms, ±100ms, or ±50ms
  - Reset timing adjustments with one click
- **Modern Interface**: Clean, responsive design with dark mode support
- **Export**: Save your adjusted subtitles back to SRT format

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to start editing subtitles.

## How to Use

1. Click the video upload area to select a video file or drag and drop one
2. Upload your SRT subtitle file in the left panel
3. Use the playback controls to navigate through the video
4. Adjust subtitle timing using the controls in the right panel
5. Export your adjusted subtitles using the download button in the top-right corner

## Technologies

- [Next.js](https://nextjs.org) - React framework
- [Zustand](https://zustand-demo.pmnd.rs) - State management
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Shadcn](https://ui.shadcn.com) - UI components
- [Lucide](https://lucide.dev) - Icons

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Author

Diego Nelson - [GitHub](https://github.com/nelsondiego)
