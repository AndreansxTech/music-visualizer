// app.js
import { Visualizer } from './visualizer.js';
import { setupAudio, handleFileInput, handleUrlInput, handleYoutubeInput } from './audioHandler.js';

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateProgress() {
    if (!audioElement) return;
    
    const progressBar = document.getElementById('progressBar');
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationDisplay = document.getElementById('duration');
    
    const progress = (audioElement.currentTime / audioElement.duration) * 100;
    progressBar.style.width = `${progress}%`;
    
    currentTimeDisplay.textContent = formatTime(audioElement.currentTime);
    durationDisplay.textContent = formatTime(audioElement.duration);
}

const canvas = document.getElementById('visualizer');
const audioContext = setupAudio();
const visualizer = new Visualizer(audioContext, canvas);
let audioElement;
let isPlaying = false;

let currentStyle = 'normal';
let currentTheme = 'purple';

document.getElementById('styleSwitch').addEventListener('click', () => {
    const styles = ['normal', 'double-sided', 'circular'];
    const currentIndex = styles.indexOf(currentStyle);
    currentStyle = styles[(currentIndex + 1) % styles.length];
    
    const button = document.getElementById('styleSwitch');
    const styleName = currentStyle.charAt(0).toUpperCase() + currentStyle.slice(1);
    button.innerHTML = `<span class="relative z-10">Style: ${styleName}</span>`;
    visualizer.setVisualizationStyle(currentStyle);
});

document.getElementById('themeSwitch').addEventListener('click', () => {
    currentTheme = currentTheme === 'purple' ? 'green' : 'purple';
    const body = document.getElementById('mainBody');
    const title = document.querySelector('h1');
    
    if (currentTheme === 'green') {
        // Update body classes
        body.classList.remove('from-purple-900');
        body.classList.add('from-green-900');
        body.classList.add('neon-theme');
        
        // Update title classes
        title.classList.remove('from-purple-300', 'to-pink-300', 'title-glow');
        title.classList.add('from-green-300', 'to-green-400', 'neon-green-glow');
    } else {
        // Update body classes
        body.classList.add('from-purple-900');
        body.classList.remove('from-green-900');
        body.classList.remove('neon-theme');
        
        // Update title classes
        title.classList.remove('from-green-300', 'to-green-400', 'neon-green-glow');
        title.classList.add('from-purple-300', 'to-pink-300', 'title-glow');
    }
    
    visualizer.setTheme(currentTheme);
});

document.getElementById('audioFile').addEventListener('change', async (e) => {
    if (e.target.files[0]) {
        try {
            // Resume audio context (required by Chrome's autoplay policy)
            await audioContext.resume();
            
            audioElement = await handleFileInput(e.target.files[0]);
            const source = audioContext.createMediaElementSource(audioElement);
            visualizer.connectSource(source);
            
            // Start visualization only after audio is loaded
            audioElement.addEventListener('canplay', () => {
                visualizer.start();
            });
            
            // Add time update listener
            audioElement.addEventListener('timeupdate', updateProgress);
            audioElement.addEventListener('loadedmetadata', updateProgress);
        } catch (error) {
            console.error('Error loading audio file:', error);
        }
    }
});

document.querySelector('.progress-container').addEventListener('click', (e) => {
    if (!audioElement) return;
    
    const progressContainer = e.currentTarget;
    const clickPosition = e.offsetX / progressContainer.offsetWidth;
    audioElement.currentTime = clickPosition * audioElement.duration;
});

document.getElementById('startButton').addEventListener('click', () => {
    if (!audioElement) return;
    
    const button = document.getElementById('startButton');
    
    if (isPlaying) {
        audioElement.pause();
        button.classList.remove('playing-glow');
        button.innerHTML = '<span class="relative z-10">Play</span>';
    } else {
        audioElement.play();
        button.classList.add('playing-glow');
        button.innerHTML = '<span class="relative z-10">Pause</span>';
    }
    isPlaying = !isPlaying;
});

// Add URL import modal functionality
document.getElementById('urlImportButton').addEventListener('click', () => {
    document.getElementById('urlModal').classList.add('active');
});

document.getElementById('cancelUrlImport').addEventListener('click', () => {
    document.getElementById('urlModal').classList.remove('active');
    document.getElementById('audioUrl').value = '';
});

document.getElementById('confirmUrlImport').addEventListener('click', async () => {
    const url = document.getElementById('audioUrl').value.trim();
    if (!url) return;

    try {
        await audioContext.resume();
        audioElement = await handleUrlInput(url);
        const source = audioContext.createMediaElementSource(audioElement);
        visualizer.connectSource(source);
        
        audioElement.addEventListener('canplay', () => {
            visualizer.start();
        });
        
        audioElement.addEventListener('timeupdate', updateProgress);
        audioElement.addEventListener('loadedmetadata', updateProgress);
        
        document.getElementById('urlModal').classList.remove('active');
        document.getElementById('audioUrl').value = '';
    } catch (error) {
        console.error('Error loading audio from URL:', error);
        alert('Failed to load audio from URL. Please check the URL and try again.');
    }
});

// Add YouTube import modal functionality
document.getElementById('youtubeImportButton').addEventListener('click', () => {
    document.getElementById('youtubeModal').classList.add('active');
});

document.getElementById('cancelYoutubeImport').addEventListener('click', () => {
    document.getElementById('youtubeModal').classList.remove('active');
    document.getElementById('youtubeUrl').value = '';
});

document.getElementById('confirmYoutubeImport').addEventListener('click', async () => {
    const url = document.getElementById('youtubeUrl').value.trim();
    if (!url) return;

    try {
        await audioContext.resume();
        audioElement = await handleYoutubeInput(url);
        const source = audioContext.createMediaElementSource(audioElement);
        visualizer.connectSource(source);
        
        audioElement.addEventListener('canplay', () => {
            visualizer.start();
        });
        
        audioElement.addEventListener('timeupdate', updateProgress);
        audioElement.addEventListener('loadedmetadata', updateProgress);
        
        document.getElementById('youtubeModal').classList.remove('active');
        document.getElementById('youtubeUrl').value = '';
    } catch (error) {
        console.error('Error loading YouTube audio:', error);
        alert('Failed to load YouTube audio. Please check the URL and try again.');
    }
});

// Remove the separate animate function since it's now handled in the Visualizer class