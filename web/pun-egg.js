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
      // Matches the site theme: Source Sans Pro, black on white, cyan accent, pill buttons.
      // The theme styles every bare `button` (including `color: ... !important`), so the popup
      // resets its buttons with `all: initial` under #pun-egg and sets color with !important.
      style.textContent = `
        #pun-egg-backdrop { position: fixed; inset: 0; z-index: 99999; display: grid;
          place-items: center; padding: 1rem; background: rgba(0,0,0,.45); }
        #pun-egg { --pun-bg: #ffffff; --pun-fg: #000000; --pun-accent: #47D3E5; --pun-accent-hover: #1ebdd1;
          position: relative; box-sizing: border-box; max-width: 24rem; padding: 2rem 2rem 1.75rem;
          border-radius: 0.35rem; background: var(--pun-bg); color: var(--pun-fg);
          box-shadow: 0 0.5rem 2rem rgba(0,0,0,.35);
          font-family: "Source Sans Pro", Helvetica, sans-serif; font-weight: 300; line-height: 1.65; }
        @media (prefers-color-scheme: dark) {
          #pun-egg { --pun-bg: #1c1c1c; --pun-fg: #ffffff; box-shadow: 0 0.5rem 2rem rgba(0,0,0,.7); } }
        #pun-egg-text { margin: 0 0 1.5rem; padding-right: 1.5rem; font-size: 1.25rem; line-height: 1.5; }
        #pun-egg button { all: initial; box-sizing: border-box; cursor: pointer;
          font-family: inherit; text-align: center; transition: background-color .2s ease-in-out; }
        #pun-egg #pun-egg-more { display: inline-block; height: 3.25rem; padding: 0 2.5rem;
          border-radius: 3.25rem; background: var(--pun-accent); color: #000000 !important;
          font-size: .75rem; font-weight: 600; line-height: 3.25rem; letter-spacing: .125em;
          text-transform: uppercase; white-space: nowrap; }
        #pun-egg #pun-egg-more:hover { background: var(--pun-accent-hover); color: #000000 !important; }
        #pun-egg #pun-egg-more:active { background: #0f9fb1; color: #000000 !important; }
        #pun-egg #pun-egg-close { position: absolute; top: .5rem; right: .5rem; display: grid;
          place-items: center; width: 2rem; height: 2rem; border-radius: 50%; background: transparent;
          color: var(--pun-fg) !important; font-size: 1.5rem; line-height: 1; }
        #pun-egg #pun-egg-close:hover { background: rgba(128,128,128,.25); color: var(--pun-fg) !important; }
        #pun-egg #pun-egg-close:active { background: rgba(128,128,128,.4); color: var(--pun-fg) !important; }
        #pun-egg button:focus-visible { outline: 3px solid var(--pun-fg); outline-offset: 3px; }`;
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
