// audioHandler.js

let audioContext;
let analyser;
let source;
let audioElement;

function setupAudio() {
audioContext = new (window.AudioContext || window.webkitAudioContext)();
analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
return audioContext;
}

function connectAudio(sourceNode) {
source = sourceNode;
source.connect(analyser);
analyser.connect(audioContext.destination);
}

function handleFileInput(file) {
return new Promise((resolve, reject) => {
const reader = new FileReader();
reader.onload = async (event) => {
try {
if (!audioContext) {
setupAudio();
}

if (audioElement) {
audioElement.pause();
}

audioElement = new Audio();
audioElement.src = event.target.result;
source = audioContext.createMediaElementSource(audioElement);
connectAudio(source);
resolve(audioElement);
} catch (error) {
reject(error);
}
};
reader.onerror = reject;
reader.readAsDataURL(file);
});
}

function getAudioData() {
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
analyser.getByteFrequencyData(dataArray);
return dataArray;
}

export { setupAudio, connectAudio, getAudioData, handleFileInput };