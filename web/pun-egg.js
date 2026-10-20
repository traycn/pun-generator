// Easter egg: type "pun" (or enter the Konami code) anywhere on the portfolio, outside
// form fields, to open a small modal with a pun.
// Drop into the site with: <script src="/pun-egg.js" defer></script>
// puns.json is found relative to this script (../data/puns.json); override with
// data-puns="/path/to/puns.json" on the script tag. Fails silently so the main site is
// never affected.
(() => {
  try {
    const script = document.currentScript;
    const DATA_URL =
      script?.dataset.puns ?? new URL("../data/puns.json", script.src).href;
    const TRIGGER = ["p", "u", "n"];
    const KONAMI = [
      "arrowup", "arrowup", "arrowdown", "arrowdown",
      "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a",
    ];
    let keys = [];
    let puns = null;
    let bag = [];

    const isEditable = (el) =>
      el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

    const endsWith = (seq) =>
      keys.length >= seq.length && seq.every((k, i) => keys[keys.length - seq.length + i] === k);

    async function load() {
      if (puns) return;
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(res.status);
      puns = (await res.json()).puns;
    }

    // Fisher–Yates shuffle bag: no repeats until every pun has been shown.
    function next() {
      if (bag.length === 0) {
        bag = [...puns];
        for (let i = bag.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [bag[i], bag[j]] = [bag[j], bag[i]];
        }
      }
      return bag.pop().text;
    }

    function addStyles() {
      if (document.getElementById("pun-egg-style")) return;
      const style = document.createElement("style");
      style.id = "pun-egg-style";
      style.textContent = `
        #pun-egg-backdrop { position: fixed; inset: 0; z-index: 99999; display: grid;
          place-items: center; padding: 1rem; background: rgba(0,0,0,.45); }
        #pun-egg { --pun-bg: #fff; --pun-fg: #3d4449; --pun-accent: #f56a6a;
          position: relative; max-width: 24rem; padding: 1.5rem 1.5rem 1.25rem;
          border-radius: 8px; background: var(--pun-bg); color: var(--pun-fg);
          box-shadow: 0 6px 24px rgba(0,0,0,.3); font: inherit; }
        @media (prefers-color-scheme: dark) {
          #pun-egg { --pun-bg: #242629; --pun-fg: #e6e8ea; } }
        #pun-egg-text { margin: 0 0 1rem; padding-right: 1.5rem; font-size: 1.15rem; line-height: 1.45; }
        #pun-egg button { font: inherit; cursor: pointer; border-radius: 4px; }
        #pun-egg-more { padding: .5rem 1.2rem; border: 0; color: #fff; background: var(--pun-accent); }
        #pun-egg-close { position: absolute; top: .4rem; right: .5rem; border: 0;
          background: none; color: inherit; font-size: 1.4rem; line-height: 1; padding: .1rem .4rem; }
        #pun-egg button:focus-visible { outline: 3px solid var(--pun-fg); outline-offset: 2px; }`;
      document.head.appendChild(style);
    }

    function close() {
      const backdrop = document.getElementById("pun-egg-backdrop");
      if (!backdrop) return;
      const back = backdrop._returnFocus;
      backdrop.remove();
      back?.focus?.();
    }

    function show(text) {
      let backdrop = document.getElementById("pun-egg-backdrop");
      if (!backdrop) {
        addStyles();
        backdrop = document.createElement("div");
        backdrop.id = "pun-egg-backdrop";
        backdrop._returnFocus = document.activeElement;
        backdrop.innerHTML = `
          <div id="pun-egg" role="dialog" aria-modal="true" aria-label="A pun, as promised">
            <p id="pun-egg-text" aria-live="polite"></p>
            <button type="button" id="pun-egg-more">Another one</button>
            <button type="button" id="pun-egg-close" aria-label="Close">×</button>
          </div>`;
        document.body.appendChild(backdrop);
        backdrop.querySelector("#pun-egg-more").addEventListener("click", () => show(next()));
        backdrop.querySelector("#pun-egg-close").addEventListener("click", close);
        backdrop.addEventListener("click", (e) => { if (e.target === backdrop) close(); });
        backdrop.addEventListener("keydown", (e) => {
          if (e.key === "Escape") { e.stopPropagation(); close(); return; }
          if (e.key !== "Tab") return;
          // Keep focus inside the two buttons while the modal is open.
          const more = backdrop.querySelector("#pun-egg-more");
          const x = backdrop.querySelector("#pun-egg-close");
          const first = more, last = x;
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        });
      }
      backdrop.querySelector("#pun-egg-text").textContent = text;
      backdrop.querySelector("#pun-egg-more").focus();
    }

    document.addEventListener("keydown", async (e) => {
      try {
        if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
        if (isEditable(document.activeElement)) { keys = []; return; }
        if (document.getElementById("pun-egg-backdrop")) return;
        keys = [...keys, e.key.toLowerCase()].slice(-KONAMI.length);
        if (!endsWith(TRIGGER) && !endsWith(KONAMI)) return;
        keys = [];
        await load();
        show(next());
      } catch {
        /* stay invisible on failure */
      }
    });
  } catch {
    /* stay invisible on failure */
  }
})();
