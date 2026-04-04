/**
 * Simple 3D Noise generator for the wavy background effect.
 * Uses a sum of sine waves to approximate 3D simplex noise behavior.
 */
function pseudoNoise3D(x, y, z) {
  return (
    Math.sin(x * 12.9898 + y * 78.233 + z) * 
    Math.cos(x * 4.898 + y * 12.233 - z) * 0.5 + 
    Math.sin(x * 3.123 - y * 4.23 + z * 0.8) * 0.5
  );
}

class WavyBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext("2d");
    this.nt = 0;
    
    // Theme colors from TruthLens matching var(--accent-...)
    this.colors = [
      "#47ff8f", // green
      "#ff4747", // red
      "#ff9147", // amber
      "#e8ff47", // yellow
      "#47c8ff"  // blue
    ];
    
    this.speed = 0.015;
    this.waveWidth = 40;
    this.backgroundFill = "#0a0a0a"; // var(--bg)
    this.waveOpacity = 0.3;
    
    this.resize = this.resize.bind(this);
    this.render = this.render.bind(this);
    
    window.addEventListener("resize", this.resize);
    this.resize();
    this.render();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    // The visual blur is applied via CSS, no need to do ctx.filter which is slow
  }
  
  drawWave(n) {
    this.nt += this.speed;
    for (let i = 0; i < 5; i++) {
        this.ctx.beginPath();
        this.ctx.lineWidth = this.waveWidth;
        this.ctx.strokeStyle = this.colors[i % this.colors.length];
        
        for (let x = 0; x < this.canvas.width; x += 5) {
            // Using our pseudoNoise3D to map to y coordinates
            // Scaling x by 800 (like Aceternity) to stretch the waves out
            let y = pseudoNoise3D(x / 800, 0.3 * i, this.nt) * 150;
            this.ctx.lineTo(x, y + this.canvas.height * 0.5);
        }
        
        this.ctx.stroke();
        this.ctx.closePath();
    }
  }

  render() {
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = this.backgroundFill;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.globalAlpha = this.waveOpacity;
    this.drawWave();
    
    requestAnimationFrame(this.render);
  }
}

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
    new WavyBackground("wavy-bg");
});
