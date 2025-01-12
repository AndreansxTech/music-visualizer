// audioHandler.js

let audioContext;
let analyser;
let source;

function setupAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
}

function connectAudio(sourceNode) {
    source = sourceNode;
    source.connect(analyser);
    analyser.connect(audioContext.destination);
}

function getAudioData() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    return dataArray;
}

export { setupAudio, connectAudio, getAudioData };