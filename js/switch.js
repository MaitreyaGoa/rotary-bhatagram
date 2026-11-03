/* ============================================================
   Design switch: Classic (index.html, default) <-> Dawn (dawn.html)
   - Remembers each visitor's choice on their device.
   - Opens the other design at the same section.
   - Hide it everywhere with RC_CONFIG.layoutSwitch = false.
   ============================================================ */
(function () {
  const C = window.RC_CONFIG || {};
  if (C.layoutSwitch === false) return;
  const isClassic = !/dawn\.html$/i.test(location.pathname);
  const KEY = "rcb_layout";
  // section ids that differ between the two designs
  const toClassic = { home: "top", meet: "events" }, toDawn = { top: "home", events: "meet" };

  function currentSection() {
    const secs = [...document.querySelectorAll("header[id],section[id]")].filter(s => !s.hidden);
    let best = secs[0];
    for (const s of secs) if (s.getBoundingClientRect().top <= window.innerHeight * 0.35) best = s;
    return best ? best.id : "";
  }
  function go(target) {
    try { localStorage.setItem(KEY, target); } catch (e) {}
    let id = currentSection();
    id = (target === "classic" ? toClassic : toDawn)[id] || id;
    const page = target === "classic" ? "./?classic" : "dawn.html";
    location.href = page + (id && id !== "home" && id !== "top" ? "#" + id : "");
  }

  const css = `
  .lay{position:absolute;z-index:66;top:calc(max(10px,env(safe-area-inset-top)) + 64px);right:max(16px,calc((100vw - 1180px)/2));display:inline-flex;align-items:center;gap:2px;padding:4px;border-radius:999px;
    font:600 .8rem/1 "Hind","Open Sans",system-ui,sans-serif;background:rgba(2,10,30,.55);backdrop-filter:blur(16px) saturate(1.5);-webkit-backdrop-filter:blur(16px) saturate(1.5);
    box-shadow:inset 0 0 0 1px rgba(255,255,255,.18),0 14px 30px -14px rgba(0,0,0,.6)}
  .lay span{padding:0 6px 0 8px;color:rgba(255,255,255,.7);font-weight:500}
  .lay button{border:0;cursor:pointer;padding:8px 13px;border-radius:999px;background:transparent;color:#fff;font:inherit;transition:background-color .25s,color .25s}
  .lay button:hover{background:rgba(255,255,255,.12)}
  .lay button[aria-pressed="true"]{background:#F7A81B;color:#221500;cursor:default}
  .lay button:focus-visible{outline:3px solid #F7A81B;outline-offset:2px}
  @media (max-width:520px){.lay span{display:none}}
  .lay-foot{display:inline;background:none;border:0;padding:0;color:inherit;font:inherit;text-decoration:underline;cursor:pointer;opacity:.7}
  .lay-foot:hover{opacity:1}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  function build() {
    const hero = document.querySelector(isClassic ? "header.hero" : "#home");
    if (!hero) return;
    const box = document.createElement("div");
    box.className = "lay"; box.setAttribute("role", "group"); box.setAttribute("aria-label", "Choose website design");
    box.innerHTML = `<span>Design</span><button type="button" data-l="classic" aria-pressed="${isClassic}">Classic</button><button type="button" data-l="dawn" aria-pressed="${!isClassic}">Dawn</button>`;
    box.addEventListener("click", e => { const b = e.target.closest("button[data-l]"); if (b && b.getAttribute("aria-pressed") !== "true") go(b.dataset.l); });
    hero.appendChild(box);
    const bar = document.querySelector("footer .bar");
    if (bar) {
      const l = document.createElement("button");
      l.className = "lay-foot"; l.type = "button";
      l.textContent = isClassic ? "Switch to the Dawn design" : "Switch to the Classic design";
      l.onclick = () => go(isClassic ? "dawn" : "classic");
      bar.insertBefore(l, bar.lastElementChild);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  // landing on classic directly also counts as a choice
  try { localStorage.setItem(KEY, isClassic ? "classic" : "dawn"); } catch (e) {}
})();
