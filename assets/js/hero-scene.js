// Homepage hero 3D visual — a slow-rotating, low-opacity wireframe piggy
// bank (built from primitive geometries — sphere, cylinders, cones, box —
// no external model file). Loaded as a module (needed for the
// `import` below) but deliberately deferred past idle so it never competes
// with first paint or interactivity, and lazily imports Three.js from a CDN
// only when it's actually going to be used.
//
// Two things gate this entirely:
// - Opened via file:// (double-clicked, no server): browsers block module
//   fetches over file://, and a CDN fetch would fail anyway with no network
//   context guarantee — so this bails out and the hero's CSS gradient +
//   particle canvas (assets/js/particles.js) carry the visual on their own.
// - prefers-reduced-motion: same static fallback, by user preference.
//
// Perf budget: Three.js's ES module core build is ~150KB gzipped. Loading it
// only on idle, only on the homepage, only when neither guard above trips,
// keeps this off the critical path entirely.

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function mount(canvas, THREE) {
  const parent = canvas.parentElement;
  let width = parent.clientWidth;
  let height = parent.clientHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.z = 6;

  // Offset to the right and kept faint — a decorative accent that sits
  // clear of the headline column, never competing with it for attention
  // or legibility (verified in-browser, not just in code). A wireframe
  // piggy bank (built from primitive geometries, no external model file)
  // ties the hero visual directly to "bank", instead of an abstract shape.
  const material = new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.22 });

  function wirePart(geometry) {
    return new THREE.LineSegments(new THREE.WireframeGeometry(geometry), material);
  }

  // Low-poly (few segments) throughout — a faceted, gem-like look that reads
  // as clean line-art rather than a dense tangle, and keeps each part
  // (body/snout/ears/legs) visually separated instead of overlapping.
  const shape = new THREE.Group();

  const body = wirePart(new THREE.IcosahedronGeometry(1, 1));
  body.scale.set(1, 0.85, 1.2);
  shape.add(body);

  const snout = wirePart(new THREE.CylinderGeometry(0.32, 0.36, 0.24, 8));
  snout.rotation.x = Math.PI / 2;
  snout.position.set(0, -0.05, 1.28);
  shape.add(snout);

  const earGeometry = new THREE.ConeGeometry(0.24, 0.32, 6);
  [-1, 1].forEach((side) => {
    const ear = wirePart(earGeometry);
    ear.position.set(side * 0.48, 1.02, 0.55);
    ear.rotation.z = side * 0.5;
    shape.add(ear);
  });

  const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 6);
  [-1, 1].forEach((x) => {
    [-1, 1].forEach((z) => {
      const leg = wirePart(legGeometry);
      leg.position.set(x * 0.5, -1.15, z * 0.65);
      shape.add(leg);
    });
  });

  const slot = wirePart(new THREE.BoxGeometry(0.4, 0.05, 0.14));
  slot.position.set(0, 0.98, 0);
  slot.rotation.z = 0.05;
  shape.add(slot);

  shape.position.x = 3.2;
  scene.add(shape);

  // three@0.160.0 (pinned CDN version) predates THREE.Timer — Clock is the
  // correct, non-deprecated API for this revision.
  let frameId = null;
  const clock = new THREE.Clock();

  // Driven externally by assets/js/motion.js's scroll-pin ScrollTrigger
  // (see setScrollProgress below) — layered on top of, not replacing, the
  // idle ambient rotation so the shape still feels alive before any scroll.
  let scrollProgress = 0;

  function render() {
    const delta = clock.getDelta();
    shape.rotation.x += delta * 0.06;
    shape.rotation.y += delta * 0.1;
    shape.rotation.z = scrollProgress * Math.PI * 1.5;
    const scale = 1 + scrollProgress * 1.8;
    shape.scale.setScalar(scale);
    material.opacity = 0.22 + scrollProgress * 0.18;
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(render);
  }

  function start() {
    if (frameId === null) frameId = requestAnimationFrame(render);
  }

  function stop() {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  window.addEventListener("resize", () => {
    width = parent.clientWidth;
    height = parent.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });

  start();

  // Small, deliberate bridge to the classic (non-module) scripts — motion.js
  // can't `import` this module, so it reaches the scroll hook via a global
  // it only touches after hearing the "heroscene:mounted" event below.
  window.__heroScene = {
    setScrollProgress(p) {
      scrollProgress = p;
    },
  };
  window.dispatchEvent(new CustomEvent("heroscene:mounted"));
}

function init() {
  const canvas = document.querySelector("[data-hero-canvas]");
  if (!canvas) return;
  if (location.protocol === "file:") return; // module CDN fetch needs http(s)
  if (prefersReducedMotion()) return; // static fallback stays

  const load = () =>
    import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js")
      .then((THREE) => mount(canvas, THREE))
      .catch(() => {}); // network hiccup — static fallback is still fine

  if ("requestIdleCallback" in window) {
    requestIdleCallback(load, { timeout: 2000 });
  } else {
    window.addEventListener("load", () => setTimeout(load, 200));
  }
}

init();
