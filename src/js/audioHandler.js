// audioHandler.js

let audioContext;
let audioElement;

function setupAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

function handleFileInput(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                if (audioElement) {
                    audioElement.pause();
                }

                audioElement = new Audio();
                audioElement.src = event.target.result;
                resolve(audioElement);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function handleUrlInput(url) {
    try {
        if (audioElement) {
            audioElement.pause();
        }

        audioElement = new Audio();
        audioElement.crossOrigin = "anonymous"; // Enable CORS
        audioElement.src = url;
        
        return new Promise((resolve, reject) => {
            audioElement.onloadeddata = () => resolve(audioElement);
            audioElement.onerror = () => reject(new Error('Failed to load audio from URL'));
        });
    } catch (error) {
        throw error;
    }
}

async function handleYoutubeInput(url) {
    try {
        const response = await fetch('http://localhost:3000/extract-audio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url })
        });

        if (!response.ok) {
            throw new Error('Failed to extract YouTube audio');
        }

        const data = await response.json();
        
        if (audioElement) {
            audioElement.pause();
        }

        audioElement = new Audio();
        audioElement.crossOrigin = "anonymous";
        audioElement.src = data.audioUrl;
        
        return new Promise((resolve, reject) => {
            audioElement.onloadeddata = () => resolve(audioElement);
            audioElement.onerror = () => reject(new Error('Failed to load YouTube audio'));
        });
    } catch (error) {
        throw error;
    }
}

export { setupAudio, handleFileInput, handleUrlInput, handleYoutubeInput };