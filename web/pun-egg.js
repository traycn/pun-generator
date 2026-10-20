// Easter egg: type "pun" anywhere on the portfolio (outside form fields) to get a pun.
// Drop into the site with: <script src="/pun-egg.js" defer></script>
// Fails silently so the main site is never affected.
(() => {
  const DATA_URL = "/data/puns.json"; // adjust to where puns.json is published
  const TRIGGER = "pun";
  let typed = "";
  let puns = null;
  let bag = [];

  const isEditable = (el) =>
    el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

  async function load() {
    if (puns) return puns;
    const res = await fetch(DATA_URL);
    puns = (await res.json()).puns;
    return puns;
  }

  function next() {
    if (bag.length === 0) bag = [...puns].sort(() => Math.random() - 0.5);
    return bag.pop().text;
  }

  function show(text) {
    let box = document.getElementById("pun-egg");
    if (!box) {
      box = document.createElement("div");
      box.id = "pun-egg";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-label", "A pun, as promised");
      box.innerHTML = `
        <p id="pun-egg-text" aria-live="polite"></p>
        <button type="button" id="pun-egg-more">Another one</button>
        <button type="button" id="pun-egg-close" aria-label="Close">×</button>`;
      Object.assign(box.style, {
        position: "fixed", right: "1rem", bottom: "1rem", maxWidth: "22rem",
        padding: "1rem 1.25rem", borderRadius: "8px", zIndex: 9999,
        background: "var(--pun-bg, #fff)", color: "var(--pun-fg, #222)",
        boxShadow: "0 6px 24px rgba(0,0,0,.2)", font: "inherit",
      });
      document.body.appendChild(box);
      box.querySelector("#pun-egg-more").addEventListener("click", () => show(next()));
      box.querySelector("#pun-egg-close").addEventListener("click", () => box.remove());
    }
    box.querySelector("#pun-egg-text").textContent = text;
    box.querySelector("#pun-egg-more").focus();
  }

  document.addEventListener("keydown", async (e) => {
    if (isEditable(document.activeElement) || e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-TRIGGER.length);
    if (typed !== TRIGGER) return;
    try {
      await load();
      show(next());
    } catch {
      /* stay invisible on failure */
    }
  });
})();
