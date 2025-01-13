# Music Visualizer
A little something I made. I will try to make a update sometime
This is an interactive music visualizer that creates dynamic visual representations of audio in real-time.

## Features

- 🎨 Three visualization styles:
  - Normal (vertical bars)
  - Double-sided (mirror effect)
  - Circular (radial visualization)
- 🎵 Multiple audio input methods:
  - Local file upload
  - Direct URL import
  - YouTube audio extraction ( currently not working, I will try in next update )
- 🎭 Two color themes:
  - Purple/Pink
  - Neon Green
- ✨ Visual effects:
  - Gradient colors
  - Glow effects
  - Ripple animations
  - Responsive design

## Installation

### ( Recommended )
1. Download repository as zip
2. Exctract files
3. navigate to src/index.html
4. Open in web browser 
5. Chech out how it displays music !



# Or
1. Clone the repository:
   ```bash
   git clone https://github.com/AndreansxTech/music-visualizer/tree/main
   ```
2. Navigate to the project directory:
   ```bash
   cd music-visualizer
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server (required for YouTube functionality):
   ```bash
   npm run server
   ```
5. In a new terminal, start the application:
   ```bash
   npm start
   ```


## Usage Guide

### Playing Music
1. **Local Files**:
   - Click "Choose File"
   - Select an audio file from your computer
   - Click "Play" to start

2. **URL Import**:
   - Click "Import URL"
   - Paste a direct link to an audio file
   - Click "Import"
   - Click "Play" to start

<!---3. **YouTube Audio**:
   - Click "YouTube"
   - Paste a YouTube video URL
   - Click "Import"
   - Click "Play" to start --->

### Visualization Controls
- **Style Switch**: Click to cycle through visualization styles:
  - Normal: Single bars rising from bottom
  - Double-sided: Mirrored bars from center
  - Circular: Radial bars around a circle

- **Theme Switch**: Click to toggle between:
  - Purple/Pink theme
  - Neon Green theme

### Playback Controls
- Play/Pause: Toggle audio playback
- Progress Bar: Click anywhere to jump to that position
- Time Display: Shows current time and total duration

## Supported Formats
- Audio: MP3, WAV, OGG
- URLs: Direct links to audio files
- YouTube: Any valid YouTube video URL ( Not for now )

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting
- If YouTube extraction fails, ensure the server is running (`npm run server`) ( I will try to fix it in a update )
- Allow autoplay in your browser settings for the best experience
- Enable microphone access if using live input
- Check browser console for error messages

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License.
