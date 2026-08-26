/** ==========================================================================
 *  WHATSAPP DISPATCH & ASYNCHRONOUS CONTACT BRIDGE (AUDITED & HARDENED)
 *  Author: Abdul Razak Bhutto
 *  Role: Computer Science Subject Specialist | MPhil Scholar
 *  Architecture: Zero-Dependency Form Validation, URI Serialization, XSS-Safe
 *  ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------------------------------------
  // 1. DOM NODES & CONFIGURATION
  // --------------------------------------------------------------------------
  const TARGET_PHONE = "923090609391"; // International E.164 Format without '+'
  const contactForm = document.getElementById("whatsapp-dispatch-form");
  const copyEmailBtn = document.getElementById("copy-email-btn");
  const toastContainer = document.getElementById("toast-container");

  // --------------------------------------------------------------------------
  // 2. XSS-SAFE TOAST NOTIFICATION UTILITY
  // --------------------------------------------------------------------------
  function showToast(message, type = "gold") {
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `glass-panel toast-item toast-${type}`;
    toast.style.cssText = `
      padding: 12px 20px;
      margin-top: 10px;
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      border: 1px solid ${type === "gold" ? "var(--accent-gold)" : "var(--accent-emerald)"};
      transform: translate3d(0, 20px, 0);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    // Indicator Dot
    const dot = document.createElement("span");
    dot.textContent = "●";
    dot.style.color =
      type === "gold" ? "var(--accent-gold)" : "var(--accent-emerald)";

    // Message Text Node (XSS Safe)
    const textNode = document.createElement("span");
    textNode.textContent = message;

    toast.appendChild(dot);
    toast.appendChild(textNode);
    toastContainer.appendChild(toast);

    // Trigger Entrance
    requestAnimationFrame(() => {
      toast.style.transform = "translate3d(0, 0, 0)";
      toast.style.opacity = "1";
    });

    // Auto Dismiss after 3.5s
    setTimeout(() => {
      toast.style.transform = "translate3d(0, -10px, 0)";
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --------------------------------------------------------------------------
  // 3. WHATSAPP PAYLOAD DISPATCH HANDLER
  // --------------------------------------------------------------------------
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("sender-name");
      const categoryInput = document.getElementById("inquiry-category");
      const messageInput = document.getElementById("sender-message");

      const name = nameInput ? nameInput.value.trim() : "";
      const category = categoryInput
        ? categoryInput.value.trim()
        : "General Inquiry";
      const message = messageInput ? messageInput.value.trim() : "";

      // Strict Validation: Ensure inputs are non-empty and not just whitespace
      if (!name || !message || !/\S/.test(name) || !/\S/.test(message)) {
        showToast("Please enter a valid name and detailed message.", "gold");
        if (!name && nameInput) nameInput.focus();
        else if (messageInput) messageInput.focus();
        return;
      }

      // Format payload text
      const rawPayload = `السلام علیکم / Greetings Mr. Abdul Razak,

My Name: ${name}
Inquiry Category: ${category}

Message:
${message}

---
Dispatched via Portfolio Communications Pipeline`;

      // URI Component Encoding
      const encodedPayload = encodeURIComponent(rawPayload);
      const targetUrl = `https://wa.me/${TARGET_PHONE}?text=${encodedPayload}`;

      showToast("Opening secure WhatsApp pipeline...", "emerald");

      // Secure Window Dispatch
      const link = document.createElement("a");
      link.href = targetUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // --------------------------------------------------------------------------
  // 4. CLIPBOARD COPY UTILITY WITH FALLBACK
  // --------------------------------------------------------------------------
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", () => {
      const email = "abdulrazakb63@gmail.com";

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(email)
          .then(() => showToast(`Copied to clipboard: ${email}`, "emerald"))
          .catch(() => fallbackCopyText(email));
      } else {
        fallbackCopyText(email);
      }
    });
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      showToast(`Copied to clipboard: ${text}`, "emerald");
    } catch (err) {
      showToast(`Email: ${text}`, "gold");
    } finally {
      document.body.removeChild(textArea);
    }
  }
});
