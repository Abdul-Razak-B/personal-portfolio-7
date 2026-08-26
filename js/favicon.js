/** ==========================================================================
 *  DYNAMIC CANVAS FAVICON ENGINE (AUDITED & PERFORMANCE OPTIMIZED)
 *  Author: Abdul Razak Bhutto
 *  Role: Computer Science Subject Specialist | MPhil Scholar
 *  Architecture: 12 FPS Off-Screen Canvas, Dual-Orbital Geometry, Retina-Aware
 *  ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------------------------------------
  // 1. ENGINE CONFIGURATION & ACCESSIBILITY GUARDS
  // --------------------------------------------------------------------------
  const BASE_SIZE = 32;
  const TARGET_FPS = 12;
  const FRAME_INTERVAL = 1000 / TARGET_FPS;

  let lastRenderTime = 0;
  let animationFrameId = null;
  let isRunning = true;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // --------------------------------------------------------------------------
  // 2. RETINA-SCALED OFF-SCREEN CANVAS SETUP
  // --------------------------------------------------------------------------
  const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for efficiency
  const canvas = document.createElement("canvas");
  canvas.width = BASE_SIZE * dpr;
  canvas.height = BASE_SIZE * dpr;

  const ctx = canvas.getContext("2d", {
    alpha: true,
    willReadFrequently: true,
  });
  if (!ctx) return;

  // Scale drawing context to match DPI
  ctx.scale(dpr, dpr);

  // Locate or instantiate favicon node
  let faviconLink =
    document.querySelector('link[rel="icon"]') ||
    document.querySelector('link[rel="shortcut icon"]');

  if (!faviconLink) {
    faviconLink = document.createElement("link");
    faviconLink.rel = "icon";
    faviconLink.type = "image/png";
    document.head.appendChild(faviconLink);
  }

  // --------------------------------------------------------------------------
  // 3. ATOMIC DUAL-ORBITAL RENDER PIPELINE
  // --------------------------------------------------------------------------
  function renderFrame(timestamp) {
    if (!isRunning) return;

    // Strict Frame Rate Throttling
    if (timestamp - lastRenderTime < FRAME_INTERVAL) {
      animationFrameId = requestAnimationFrame(renderFrame);
      return;
    }

    lastRenderTime = timestamp;

    // Clear Canvas
    ctx.clearRect(0, 0, BASE_SIZE, BASE_SIZE);

    const centerX = BASE_SIZE / 2;
    const centerY = BASE_SIZE / 2;

    // Time-based orbital trigonometry
    const timeFactor = timestamp * 0.002;
    const primaryAngle = timeFactor;
    const secondaryAngle = -timeFactor * 0.8;

    // A. Center Core Nucleus (Glowing Gold)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#D4AF37";
    ctx.fill();

    // Nucleus Ambient Glow
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(212, 175, 55, 0.28)";
    ctx.fill();

    // B. Primary Orbital Track (Cyan Accent)
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(primaryAngle);
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 1.5);
    ctx.strokeStyle = "#06B6D4";
    ctx.lineWidth = 1.6;
    ctx.lineCap = "round";
    ctx.stroke();

    // Primary Orbital Node
    ctx.beginPath();
    ctx.arc(10, 0, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#06B6D4";
    ctx.fill();
    ctx.restore();

    // C. Secondary Elliptical Track (Gold Accent, 3D Incline)
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(secondaryAngle);
    ctx.scale(1, 0.55); // Perspective Tilt
    ctx.beginPath();
    ctx.arc(0, 0, 12.5, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(212, 175, 55, 0.65)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Secondary Node
    ctx.beginPath();
    ctx.arc(-12.5, 0, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = "#F59E0B";
    ctx.fill();
    ctx.restore();

    // D. Safe Data URL Serialization
    try {
      faviconLink.href = canvas.toDataURL("image/png");
    } catch (err) {
      // Gracefully handle browser security context limitations
      isRunning = false;
      return;
    }

    // Schedule next frame
    animationFrameId = requestAnimationFrame(renderFrame);
  }

  // --------------------------------------------------------------------------
  // 4. RESOURCE-AWARE VISIBILITY CONTROLLER
  // --------------------------------------------------------------------------
  function handleVisibilityChange() {
    if (document.hidden) {
      isRunning = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    } else {
      if (!prefersReducedMotion) {
        isRunning = true;
        lastRenderTime = performance.now();
        animationFrameId = requestAnimationFrame(renderFrame);
      }
    }
  }

  document.addEventListener("visibilitychange", handleVisibilityChange, {
    passive: true,
  });

  // --------------------------------------------------------------------------
  // 5. ENGINE BOOTSTRAP
  // --------------------------------------------------------------------------
  if (!prefersReducedMotion) {
    animationFrameId = requestAnimationFrame(renderFrame);
  } else {
    // Static render for accessibility
    renderFrame(0);
    isRunning = false;
  }
});
