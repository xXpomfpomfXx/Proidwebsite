// Background Animation Script
import { Renderer, Program, Mesh, Triangle } from "https://cdn.skypack.dev/ogl";

function hexToVec4(hex) {
    let hexStr = hex.replace("#", "");
    let r = 0, g = 0, b = 0, a = 1;
    if (hexStr.length === 6) {
        r = parseInt(hexStr.slice(0, 2), 16) / 255;
        g = parseInt(hexStr.slice(2, 4), 16) / 255;
        b = parseInt(hexStr.slice(4, 6), 16) / 255;
    } else if (hexStr.length === 8) {
        r = parseInt(hexStr.slice(0, 2), 16) / 255;
        g = parseInt(hexStr.slice(2, 4), 16) / 255;
        b = parseInt(hexStr.slice(4, 6), 16) / 255;
        a = parseInt(hexStr.slice(6, 8), 16) / 255;
    }
    return [r, g, b, a];
}

const vertexShader = `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float iTime;
  uniform vec3 iResolution;
  uniform float uSpinRotation;
  uniform float uSpinSpeed;
  uniform vec2 uOffset;
  uniform vec4 uColor1;
  uniform vec4 uColor2;
  uniform vec4 uColor3;
  uniform float uContrast;
  uniform float uLighting;
  uniform float uSpinAmount;
  uniform float uPixelFilter;
  uniform float uSpinEase;
  uniform bool uIsRotate;
  uniform vec2 uMouse;
  varying vec2 vUv;
  
  vec4 effect(vec2 screenSize, vec2 screen_coords) {
    vec2 uv = (floor(screen_coords.xy * (1.0 / (length(screenSize.xy)/uPixelFilter))) * (length(screenSize.xy)/uPixelFilter) - 0.5 * screenSize.xy) / length(screenSize.xy) - uOffset;
    float uv_len = length(uv);
    float speed = (uSpinRotation * uSpinEase * 0.2);
    if(uIsRotate) speed = iTime * speed;
    speed += 302.2;
    float mouseInfluence = (uMouse.x * 2.0 - 1.0);
    speed += mouseInfluence * 0.1;
    float new_pixel_angle = atan(uv.y, uv.x) + speed - uSpinEase * 20.0 * (uSpinAmount * uv_len + (1.0 - uSpinAmount));
    vec2 mid = (screenSize.xy / length(screenSize.xy)) / 2.0;
    uv = (vec2(uv_len * cos(new_pixel_angle) + mid.x, uv_len * sin(new_pixel_angle) + mid.y) - mid);
    uv *= 30.0;
    float baseSpeed = iTime * uSpinSpeed;
    speed = baseSpeed + mouseInfluence * 2.0;
    vec2 uv2 = vec2(uv.x + uv.y);
    for(int i = 0; i < 5; i++) {
      uv2 += sin(max(uv.x, uv.y)) + uv;
      uv += 0.5 * vec2(
        cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121),
        sin(uv2.x - 0.113 * speed)
      );
      uv -= cos(uv.x + uv.y) - sin(uv.x * 0.711 - uv.y);
    }
    float contrast_mod = (0.25 * uContrast + 0.5 * uSpinAmount + 1.2);
    float paint_res = min(2.0, max(0.0, length(uv) * 0.035 * contrast_mod));
    float c1p = max(0.0, 1.0 - contrast_mod * abs(1.0 - paint_res));
    float c2p = max(0.0, 1.0 - contrast_mod * abs(paint_res));
    float c3p = 1.0 - min(1.0, c1p + c2p);
    float light = (uLighting - 0.2) * max(c1p * 5.0 - 4.0, 0.0) + uLighting * max(c2p * 5.0 - 4.0, 0.0);
    return (0.3 / uContrast) * uColor1 + (1.0 - 0.3 / uContrast) * (uColor1 * c1p + uColor2 * c2p + vec4(c3p * uColor3.rgb, c3p * uColor1.a)) + light;
  }
  
  void main() {
    vec2 uv = vUv * iResolution.xy;
    gl_FragColor = effect(iResolution.xy, uv);
  }
`;

// Initialize background animation
function initBackground() {
    const canvas = document.getElementById("balatro-canvas");
    if (!canvas) return;

    const renderer = new Renderer({ canvas });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: {
            iTime: { value: 0 },
            iResolution: { value: [gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height] },
            uSpinRotation: { value: -2.0 },
            uSpinSpeed: { value: 7.0 },
            uOffset: { value: [0.0, 0.0] },
            uColor1: { value: hexToVec4("#3e8138") },
            uColor2: { value: hexToVec4("#7ac142") },
            uColor3: { value: hexToVec4("#a4e100") },
            uContrast: { value: 3.5 },
            uLighting: { value: 0.4 },
            uSpinAmount: { value: 0.25 },
            uPixelFilter: { value: 745.0 },
            uSpinEase: { value: 1.0 },
            uIsRotate: { value: false },
            uMouse: { value: [0.5, 0.5] },
        },
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        program.uniforms.iResolution.value = [gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height];
    }
    
    window.addEventListener("resize", resize);
    resize();

    // Mouse interaction
    let mouseX = 0.5, mouseY = 0.5;
    canvas.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
        program.uniforms.uMouse.value = [mouseX, mouseY];
    });

    function update(t) {
        program.uniforms.iTime.value = t * 0.001;
        renderer.render({ scene: mesh });
        requestAnimationFrame(update);
    }
    
    requestAnimationFrame(update);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackground);
} else {
    initBackground();
} 