/** ==========================================================================
 *  PHYSICS-BASED LERP CUSTOM CURSOR ENGINE (AUDITED & HARDENED)
 *  Author: Abdul Razak Bhutto
 *  Role: Computer Science Subject Specialist | MPhil Scholar
 *  Architecture: 60 FPS GPU Lerp, Boundary Edge Clamping, Event Delegation
 *  ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------------------------------------
  // 1. ENVIRONMENT & ACCESSIBILITY GUARDS
  // --------------------------------------------------------------------------
  const isFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!isFinePointer || prefersReducedMotion) {
    return; // Abort on touch devices, mobile viewports, or reduced-motion profiles
  }

  // --------------------------------------------------------------------------
  // 2. DOM INJECTION OF DUAL CURSOR NODES
  // --------------------------------------------------------------------------
  const cursorDot = document.createElement("div");
  cursorDot.className = "cursor-dot";
  cursorDot.setAttribute("aria-hidden", "true");

  const cursorRing = document.createElement("div");
  cursorRing.className = "cursor-ring";
  cursorRing.setAttribute("aria-hidden", "true");

  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorRing);

  // --------------------------------------------------------------------------
  // 3. COORDINATE STATES & VELOCITY DYNAMICS
  // --------------------------------------------------------------------------
  let targetX = -100;
  let targetY = -100;
  let currentRingX = -100;
  let currentRingY = -100;
  let isCursorVisible = false;
  let isHovered = false;

  const LERP_FACTOR = 0.16; // Optimized inertia tracking velocity
  const EPSILON = 0.05; // Threshold to snap sub-pixel drift

  // Pointer Movement Tracking
  window.addEventListener(
    "mousemove",
    (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isCursorVisible) {
        isCursorVisible = true;
        cursorDot.style.opacity = "1";
        cursorRing.style.opacity = "1";
      }

      // Direct GPU-accelerated placement for the central dot
      cursorDot.style.transform = `translate3d(${targetX - 3}px, ${targetY - 3}px, 0)`;
    },
    { passive: true },
  );

  // --------------------------------------------------------------------------
  // 4. WINDOW BOUNDARY & BLUR GUARDS
  // --------------------------------------------------------------------------
  function hideCursor() {
    isCursorVisible = false;
    cursorDot.style.opacity = "0";
    cursorRing.style.opacity = "0";
  }

  function showCursor() {
    isCursorVisible = true;
    cursorDot.style.opacity = "1";
    cursorRing.style.opacity = "1";
  }

  document.addEventListener("mouseleave", hideCursor);
  document.addEventListener("mouseenter", showCursor);

  document.addEventListener("mouseout", (e) => {
    if (!e.relatedTarget && !e.toElement) {
      hideCursor();
    }
  });

  window.addEventListener("blur", hideCursor);
  window.addEventListener("focus", showCursor);

  // --------------------------------------------------------------------------
  // 5. ANIMATION FRAME INTERPOLATION LOOP
  // --------------------------------------------------------------------------
  function renderCursorLoop() {
    if (isCursorVisible) {
      const dx = targetX - currentRingX;
      const dy = targetY - currentRingY;

      // Sub-pixel snapping threshold
      if (Math.abs(dx) > EPSILON) {
        currentRingX += dx * LERP_FACTOR;
      } else {
        currentRingX = targetX;
      }

      if (Math.abs(dy) > EPSILON) {
        currentRingY += dy * LERP_FACTOR;
      } else {
        currentRingY = targetY;
      }

      const ringOffset = isHovered ? 28 : 17;
      cursorRing.style.transform = `translate3d(${currentRingX - ringOffset}px, ${currentRingY - ringOffset}px, 0)`;
    }

    requestAnimationFrame(renderCursorLoop);
  }

  requestAnimationFrame(renderCursorLoop);

  // --------------------------------------------------------------------------
  // 6. EVENT DELEGATION FOR INTERACTIVE TARGETS
  // --------------------------------------------------------------------------
  const interactiveTargetSelector =
    'a, button, input, textarea, select, [role="button"], .tilt-card, .glass-pill, .nav-brand, .floating-whatsapp, .interactive';

  document.addEventListener(
    "mouseover",
    (e) => {
      const target = e.target.closest(interactiveTargetSelector);
      if (target) {
        isHovered = true;
        document.body.classList.add("cursor-hover");
        cursorRing.classList.add("cursor-expanded");
      }
    },
    { passive: true },
  );

  document.addEventListener(
    "mouseout",
    (e) => {
      const target = e.target.closest(interactiveTargetSelector);
      if (target) {
        isHovered = false;
        document.body.classList.remove("cursor-hover");
        cursorRing.classList.remove("cursor-expanded");
      }
    },
    { passive: true },
  );
});
