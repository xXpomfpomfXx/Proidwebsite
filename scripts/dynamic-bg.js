import { Renderer, Program, Mesh, Color, Triangle } from "https://cdn.skypack.dev/ogl";

const colorStops = ["#3e8138", "#7ac142", "#a4e100"];

function hexToRGB(hex) {
  const c = new Color(hex);
  return [c.r, c.g, c.b];
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function startAuroraBG(container) {
  const renderer = new Renderer({ alpha: true });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  container.appendChild(gl.canvas);

  const geometry = new Triangle(gl);
  const program = new Program(gl, {
    vertex: `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `,
    fragment: `
      precision highp float;
      uniform float uTime;
      uniform vec3 uColorStops[3];
      uniform vec2 uResolution;
      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution;
        vec3 color = mix(
          mix(uColorStops[0], uColorStops[1], smoothstep(0.0, 0.5, uv.x)),
          uColorStops[2], smoothstep(0.5, 1.0, uv.x)
        );
        float y = uv.y + 0.1 * sin(uv.x * 10.0 + uTime * 0.2);
        float alpha = smoothstep(0.3, 0.7, y) * 0.7;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    uniforms: {
      uTime: { value: 0 },
      uColorStops: { value: colorStops.map(hexToRGB) },
      uResolution: { value: [window.innerWidth, window.innerHeight] }
    }
  });
  const mesh = new Mesh(gl, { geometry, program });

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
  }
  window.addEventListener("resize", resize);
  resize();

  function update(t) {
    program.uniforms.uTime.value = t * 0.001;
    renderer.render({ scene: mesh });
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function startSilkBG(container) {
  const renderer = new Renderer({ alpha: true });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  container.appendChild(gl.canvas);

  const geometry = new Triangle(gl);
  const program = new Program(gl, {
    vertex: `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `,
    fragment: `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec3 uColor;
      void main() {
        float wave = sin(vUv.x * 10.0 + uTime * 0.5) * 0.1 + cos(vUv.y * 10.0 - uTime * 0.3) * 0.1;
        float mask = smoothstep(0.0, 1.0, vUv.y + wave);
        vec3 color = uColor * (0.7 + 0.3 * mask);
        gl_FragColor = vec4(color, 0.7 + 0.3 * mask);
      }
    `,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: hexToRGB(randomChoice(colorStops)) }
    }
  });
  const mesh = new Mesh(gl, { geometry, program });

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", resize);
  resize();

  function update(t) {
    program.uniforms.uTime.value = t * 0.001;
    renderer.render({ scene: mesh });
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function startBeamsBG(container) {
  const renderer = new Renderer({ alpha: true });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  container.appendChild(gl.canvas);

  const geometry = new Triangle(gl);
  const program = new Program(gl, {
    vertex: `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `,
    fragment: `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      void main() {
        float beams = abs(sin((vUv.x + uTime * 0.1) * 10.0)) * 0.7 + 0.3;
        float mask = smoothstep(0.3, 0.7, vUv.y + 0.1 * sin(uTime + vUv.x * 5.0));
        vec3 color = mix(uColor1, uColor2, vUv.y) * beams * mask;
        gl_FragColor = vec4(color, 0.7 * mask);
      }
    `,
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: hexToRGB(randomChoice(colorStops)) },
      uColor2: { value: hexToRGB(randomChoice(colorStops)) }
    }
  });
  const mesh = new Mesh(gl, { geometry, program });

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", resize);
  resize();

  function update(t) {
    program.uniforms.uTime.value = t * 0.001;
    renderer.render({ scene: mesh });
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Main logic
const container = document.getElementById("dynamic-bg");
if (container) {
  container.style.position = "fixed";
  container.style.top = 0;
  container.style.left = 0;
  container.style.width = "100vw";
  container.style.height = "100vh";
  container.style.zIndex = "-1";
  container.style.pointerEvents = "none";

  const effects = [startAuroraBG, startSilkBG, startBeamsBG];
  randomChoice(effects)(container);
} 