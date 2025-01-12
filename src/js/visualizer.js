class Visualizer {
    constructor(audioContext, canvas) {
        this.audioContext = audioContext;
        this.canvas = canvas;
        this.canvasContext = canvas.getContext('2d');
        this.analyser = this.audioContext.createAnalyser();
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    }

    connectSource(source) {
        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }

    draw() {
        requestAnimationFrame(() => this.draw());
        this.analyser.getByteFrequencyData(this.dataArray);
        this.canvasContext.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const barWidth = (this.canvas.width / this.dataArray.length) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < this.dataArray.length; i++) {
            barHeight = this.dataArray[i];
            this.canvasContext.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
            this.canvasContext.fillRect(x, this.canvas.height - barHeight / 2, barWidth, barHeight / 2);
            x += barWidth + 1;
        }
    }
}

export default Visualizer;