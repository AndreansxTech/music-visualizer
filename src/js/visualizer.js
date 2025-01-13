class Visualizer {
   constructor(audioContext,canvas){
   this.audioContext=audioContext;
   this.canvas=canvas;
   this.canvasContext=canvas.getContext('2d');
   this.analyser=this.audioContext.createAnalyser();
   this.dataArray=newUint8Array(this.analyser.frequencyBinCount);
   }
   
   connectSource(source){
   source.connect(this.analyser);
   this.analyser.connect(this.audioContext.destination);
   }
   
   draw(){
   requestAnimationFrame(()=>this.draw());
   this.analyser.getByteFrequencyData(this.dataArray);
   
   //gradient back
   constgradient=this.canvasContext.createLinearGradient(0,0,0,this.canvas.height);
   gradient.addColorStop(0,'rgba(168,85,247,0.1)');
   gradient.addColorStop(1,'rgba(236,72,153,0.1)');
   
   this.canvasContext.fillStyle=gradient;
   this.canvasContext.fillRect(0,0,this.canvas.width,this.canvas.height);
   
   constbarWidth=(this.canvas.width/this.dataArray.length)*2.5;
   letbarHeight;
   letx=0;
   
      for(leti=0;i<this.dataArray.length;i++) {
   barHeight=this.dataArray[i]*1.5;
   
   //Create gradient for bars
   constbarGradient=this.canvasContext.createLinearGradient(x,this.canvas.height-barHeight,x,this.canvas.height);
   barGradient.addColorStop(0,'rgba(236,72,153,0.8)');
   barGradient.addColorStop(1,'rgba(168,85,247,0.8)');
   
   this.canvasContext.fillStyle=barGradient;
   this.canvasContext.fillRect(x,this.canvas.height-barHeight,barWidth,barHeight);
   
   //glow effect
   this.canvasContext.shadowBlur=15;
   this.canvasContext.shadowColor='rgba(236,72,153,0.5)';
   
   x+=barWidth+1;
   }
   }
   }
   
   export{Visualizer};