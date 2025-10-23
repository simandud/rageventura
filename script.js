// 🎮 THREE.js scene — fondo reactivo con microinteracciones
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 30);

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg'), alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

// 🎯 Objetos: toro + icosaedro + partículas
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(10, 3, 16, 100),
  new THREE.MeshStandardMaterial({ color: 0xff0055, metalness: 0.5, roughness: 0.2 })
);
scene.add(torus);

const ico = new THREE.Mesh(
  new THREE.IcosahedronGeometry(4, 1),
  new THREE.MeshStandardMaterial({ color: 0x66ccff, wireframe: true, transparent: true, opacity: 0.6 })
);
ico.position.set(-12, -4, -6);
scene.add(ico);

// Partículas simples
const starGeom = new THREE.BufferGeometry();
const starCount = 800;
const positions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) positions[i] = (Math.random() - 0.5) * 180;
starGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const stars = new THREE.Points(starGeom, new THREE.PointsMaterial({ size: 0.6, color: 0xffffff }));
scene.add(stars);

// 🌈 Luces reactivas
const pointLight = new THREE.PointLight(0xff0055, 2, 200);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);
scene.add(new THREE.AmbientLight(0x404040, 0.6));

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

// 🖱️ Parallax con mouse
const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
});
function parallax() {
  camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.05;
  camera.position.y += (-mouse.y * 1.5 - camera.position.y) * 0.05;
  camera.lookAt(0, 0, 0);
}

// 🔁 Loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.006;
  ico.rotation.y -= 0.005;
  stars.rotation.y += 0.0008;

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
  // reduce particles & rotations when off
  stars.visible = fxOn;
});

// Accessibility preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('nofx');
  stars.visible = false;
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
