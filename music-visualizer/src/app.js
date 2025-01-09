// src/app.js

import { Visualizer } from './visualizer.js';
import { AudioAnalyzer } from './audioAnalyzer.js';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const visualizer = new Visualizer(audioContext);
const audioAnalyzer = new AudioAnalyzer(audioContext);

function init() {
    // Setup audio input and connect to the visualizer
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const source = audioContext.createMediaStreamSource(stream);
            audioAnalyzer.setSource(source);
            visualizer.setAudioAnalyzer(audioAnalyzer);
            visualizer.start();
        })
        .catch(err => {
            console.error('Error accessing audio input:', err);
        });
}

function animate() {
    requestAnimationFrame(animate);
    visualizer.update();
    visualizer.draw();
}

init();
animate();