/** ==========================================================================
 *  MAIN CLIENT CONTROLLER & NAVIGATION MANAGER (AUDITED & HARDENED)
 *  Author: Abdul Razak Bhutto
 *  Role: Computer Science Subject Specialist | MPhil Scholar
 *  Architecture: Active Routing, Throttled Scroll, Mobile Accessibility, UI Init
 *  ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------------------------------------
  // 1. ROUTE NORMALIZATION & ACTIVE NAVIGATION LINK DETECTION
  // --------------------------------------------------------------------------
  const navLinks = document.querySelectorAll(".nav-link");
  const pathname = window.location.pathname;

  // Extract clean filename from URL (handles root, query params, and hashes)
  let cleanFilename = pathname.split("/").pop().split(/[?#]/)[0];
  if (!cleanFilename || cleanFilename === "") {
    cleanFilename = "index.html";
  }

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const targetFilename = href.split("/").pop().split(/[?#]/)[0];

    if (targetFilename === cleanFilename) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    }
  });

  // --------------------------------------------------------------------------
  // 2. THROTTLED NAVBAR ELEVATION & SCROLL PROGRESS TRACKER
  // --------------------------------------------------------------------------
  const navbar = document.querySelector(".navbar");
  const scrollProgressBar = document.getElementById("scroll-progress");
  let isScrollTicking = false;

  function updateScrollState() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    // Navbar elevation styling
    if (navbar) {
      if (scrollY > 25) {
        navbar.classList.add("nav-scrolled");
      } else {
        navbar.classList.remove("nav-scrolled");
      }
    }

    // Top progress bar percentage
    if (scrollProgressBar && docHeight > 0) {
      const scrollPercent = Math.min(
        100,
        Math.max(0, (scrollY / docHeight) * 100),
      );
      scrollProgressBar.style.width = `${scrollPercent.toFixed(2)}%`;
    }

    isScrollTicking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!isScrollTicking) {
        requestAnimationFrame(updateScrollState);
        isScrollTicking = true;
      }
    },
    { passive: true },
  );

  // Initial trigger on load
  updateScrollState();

  // --------------------------------------------------------------------------
  // 3. RESPONSIVE MOBILE NAVIGATION DRAWER & ACCESSIBILITY
  // --------------------------------------------------------------------------
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (navToggle && navMenu) {
    function toggleMobileMenu(openState) {
      const shouldOpen =
        typeof openState === "boolean"
          ? openState
          : !navMenu.classList.contains("open");
      navMenu.classList.toggle("open", shouldOpen);
      navToggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");

      const bars = navToggle.querySelectorAll(".nav-toggle-bar");
      if (bars.length === 3) {
        if (shouldOpen) {
          bars[0].style.transform = "translateY(8px) rotate(45deg)";
          bars[1].style.opacity = "0";
          bars[2].style.transform = "translateY(-8px) rotate(-45deg)";
        } else {
          bars[0].style.transform = "none";
          bars[1].style.opacity = "1";
          bars[2].style.transform = "none";
        }
      }
    }

    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (
        navMenu.classList.contains("open") &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        toggleMobileMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMenu.classList.contains("open")) {
        toggleMobileMenu(false);
        navToggle.focus();
      }
    });

    // Close menu when a navigation link is clicked
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (navMenu.classList.contains("open")) {
          toggleMobileMenu(false);
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. INTERSECTION OBSERVER FOR STAGGERED ENTRANCE REVEALS
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll(
    ".reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-scale-in",
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target); // Unobserve once animated
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px",
      },
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Graceful fallback for non-supporting browsers
    revealElements.forEach((el) => el.classList.add("revealed"));
  }

  // --------------------------------------------------------------------------
  // 5. SYSTEM CLOCK & FOOTER TIMESTAMP SYNC
  // --------------------------------------------------------------------------
  const currentYearEl = document.getElementById("current-year");
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }
});
