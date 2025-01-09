class AudioAnalyzer {
    constructor(audioContext) {
        this.analyser = audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.frequencyData = new Uint8Array(this.bufferLength);
        this.timeDomainData = new Uint8Array(this.bufferLength);
    }

    getFrequencyData() {
        this.analyser.getByteFrequencyData(this.frequencyData);
        return this.frequencyData;
    }

    getTimeDomainData() {
        this.analyser.getByteTimeDomainData(this.timeDomainData);
        return this.timeDomainData;
    }

    connect(source) {
        source.connect(this.analyser);
    }
}

export default AudioAnalyzer;