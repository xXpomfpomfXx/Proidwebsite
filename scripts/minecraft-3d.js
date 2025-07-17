// Interactive 3D Minecraft Preview System
class Minecraft3DPreview {
    constructor() {
        this.canvas = null;
        this.gl = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.blocks = [];
        this.selectedBlock = null;
        this.isDragging = false;
        this.mousePosition = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.createCanvas();
        this.initWebGL();
        this.createScene();
        this.createBlocks();
        this.initEventListeners();
        this.animate();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'minecraft-3d-canvas';
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.canvas.style.border = '2px solid #3e8138';
        this.canvas.style.borderRadius = '12px';
        this.canvas.style.cursor = 'crosshair';
    }

    initWebGL() {
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        
        if (!this.gl) {
            console.error('WebGL not supported');
            return;
        }

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.clearColor(0.5, 0.8, 1.0, 1.0);
    }

    createScene() {
        // Simple 3D scene setup
        this.camera = {
            position: { x: 0, y: 5, z: 10 },
            rotation: { x: -0.3, y: 0, z: 0 }
        };

        this.renderer = {
            viewport: { x: 0, y: 0, width: this.canvas.width, height: this.canvas.height },
            projection: this.createProjectionMatrix()
        };
    }

    createProjectionMatrix() {
        const fov = 45 * Math.PI / 180;
        const aspect = this.canvas.width / this.canvas.height;
        const near = 0.1;
        const far = 100.0;
        
        return [
            1 / (aspect * Math.tan(fov / 2)), 0, 0, 0,
            0, 1 / Math.tan(fov / 2), 0, 0,
            0, 0, -(far + near) / (far - near), -1,
            0, 0, -(2 * far * near) / (far - near), 0
        ];
    }

    createBlocks() {
        // Create a simple city layout
        this.blocks = [
            // Ground blocks
            { type: 'grass', position: { x: 0, y: 0, z: 0 }, size: { x: 10, y: 1, z: 10 } },
            { type: 'grass', position: { x: 0, y: 0, z: 10 }, size: { x: 10, y: 1, z: 10 } },
            { type: 'grass', position: { x: 10, y: 0, z: 0 }, size: { x: 10, y: 1, z: 10 } },
            { type: 'grass', position: { x: 10, y: 0, z: 10 }, size: { x: 10, y: 1, z: 10 } },
            
            // Buildings
            { type: 'stone', position: { x: 2, y: 1, z: 2 }, size: { x: 3, y: 4, z: 3 } },
            { type: 'stone', position: { x: 8, y: 1, z: 2 }, size: { x: 3, y: 3, z: 3 } },
            { type: 'stone', position: { x: 2, y: 1, z: 8 }, size: { x: 3, y: 5, z: 3 } },
            { type: 'stone', position: { x: 8, y: 1, z: 8 }, size: { x: 3, y: 2, z: 3 } },
            
            // Roads
            { type: 'gray', position: { x: 5, y: 0.1, z: 0 }, size: { x: 2, y: 0.2, z: 20 } },
            { type: 'gray', position: { x: 0, y: 0.1, z: 5 }, size: { x: 20, y: 0.2, z: 2 } },
            
            // Trees
            { type: 'green', position: { x: 1, y: 1, z: 15 }, size: { x: 1, y: 3, z: 1 } },
            { type: 'green', position: { x: 15, y: 1, z: 1 }, size: { x: 1, y: 3, z: 1 } },
            { type: 'green', position: { x: 15, y: 1, z: 15 }, size: { x: 1, y: 3, z: 1 } },
            
            // Water
            { type: 'blue', position: { x: 18, y: 0, z: 18 }, size: { x: 4, y: 0.5, z: 4 } }
        ];
    }

    initEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('wheel', (e) => this.onMouseWheel(e));
    }

    onMouseDown(e) {
        this.isDragging = true;
        this.mousePosition = { x: e.clientX, y: e.clientY };
    }

    onMouseMove(e) {
        if (this.isDragging) {
            const deltaX = e.clientX - this.mousePosition.x;
            const deltaY = e.clientY - this.mousePosition.y;
            
            this.camera.rotation.y += deltaX * 0.01;
            this.camera.rotation.x += deltaY * 0.01;
            
            this.mousePosition = { x: e.clientX, y: e.clientY };
        }
    }

    onMouseUp(e) {
        this.isDragging = false;
    }

    onMouseWheel(e) {
        const zoom = e.deltaY > 0 ? 1.1 : 0.9;
        this.camera.position.z *= zoom;
    }

    render() {
        if (!this.gl) return;

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
        // Simple rendering - in a real implementation, you'd use proper WebGL shaders
        this.drawBlocks();
    }

    drawBlocks() {
        // Simplified rendering - in a real implementation, this would use proper 3D rendering
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F6FF');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Sort blocks by distance for proper depth rendering
        const sortedBlocks = [...this.blocks].sort((a, b) => {
            const distA = Math.sqrt(a.position.x**2 + a.position.z**2);
            const distB = Math.sqrt(b.position.x**2 + b.position.z**2);
            return distB - distA;
        });
        
        sortedBlocks.forEach(block => {
            this.drawBlock(ctx, block);
        });
    }

    drawBlock(ctx, block) {
        const colors = {
            'grass': '#7AC142',
            'stone': '#8B8B8B',
            'gray': '#696969',
            'green': '#228B22',
            'blue': '#4169E1'
        };
        
        const color = colors[block.type] || '#CCCCCC';
        
        // Simple 3D projection
        const scale = 20;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Apply camera rotation
        const cosY = Math.cos(this.camera.rotation.y);
        const sinY = Math.sin(this.camera.rotation.y);
        const cosX = Math.cos(this.camera.rotation.x);
        const sinX = Math.sin(this.camera.rotation.x);
        
        // Transform block position
        let x = block.position.x * cosY - block.position.z * sinY;
        let z = block.position.x * sinY + block.position.z * cosY;
        let y = block.position.y * cosX - z * sinX;
        z = block.position.y * sinX + z * cosX;
        
        // Apply camera position
        x -= this.camera.position.x;
        y -= this.camera.position.y;
        z -= this.camera.position.z;
        
        // Perspective projection
        if (z > 0) {
            const perspective = 200 / (z + 10);
            const screenX = centerX + x * perspective * scale;
            const screenY = centerY - y * perspective * scale;
            const blockSize = scale * perspective;
            
            // Draw block
            ctx.fillStyle = color;
            ctx.fillRect(screenX - blockSize/2, screenY - blockSize/2, blockSize, blockSize);
            
            // Draw block border
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.strokeRect(screenX - blockSize/2, screenY - blockSize/2, blockSize, blockSize);
        }
    }

    animate() {
        this.render();
        requestAnimationFrame(() => this.animate());
    }

    addBlock(type, position) {
        const newBlock = {
            type: type,
            position: { ...position },
            size: { x: 1, y: 1, z: 1 }
        };
        
        this.blocks.push(newBlock);
        
        // Update progress tracker if available
        if (window.progressTracker) {
            window.progressTracker.updateProgress('minecraft_build');
        }
    }

    removeBlock(position) {
        const index = this.blocks.findIndex(block => 
            block.position.x === position.x &&
            block.position.y === position.y &&
            block.position.z === position.z
        );
        
        if (index !== -1) {
            this.blocks.splice(index, 1);
        }
    }

    getCanvas() {
        return this.canvas;
    }
}

// Minecraft Building Interface
class MinecraftBuilder {
    constructor() {
        this.preview = null;
        this.blockTypes = ['grass', 'stone', 'wood', 'glass', 'water'];
        this.selectedBlockType = 'stone';
        this.init();
    }

    init() {
        this.preview = new Minecraft3DPreview();
        this.createBuilderInterface();
    }

    createBuilderInterface() {
        const builderHTML = `
            <div class="minecraft-builder" id="minecraft-builder">
                <div class="builder-header">
                    <h3>🏗️ Minecraft City Builder</h3>
                    <p>Design your sustainable Singapore city!</p>
                </div>
                <div class="builder-content">
                    <div class="builder-controls">
                        <div class="block-selector">
                            <h4>Block Types</h4>
                            <div class="block-options">
                                ${this.blockTypes.map(type => `
                                    <button class="block-option ${type === this.selectedBlockType ? 'selected' : ''}" 
                                            data-block="${type}">
                                        <span class="block-icon">${this.getBlockIcon(type)}</span>
                                        <span class="block-name">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                        <div class="builder-actions">
                            <button class="action-btn" id="add-block-btn">➕ Add Block</button>
                            <button class="action-btn" id="remove-block-btn">➖ Remove Block</button>
                            <button class="action-btn" id="save-build-btn">💾 Save Build</button>
                            <button class="action-btn" id="share-build-btn">📤 Share</button>
                        </div>
                        <div class="build-stats">
                            <h4>Build Statistics</h4>
                            <div class="stat-item">
                                <span class="stat-label">Blocks Placed:</span>
                                <span class="stat-value" id="blocks-placed">0</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Build Score:</span>
                                <span class="stat-value" id="build-score">0</span>
                            </div>
                        </div>
                    </div>
                    <div class="builder-canvas">
                        <div id="minecraft-canvas-container"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', builderHTML);
        
        // Add canvas to container
        const container = document.getElementById('minecraft-canvas-container');
        if (container && this.preview) {
            container.appendChild(this.preview.getCanvas());
        }
        
        this.initBuilderEventListeners();
    }

    getBlockIcon(type) {
        const icons = {
            'grass': '🌱',
            'stone': '🪨',
            'wood': '🪵',
            'glass': '🪟',
            'water': '💧'
        };
        return icons[type] || '⬜';
    }

    initBuilderEventListeners() {
        // Block type selection
        document.querySelectorAll('.block-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.block-option').forEach(b => b.classList.remove('selected'));
                e.target.closest('.block-option').classList.add('selected');
                this.selectedBlockType = e.target.closest('.block-option').dataset.block;
            });
        });

        // Builder actions
        document.getElementById('add-block-btn').addEventListener('click', () => {
            this.addBlock();
        });

        document.getElementById('remove-block-btn').addEventListener('click', () => {
            this.removeBlock();
        });

        document.getElementById('save-build-btn').addEventListener('click', () => {
            this.saveBuild();
        });

        document.getElementById('share-build-btn').addEventListener('click', () => {
            this.shareBuild();
        });
    }

    addBlock() {
        if (this.preview) {
            const position = {
                x: Math.floor(Math.random() * 20) - 10,
                y: 1,
                z: Math.floor(Math.random() * 20) - 10
            };
            
            this.preview.addBlock(this.selectedBlockType, position);
            this.updateBuildStats();
        }
    }

    removeBlock() {
        if (this.preview && this.preview.blocks.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.preview.blocks.length);
            const block = this.preview.blocks[randomIndex];
            this.preview.removeBlock(block.position);
            this.updateBuildStats();
        }
    }

    saveBuild() {
        const buildData = {
            blocks: this.preview.blocks,
            timestamp: Date.now(),
            name: `My Singapore City - ${new Date().toLocaleDateString()}`
        };
        
        localStorage.setItem('urbanQuestBuild', JSON.stringify(buildData));
        this.showNotification('Build saved successfully! 🎉', 'success');
    }

    shareBuild() {
        const buildData = {
            blocks: this.preview.blocks,
            timestamp: Date.now()
        };
        
        const shareText = `Check out my sustainable Singapore city design in Urban Quest! 🏗️🌱 #UrbanQuest #DMP2025 #Singapore`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Urban Quest Build',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback for browsers without Web Share API
            navigator.clipboard.writeText(shareText);
            this.showNotification('Build description copied to clipboard! 📋', 'success');
        }
    }

    updateBuildStats() {
        const blocksPlaced = this.preview.blocks.length;
        const buildScore = blocksPlaced * 10;
        
        document.getElementById('blocks-placed').textContent = blocksPlaced;
        document.getElementById('build-score').textContent = buildScore;
    }

    showNotification(message, type = 'info') {
        if (window.progressTracker) {
            window.progressTracker.showNotification(message, type);
        }
    }
}

// Initialize Minecraft builder when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.minecraftBuilder = new MinecraftBuilder();
}); 