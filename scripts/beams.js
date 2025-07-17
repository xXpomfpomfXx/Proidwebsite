class Beams {
    constructor(container, options = {}) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Default options
        this.options = {
            beamWidth: options.beamWidth || 2,
            beamHeight: options.beamHeight || 15,
            beamNumber: options.beamNumber || 12,
            lightColor: options.lightColor || "#ffffff",
            speed: options.speed || 2,
            noiseIntensity: options.noiseIntensity || 1.75,
            scale: options.scale || 0.2,
            rotation: options.rotation || 0
        };
        
        this.beams = [];
        this.time = 0;
        
        this.init();
    }
    
    init() {
        // Set up canvas
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        
        this.container.appendChild(this.canvas);
        this.resize();
        
        // Create beams
        this.createBeams();
        
        // Start animation
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    createBeams() {
        this.beams = [];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        for (let i = 0; i < this.options.beamNumber; i++) {
            const angle = (i / this.options.beamNumber) * Math.PI * 2 + this.options.rotation;
            const radius = Math.min(this.canvas.width, this.canvas.height) * 0.3;
            
            this.beams.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                angle: angle,
                radius: radius,
                opacity: 0.3 + Math.random() * 0.4,
                speed: 0.5 + Math.random() * this.options.speed
            });
        }
    }
    
    animate() {
        this.time += 0.016; // 60fps
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw beams
        this.beams.forEach((beam, index) => {
            const noise = Math.sin(this.time * beam.speed + index) * this.options.noiseIntensity;
            const currentAngle = beam.angle + noise * 0.1;
            
            const x1 = beam.x;
            const y1 = beam.y;
            const x2 = beam.x + Math.cos(currentAngle) * beam.radius * this.options.scale;
            const y2 = beam.y + Math.sin(currentAngle) * beam.radius * this.options.scale;
            
            // Create gradient
            const gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, `${this.options.lightColor}${Math.floor(beam.opacity * 255).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(1, 'transparent');
            
            // Draw beam
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = this.options.beamWidth;
            this.ctx.lineCap = 'round';
            
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
            
            // Draw light point at origin
            this.ctx.fillStyle = this.options.lightColor;
            this.ctx.globalAlpha = beam.opacity * 0.8;
            this.ctx.beginPath();
            this.ctx.arc(x1, y1, this.options.beamHeight / 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        // Clean up if needed
        this.container.removeChild(this.canvas);
    }
}

// Initialize Beams when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const beamsContainer = document.querySelector('.beams-container');
    if (beamsContainer) {
        new Beams(beamsContainer, {
            beamWidth: 2,
            beamHeight: 15,
            beamNumber: 12,
            lightColor: "#ffffff",
            speed: 2,
            noiseIntensity: 1.75,
            scale: 0.2,
            rotation: 0
        });
    }
}); 