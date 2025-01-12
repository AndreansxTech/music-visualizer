// app.js

import { Visualizer } from './visualizer.js';
import { setupAudio } from './audioHandler.js';

const visualizer = new Visualizer();
const audioContext = setupAudio();

document.getElementById('startButton').addEventListener('click', () => {
    visualizer.start(audioContext);
});

function animate() {
    visualizer.draw();
    requestAnimationFrame(animate);
}

animate();