# Abdul Razak Bhutto — Academic Dossier & Systems Portfolio

[![Vanilla JavaScript](https://img.shields.io/badge/Stack-Vanilla_ES6+-f7df1e?logo=javascript&logoColor=black)](#)
[![CSS3 Architecture](https://img.shields.io/badge/Styles-CSS3_Custom_Properties-1572b6?logo=css3&logoColor=white)](#)
[![Zero External Dependencies](https://img.shields.io/badge/Dependencies-0_Runtime_Libs-10b981)](#)
[![Peer-Reviewed Research](https://img.shields.io/badge/Research-DEEPLNET_(CNN)-06b6d4)](#)
[![Institutional Role](https://img.shields.io/badge/Institution-IBA_Public_School_Sukkur-d4af37)](#)

A zero-dependency web application and academic dossier engineered for **Abdul Razak Bhutto** (Computer Science Subject Specialist at IBA Public School Sukkur, MPhil Scholar at NCBA&E, and Software Engineer).

---

## Architectural Overview

The portfolio uses an ultra-lightweight, high-performance vanilla stack designed for low latency, smooth GPU compositing, and full cross-browser accessibility.

* **Layered Frosted Glassmorphism:** Pure CSS backdrop filters, radial cursor spotlights, and gold/cyan metallic border accents.
* **Canvas Favicon Engine (`js/favicon.js`):** 12 FPS off-screen canvas running a dual-orbital planetary animation with automatic suspension via the Page Visibility API.
* **Physics LERP Cursor (`js/cursor.js`):** Linear interpolation tracking with edge clamping and sub-pixel snapping.
* **3D Perspective Cards (`js/tilt-gallery.js`):** Gyroscope/mouse-driven rotational matrices with coordinate boundaries.
* **Direct Communication Pipeline (`js/contact-bridge.js`):** XSS-sanitized form validation with encoded URI payload generation for WhatsApp and clipboard utilities.

---

## Directory Structure

```text
arb-academic-portfolio/
│
├── css/
│   ├── luxury-core.css      # Design tokens, variables, normalize & obsidian mesh
│   ├── glassmorphism.css    # Layered glass surfaces, spotlights & shimmer borders
│   ├── components.css       # Navigation, buttons, scrollbars, cursor & terminal
│   └── animations.css       # GPU keyframes, reveals & reduced-motion overrides
│
├── js/
│   ├── favicon.js           # Off-screen canvas orbital dynamic favicon engine
│   ├── cursor.js            # Physics-based linear interpolation custom cursor
│   ├── tilt-gallery.js      # 3D matrix card perspective & spotlight coordinate engine
│   ├── contact-bridge.js    # WhatsApp message serializer, form validator & toast UI
│   └── main.js              # Active route matching, scroll progress & mobile drawer
│
├── index.html               # Main landing view & live terminal emulator
├── about.html               # Academic qualifications, teaching chronology & language matrix
├── research.html            # DEEPLNET CNN publication, citations & CIT credentials
├── projects.html            # Engineering capstones (Chill Time POS, LMS, Web Engines)
├── contact.html             # Inquiry matrix & direct WhatsApp dispatch hub
└── README.md                # System documentation & deployment guide