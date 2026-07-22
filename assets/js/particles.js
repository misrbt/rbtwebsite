// Ambient particle network for the hero background — a lightweight, hand-
// rolled 2D canvas effect (no library needed for something this simple).
// Kept subtle and slow on purpose: this is atmosphere, not a game.

(function () {
  const canvas = document.querySelector("[data-hero-particles]");
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return; // hero gradient background is the static fallback

  const ctx = canvas.getContext("2d");
  const hero = canvas.parentElement;

  let width, height, particles;
  const PARTICLE_COUNT = 60;
  const LINK_DISTANCE = 130;
  const mouse = { x: null, y: null };

  function resize() {
    width = canvas.width = hero.clientWidth;
    height = canvas.height = hero.clientHeight;
  }

  function createParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Gentle drift toward the cursor — subtle, not a swarm.
      if (mouse.x !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 160) {
          p.x += dx * 0.0015;
          p.y += dy * 0.0015;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(212, 175, 55, 0.55)"; // gold, faint
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < LINK_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(120, 160, 220, ${0.12 * (1 - dist / LINK_DISTANCE)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    frameId = requestAnimationFrame(step);
  }

  let frameId = null;

  function start() {
    if (frameId === null) frameId = requestAnimationFrame(step);
  }

  function stop() {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  }

  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });

  hero.addEventListener("pointermove", (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  hero.addEventListener("pointerleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  resize();
  createParticles();
  start();
})();
