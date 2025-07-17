// Minecraft-Themed Animated Cubes Background for Hero Section
(function() {
  // Check if Three.js is loaded
  if (!window.THREE) {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.min.js';
    script.onload = initMinecraftBG;
    document.head.appendChild(script);
  } else {
    initMinecraftBG();
  }

  function initMinecraftBG() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Create and style canvas
    let canvas = document.getElementById('beams-bg');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'beams-bg';
      canvas.style.position = 'absolute';
      canvas.style.top = 0;
      canvas.style.left = 0;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.zIndex = 0;
      canvas.style.pointerEvents = 'none';
      hero.prepend(canvas);
      hero.style.position = 'relative';
    }

    // Three.js setup
    let renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, hero.offsetWidth / hero.offsetHeight, 0.1, 100);
    camera.position.set(0, 0, 24);

    // Lighting
    let ambient = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambient);
    let dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(0, 10, 20);
    scene.add(dirLight);

    // Minecraft block colors
    const blockColors = [
      0x3e8138, // grass green
      0x7ac142, // lighter green
      0xa4e100, // yellow-green
      0x8b5a2b, // dirt brown
      0x6b4f1d, // darker brown
      0xcccccc, // stone gray
      0x8d8d8d, // darker stone
      0xdeb887, // wood
    ];

    // Create floating cubes
    const nCubes = 18;
    const cubes = [];
    for (let i = 0; i < nCubes; i++) {
      let size = 1.2 + Math.random() * 0.7;
      let geometry = new THREE.BoxGeometry(size, size, size);
      let color = blockColors[Math.floor(Math.random() * blockColors.length)];
      let mat = new THREE.MeshLambertMaterial({ color, flatShading: true });
      let mesh = new THREE.Mesh(geometry, mat);
      // Spread cubes in a 3D grid, but randomize a bit
      mesh.position.x = (Math.random() - 0.5) * 18;
      mesh.position.y = (Math.random() - 0.5) * 10;
      mesh.position.z = (Math.random() - 0.5) * 8;
      mesh.userData.floatPhase = Math.random() * Math.PI * 2;
      mesh.userData.floatSpeed = 0.5 + Math.random();
      mesh.userData.baseY = mesh.position.y;
      mesh.userData.rotSpeed = 0.2 + Math.random() * 0.4;
      scene.add(mesh);
      cubes.push(mesh);
    }

    // Animate
    function animate(t) {
      let time = t * 0.001;
      cubes.forEach((cube, i) => {
        // Floating animation
        cube.position.y = cube.userData.baseY + Math.sin(time * cube.userData.floatSpeed + cube.userData.floatPhase) * 0.7;
        // Gentle rotation
        cube.rotation.y += 0.005 * cube.userData.rotSpeed;
        cube.rotation.x += 0.003 * cube.userData.rotSpeed;
      });
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    // Responsive resize
    function resize() {
      let w = hero.offsetWidth;
      let h = hero.offsetHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    animate();
  }
})(); 