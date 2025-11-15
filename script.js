// 🎮 THREE.js scene — fondo reactivo con microinteracciones
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.008);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 30);

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg'), alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

// 🎯 Objetos: toro + icosaedro + partículas
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(10, 3, 16, 100),
  new THREE.MeshStandardMaterial({
    color: 0xff0055,
    metalness: 0.5,
    roughness: 0.2,
    emissive: 0xff0055,
    emissiveIntensity: 0.3
  })
);
scene.add(torus);

const ico = new THREE.Mesh(
  new THREE.IcosahedronGeometry(4, 1),
  new THREE.MeshStandardMaterial({
    color: 0x66ccff,
    wireframe: true,
    transparent: true,
    opacity: 0.6,
    emissive: 0x66ccff,
    emissiveIntensity: 0.4
  })
);
ico.position.set(-12, -4, -6);
scene.add(ico);

// 🌟 Additional immersive objects
const dodecahedron = new THREE.Mesh(
  new THREE.DodecahedronGeometry(5, 0),
  new THREE.MeshStandardMaterial({
    color: 0x00ff88,
    wireframe: true,
    transparent: true,
    opacity: 0.5,
    emissive: 0x00ff88,
    emissiveIntensity: 0.5
  })
);
dodecahedron.position.set(15, 8, -10);
scene.add(dodecahedron);

const octahedron = new THREE.Mesh(
  new THREE.OctahedronGeometry(3.5, 0),
  new THREE.MeshStandardMaterial({
    color: 0xffaa00,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0xffaa00,
    emissiveIntensity: 0.4
  })
);
octahedron.position.set(8, -10, -8);
scene.add(octahedron);

const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(4, 1.2, 100, 16),
  new THREE.MeshStandardMaterial({
    color: 0xff00ff,
    metalness: 0.6,
    roughness: 0.3,
    emissive: 0xff00ff,
    emissiveIntensity: 0.3
  })
);
torusKnot.position.set(-15, 5, -12);
scene.add(torusKnot);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(6, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    wireframe: true,
    transparent: true,
    opacity: 0.4,
    emissive: 0x00ffff,
    emissiveIntensity: 0.6
  })
);
sphere.position.set(0, 12, -15);
scene.add(sphere);

// 🌌 Enhanced multi-layered particles
const starGeom = new THREE.BufferGeometry();
const starCount = 1200;
const positions = new Float32Array(starCount * 3);
const colors = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 200;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

  const color = new THREE.Color();
  color.setHSL(Math.random(), 0.8, 0.6);
  colors[i * 3] = color.r;
  colors[i * 3 + 1] = color.g;
  colors[i * 3 + 2] = color.b;
}
starGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
starGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
const stars = new THREE.Points(starGeom, new THREE.PointsMaterial({
  size: 0.8,
  vertexColors: true,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending
}));
scene.add(stars);

// ✨ Floating glowing particles
const glowGeom = new THREE.BufferGeometry();
const glowCount = 150;
const glowPositions = new Float32Array(glowCount * 3);
const glowColors = new Float32Array(glowCount * 3);
for (let i = 0; i < glowCount; i++) {
  glowPositions[i * 3] = (Math.random() - 0.5) * 100;
  glowPositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
  glowPositions[i * 3 + 2] = (Math.random() - 0.5) * 100;

  const hue = Math.random() * 360;
  const color = new THREE.Color(`hsl(${hue}, 100%, 50%)`);
  glowColors[i * 3] = color.r;
  glowColors[i * 3 + 1] = color.g;
  glowColors[i * 3 + 2] = color.b;
}
glowGeom.setAttribute('position', new THREE.BufferAttribute(glowPositions, 3));
glowGeom.setAttribute('color', new THREE.BufferAttribute(glowColors, 3));
const glowParticles = new THREE.Points(glowGeom, new THREE.PointsMaterial({
  size: 1.5,
  vertexColors: true,
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending
}));
scene.add(glowParticles);

// 🎯 Interactive objects array for click detection
const interactiveObjects = [torus, ico, dodecahedron, octahedron, torusKnot, sphere];

// 🌈 Enhanced dynamic lighting
const pointLight = new THREE.PointLight(0xff0055, 2, 200);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

const spotLight1 = new THREE.SpotLight(0x00ffff, 1.5);
spotLight1.position.set(-20, 20, 10);
spotLight1.angle = Math.PI / 6;
spotLight1.penumbra = 0.3;
scene.add(spotLight1);

const spotLight2 = new THREE.SpotLight(0xff00ff, 1.5);
spotLight2.position.set(20, -20, 10);
spotLight2.angle = Math.PI / 6;
spotLight2.penumbra = 0.3;
scene.add(spotLight2);

scene.add(new THREE.AmbientLight(0x404040, 0.6));

// 🎯 Raycaster for click interactions
const raycaster = new THREE.Raycaster();
const mousePos = new THREE.Vector2();

// 📜 Scroll: color/intensidad + profundidad
function onScroll() {
  const y = window.scrollY;
  const hue = (y * 0.2) % 360;
  const color = new THREE.Color(`hsl(${hue}, 100%, 50%)`);
  pointLight.color = color;
  pointLight.intensity = 1.2 + (y * 0.0015);
  camera.position.z = 30 - (y * 0.01);

  // micro movimiento
  torus.rotation.x += 0.002 * (1 + y * 0.0005);
  torus.rotation.y += 0.002;
}
document.addEventListener('scroll', onScroll);

// 🖱️ Parallax con mouse + spotlight following
const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;

  // Update mouse position for raycaster
  mousePos.x = mouse.x;
  mousePos.y = -mouse.y;
});

function parallax() {
  camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.05;
  camera.position.y += (-mouse.y * 1.5 - camera.position.y) * 0.05;
  camera.lookAt(0, 0, 0);

  // Spotlights follow mouse
  spotLight1.position.x += (mouse.x * 15 - spotLight1.position.x) * 0.08;
  spotLight1.position.y += (-mouse.y * 15 - spotLight1.position.y) * 0.08;
  spotLight2.position.x += (-mouse.x * 15 - spotLight2.position.x) * 0.08;
  spotLight2.position.y += (mouse.y * 15 - spotLight2.position.y) * 0.08;
}

// 🎯 Click interaction on 3D objects
window.addEventListener('click', (e) => {
  raycaster.setFromCamera(mousePos, camera);
  const intersects = raycaster.intersectObjects(interactiveObjects);

  if (intersects.length > 0) {
    const obj = intersects[0].object;

    // Pulse animation on click
    gsap.to(obj.scale, {
      x: obj.scale.x * 1.3,
      y: obj.scale.y * 1.3,
      z: obj.scale.z * 1.3,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    });

    // Flash emissive intensity
    if (obj.material.emissive) {
      const originalIntensity = obj.material.emissiveIntensity;
      gsap.to(obj.material, {
        emissiveIntensity: 1.5,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
    }

    // Randomize rotation speed
    obj.userData.rotationSpeed = {
      x: (Math.random() - 0.5) * 0.05,
      y: (Math.random() - 0.5) * 0.05,
      z: (Math.random() - 0.5) * 0.05
    };
  }
});

// 🔁 Enhanced animation loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Main torus - figure-8 motion
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.006;
  torus.position.y = Math.sin(t * 0.5) * 2;

  // Icosahedron - bobbing and spinning
  ico.rotation.y -= 0.005;
  ico.rotation.x += 0.003;
  ico.position.y = -4 + Math.cos(t * 0.7) * 1.5;

  // Dodecahedron - orbital motion
  dodecahedron.rotation.x += 0.008;
  dodecahedron.rotation.y += 0.012;
  dodecahedron.position.x = 15 + Math.cos(t * 0.3) * 3;
  dodecahedron.position.y = 8 + Math.sin(t * 0.3) * 3;

  // Octahedron - spinning with custom rotation
  if (octahedron.userData.rotationSpeed) {
    octahedron.rotation.x += octahedron.userData.rotationSpeed.x;
    octahedron.rotation.y += octahedron.userData.rotationSpeed.y;
    octahedron.rotation.z += octahedron.userData.rotationSpeed.z;
  } else {
    octahedron.rotation.x += 0.015;
    octahedron.rotation.y += 0.01;
  }
  octahedron.position.y = -10 + Math.sin(t * 0.9) * 2;

  // Torus Knot - complex rotation
  torusKnot.rotation.x += 0.007;
  torusKnot.rotation.y += 0.009;
  torusKnot.position.z = -12 + Math.sin(t * 0.4) * 2;

  // Sphere - pulsing scale
  sphere.rotation.y += 0.005;
  const pulseScale = 1 + Math.sin(t * 2) * 0.1;
  sphere.scale.set(pulseScale, pulseScale, pulseScale);

  // Particles - different rotation speeds
  stars.rotation.y += 0.0008;
  stars.rotation.x += 0.0003;

  // Glow particles - floating motion
  glowParticles.rotation.y -= 0.001;
  glowParticles.rotation.x += 0.0005;
  const glowPositions = glowParticles.geometry.attributes.position.array;
  for (let i = 0; i < glowCount; i++) {
    const i3 = i * 3;
    glowPositions[i3 + 1] += Math.sin(t + i) * 0.01;
  }
  glowParticles.geometry.attributes.position.needsUpdate = true;

  // Dynamic light effects
  pointLight.intensity = 1.5 + Math.sin(t * 1.5) * 0.5;
  spotLight1.intensity = 1.5 + Math.cos(t * 2) * 0.3;
  spotLight2.intensity = 1.5 + Math.sin(t * 2.5) * 0.3;

  parallax();
  renderer.render(scene, camera);
}
animate();

// 🔄 Responsive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------- UX helpers ----------
// Smooth anchor nav
document.querySelectorAll('[data-go]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const id = a.getAttribute('href') || a.getAttribute('data-go');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});
document.querySelectorAll('.cta[data-go]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const id = btn.getAttribute('data-go');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});

// Horizontal scroll (wheel -> x)
const hscroll = document.getElementById('vinylScroll');
if (hscroll) {
  hscroll.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      hscroll.scrollLeft += e.deltaY * 0.9;
    }
  }, { passive: false });
}

// Tilt microinteraction
function attachTilt(el) {
  const r = 10; // deg
  el.addEventListener('pointermove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `rotateX(${(-y)*r}deg) rotateY(${x*r}deg) translateY(-2px)`;
  });
  el.addEventListener('pointerleave', () => {
    el.style.transform = '';
  });
}
document.querySelectorAll('.tilt').forEach(attachTilt);

// FX toggle (reduce motion)
const fxBtn = document.getElementById('toggleFx');
let fxOn = true;
fxBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  fxOn = !fxOn;
  document.body.classList.toggle('nofx', !fxOn);
  fxBtn.textContent = `FX: ${fxOn ? 'ON' : 'OFF'}`;
  // reduce particles & effects when off
  stars.visible = fxOn;
  glowParticles.visible = fxOn;
  spotLight1.visible = fxOn;
  spotLight2.visible = fxOn;
});

// Accessibility preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('nofx');
  stars.visible = false;
  glowParticles.visible = false;
  spotLight1.visible = false;
  spotLight2.visible = false;
}

// Intersection: tint cards by section
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const hue = entry.target.dataset.hue || 330;
      // flash border using CSS var
      entry.target.style.setProperty('--accent', `hsl(${hue}, 100%, 55%)`);
      entry.target.style.boxShadow = `0 10px 30px hsla(${hue}, 100%, 55%, .18)`;
      setTimeout(() => entry.target.style.boxShadow = '', 400);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.card.tilt').forEach(el => observer.observe(el));
