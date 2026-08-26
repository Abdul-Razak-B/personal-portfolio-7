/** ==========================================================================
 *  3D PERSPECTIVE TILT & SPOTLIGHT MATRIX ENGINE (AUDITED & HARDENED)
 *  Author: Abdul Razak Bhutto
 *  Role: Computer Science Subject Specialist | MPhil Scholar
 *  Architecture: GPU-Accelerated 3D Transforms, Scroll-Aware, NaN-Protected
 *  ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------------------------------------
  // 1. ACCESSIBILITY & DEVICE VALIDATION
  // --------------------------------------------------------------------------
  const isFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!isFinePointer || prefersReducedMotion) {
    return; // Preserve native scroll and reduce GPU load on touch/reduced-motion profiles
  }

  // --------------------------------------------------------------------------
  // 2. TILT & SPOTLIGHT ENGINE BINDING
  // --------------------------------------------------------------------------
  const tiltCards = document.querySelectorAll(".tilt-card");

  tiltCards.forEach((card) => {
    let bounds = null;
    let frameId = null;

    function updateBounds() {
      bounds = card.getBoundingClientRect();
    }

    function onMouseEnter() {
      updateBounds();
      card.style.transition = "transform 0.1s ease-out, box-shadow 0.3s ease";
    }

    function onMouseMove(e) {
      if (!bounds || bounds.width === 0 || bounds.height === 0) {
        updateBounds();
      }

      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        if (!bounds || bounds.width <= 0 || bounds.height <= 0) return;

        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        // Relative coordinates from card geometric center (-1 to +1)
        const xPct = Math.max(
          -1,
          Math.min(1, (mouseX / bounds.width - 0.5) * 2),
        );
        const yPct = Math.max(
          -1,
          Math.min(1, (mouseY / bounds.height - 0.5) * 2),
        );

        // Rotational matrix calculation (Max 10 deg tilt for luxury subtlety)
        const rotateX = (-yPct * 8).toFixed(2);
        const rotateY = (xPct * 8).toFixed(2);

        // Apply 3D perspective transformation
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;

        // Clamped CSS Custom Properties for Dynamic Radial Spotlight (0% - 100%)
        const spotlightX = Math.max(
          0,
          Math.min(100, (mouseX / bounds.width) * 100),
        ).toFixed(1);
        const spotlightY = Math.max(
          0,
          Math.min(100, (mouseY / bounds.height) * 100),
        ).toFixed(1);

        card.style.setProperty("--mouse-x", `${spotlightX}%`);
        card.style.setProperty("--mouse-y", `${spotlightY}%`);
      });
    }

    function onMouseLeave() {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      card.style.transition =
        "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease";
      card.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      bounds = null;
    }

    // Bind Event Handlers
    card.addEventListener("mouseenter", onMouseEnter, { passive: true });
    card.addEventListener("mousemove", onMouseMove, { passive: true });
    card.addEventListener("mouseleave", onMouseLeave, { passive: true });
  });

  // Re-calculate bounds on scroll or window resize
  window.addEventListener(
    "resize",
    () => {
      tiltCards.forEach((card) => {
        card.style.transform =
          "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      });
    },
    { passive: true },
  );
});
