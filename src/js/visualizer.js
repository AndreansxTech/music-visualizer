class Visualizer {
   constructor(audioContext, canvas) {
       this.audioContext = audioContext;
       this.canvas = canvas;
       this.canvasContext = canvas.getContext('2d');
       this.analyser = this.audioContext.createAnalyser();
       // Reduce FFT size for fewer bars
       this.analyser.fftSize = 512; // Changed from 2048
       this.analyser.smoothingTimeConstant = 0.8; // Add this line
       this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
       
       // Set canvas size
       this.resizeCanvas();
       window.addEventListener('resize', () => this.resizeCanvas());
       this.visualizationStyle = 'normal'; // Add this line
       this.currentTheme = 'purple'; // Add this line
   }

   resizeCanvas() {
       this.canvas.width = window.innerWidth;
       this.canvas.height = window.innerHeight;
   }

   start() {
       this.isActive = true;
       this.draw();
   }

   stop() {
       this.isActive = false;
   }

   connectSource(source) {
       try {
           // Disconnect previous source if it exists
           if (this.source) {
               this.source.disconnect();
           }
           
           this.source = source;
           this.source.connect(this.analyser);
           this.analyser.connect(this.audioContext.destination);
       } catch (error) {
           console.error('Error connecting audio source:', error);
       }
   }

   setVisualizationStyle(style) {
       this.visualizationStyle = style;
   }

   setTheme(theme) {
       this.currentTheme = theme;
   }

   getThemeColors() {
       return this.currentTheme === 'purple' 
           ? {
               primary: 'rgba(236, 72, 153, 0.9)',
               secondary: 'rgba(168, 85, 247, 0.9)',
               glow: 'rgba(236, 72, 153, 0.5)',
               background1: 'rgba(168, 85, 247, 0.1)',
               background2: 'rgba(236, 72, 153, 0.1)'
           }
           : {
               primary: 'rgba(74, 222, 128, 0.9)',
               secondary: 'rgba(34, 197, 94, 0.9)',
               glow: 'rgba(74, 222, 128, 0.5)',
               background1: 'rgba(74, 222, 128, 0.1)',
               background2: 'rgba(34, 197, 94, 0.1)'
           };
   }

   drawRoundedBar(x, y, width, height) {
       const radius = width / 2;
       
       // Draw the main rectangle with rounded corners
       this.canvasContext.beginPath();
       this.canvasContext.moveTo(x + radius, y);
       this.canvasContext.lineTo(x + width - radius, y);
       this.canvasContext.quadraticCurveTo(x + width, y, x + width, y + radius);
       this.canvasContext.lineTo(x + width, y + height - radius);
       this.canvasContext.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
       this.canvasContext.lineTo(x + radius, y + height);
       this.canvasContext.quadraticCurveTo(x, y + height, x, y + height - radius);
       this.canvasContext.lineTo(x, y + radius);
       this.canvasContext.quadraticCurveTo(x, y, x + radius, y);
       this.canvasContext.closePath();
       this.canvasContext.fill();
       
       // Add circle at the top for extra roundness
       this.canvasContext.beginPath();
       this.canvasContext.arc(x + width / 2, y, width / 2, 0, Math.PI * 2);
       this.canvasContext.fill();
   }

   drawDoubleSidedBar(x, y, width, height) {
       const centerY = this.canvas.height / 2;
       const halfHeight = height / 2;
       
       // Top bar
       this.drawRoundedBar(x, centerY - halfHeight, width, halfHeight);
       
       // Bottom bar (inverted)
       this.drawRoundedBar(x, centerY, width, halfHeight);
   }

   drawCircularBar(centerX, centerY, radius, angle, length, width, inward = false) {
       const startX = centerX + Math.cos(angle) * radius;
       const startY = centerY + Math.sin(angle) * radius;
       const endX = centerX + Math.cos(angle) * (radius + (inward ? -length : length));
       const endY = centerY + Math.sin(angle) * (radius + (inward ? -length : length));
       
       // Create gradient for the bar
       const gradient = this.canvasContext.createLinearGradient(startX, startY, endX, endY);
       const colors = this.getThemeColors();
       gradient.addColorStop(inward ? 1 : 0, colors.primary);
       gradient.addColorStop(inward ? 0 : 1, colors.secondary);
       
       this.canvasContext.strokeStyle = gradient;
       this.canvasContext.lineWidth = width;
       this.canvasContext.lineCap = 'round';
       
       this.canvasContext.beginPath();
       this.canvasContext.moveTo(startX, startY);
       this.canvasContext.lineTo(endX, endY);
       this.canvasContext.stroke();
   }

   draw() {
       if (!this.isActive) return;
       
       requestAnimationFrame(() => this.draw());
       this.analyser.getByteFrequencyData(this.dataArray);
       
       // Clear previous frame
       this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
       
       // Add gradient background
       const colors = this.getThemeColors();
       const gradient = this.canvasContext.createLinearGradient(0, 0, 0, this.canvas.height);
       gradient.addColorStop(0, colors.background1);
       gradient.addColorStop(0.5, colors.background2);
       gradient.addColorStop(1, colors.background1);
       
       this.canvasContext.fillStyle = gradient;
       this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
       
       if (this.visualizationStyle === 'circular') {
           const centerX = this.canvas.width / 2;
           const centerY = this.canvas.height / 2;
           const radius = Math.min(this.canvas.width, this.canvas.height) * 0.2;
           const maxBarLength = Math.min(this.canvas.width, this.canvas.height) * 0.15;
           const barWidth = 4;

           // Add glow effect
           this.canvasContext.shadowBlur = 15;
           this.canvasContext.shadowColor = colors.glow;

           for (let i = 0; i < this.dataArray.length; i += 2) {
               const angle = (i * Math.PI * 2) / this.dataArray.length;
               const value = this.dataArray[i];
               const barLength = (value / 255) * maxBarLength;

               // Draw outer bar (extending outward)
               this.drawCircularBar(
                   centerX,
                   centerY,
                   radius,
                   angle,
                   barLength,
                   barWidth,
                   false // outward
               );

               // Draw outer bar (extending outward) on opposite side
               this.drawCircularBar(
                   centerX,
                   centerY,
                   radius,
                   angle + Math.PI,
                   barLength,
                   barWidth,
                   false // outward
               );
           }
       } else if (this.visualizationStyle === 'normal') {
           // Calculate visualization area (centered, 70% of screen width)
           const visualizationWidth = this.canvas.width * 0.7;
           // Increase bar width and spacing
           const barWidth = (visualizationWidth / (this.dataArray.length / 2)) * 0.8; // Show only half the bars
           const spacing = barWidth * 0.4; // Add more spacing between bars
           const startX = (this.canvas.width - (barWidth + spacing) * (this.dataArray.length / 2)) / 2;
           let x = startX;

           // Center vertically and adjust height
           const visualizationHeight = this.canvas.height * 0.5;
           const startY = this.canvas.height * 0.3;

           // Add shadow effect before the loop
           this.canvasContext.shadowBlur = 15;
           this.canvasContext.shadowColor = colors.glow;

           // Draw only every second bar for a less crowded look
           for (let i = 0; i < this.dataArray.length; i += 2) {
               const value = this.dataArray[i];
               let barHeight;
               
               if (this.visualizationStyle === 'normal') {
                   barHeight = (value * this.canvas.height * 0.5) / 255 * 1.5;
                   const startY = this.canvas.height * 0.3;
                   
                   const barGradient = this.canvasContext.createLinearGradient(
                       x, startY + this.canvas.height * 0.5 - barHeight,
                       x, startY + this.canvas.height * 0.5
                   );
                   barGradient.addColorStop(0, colors.primary);
                   barGradient.addColorStop(1, colors.secondary);
                   
                   this.canvasContext.fillStyle = barGradient;
                   this.drawRoundedBar(
                       x,
                       startY + this.canvas.height * 0.5 - barHeight,
                       barWidth,
                       barHeight
                   );
               } else {
                   barHeight = (value * this.canvas.height * 0.25) / 255 * 1.5;
                   const barGradient = this.canvasContext.createLinearGradient(
                       x, 0, x, this.canvas.height
                   );
                   barGradient.addColorStop(0, colors.primary);
                   barGradient.addColorStop(0.5, colors.secondary);
                   barGradient.addColorStop(1, colors.primary);
                   
                   this.canvasContext.fillStyle = barGradient;
                   this.drawDoubleSidedBar(x, 0, barWidth, barHeight * 2);
               }
               
               x += barWidth + spacing;
           }
       } else {
           // Calculate visualization area (centered, 70% of screen width)
           const visualizationWidth = this.canvas.width * 0.7;
           // Increase bar width and spacing
           const barWidth = (visualizationWidth / (this.dataArray.length / 2)) * 0.8; // Show only half the bars
           const spacing = barWidth * 0.4; // Add more spacing between bars
           const startX = (this.canvas.width - (barWidth + spacing) * (this.dataArray.length / 2)) / 2;
           let x = startX;

           // Center vertically and adjust height
           const visualizationHeight = this.canvas.height * 0.5;
           const startY = this.canvas.height * 0.3;

           // Add shadow effect before the loop
           this.canvasContext.shadowBlur = 15;
           this.canvasContext.shadowColor = colors.glow;

           // Draw only every second bar for a less crowded look
           for (let i = 0; i < this.dataArray.length; i += 2) {
               const value = this.dataArray[i];
               let barHeight;
               
               if (this.visualizationStyle === 'normal') {
                   barHeight = (value * this.canvas.height * 0.5) / 255 * 1.5;
                   const startY = this.canvas.height * 0.3;
                   
                   const barGradient = this.canvasContext.createLinearGradient(
                       x, startY + this.canvas.height * 0.5 - barHeight,
                       x, startY + this.canvas.height * 0.5
                   );
                   barGradient.addColorStop(0, colors.primary);
                   barGradient.addColorStop(1, colors.secondary);
                   
                   this.canvasContext.fillStyle = barGradient;
                   this.drawRoundedBar(
                       x,
                       startY + this.canvas.height * 0.5 - barHeight,
                       barWidth,
                       barHeight
                   );
               } else {
                   barHeight = (value * this.canvas.height * 0.25) / 255 * 1.5;
                   const barGradient = this.canvasContext.createLinearGradient(
                       x, 0, x, this.canvas.height
                   );
                   barGradient.addColorStop(0, colors.primary);
                   barGradient.addColorStop(0.5, colors.secondary);
                   barGradient.addColorStop(1, colors.primary);
                   
                   this.canvasContext.fillStyle = barGradient;
                   this.drawDoubleSidedBar(x, 0, barWidth, barHeight * 2);
               }
               
               x += barWidth + spacing;
           }
       }
   }
}

export { Visualizer };