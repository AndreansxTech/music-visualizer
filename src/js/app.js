// app.js
import { Visualizer } from './visualizer.js';
import { setupAudio, handleFileInput } from './audioHandler.js';

const canvas = document.getElementById('visualizer');
const visualizer = new Visualizer(setupAudio(), canvas);
let audioElement;
let isPlaying = false;

document.getElementById('audioFile').addEventListener('change', async (e) => {
    if (e.target.files[0]) {
    try {
    audioElement = await handleFileInput(e.target.files[0]);
    visualizer.start();
    } catch (error) {
    console.error('Error loading audio file:', error);
    }  
}
});

document.getElementById('startButton').addEventListener('click', () => {
if (!audioElement) return;

if (isPlaying) {
audioElement.pause();
} else {
audioElement.play();
}
isPlaying = !isPlaying;
});

function animate() {
visualizer.draw();
requestAnimationFrame(animate);
}

animate();