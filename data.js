/* ============================================================
   Data layer: Firebase Firestore + Auth, Cloudinary uploads.
   Falls back to PREVIEW MODE (browser localStorage) when
   RC_CONFIG.firebase.apiKey is empty, so the site can be
   tested before the backend is connected.
   ============================================================ */
(function () {
  const C = window.RC_CONFIG || {};
  const LIVE = !!(C.firebase && C.firebase.apiKey);
  const CLD = C.cloudinary || {};
  const V = "10.12.2";
  let fb = null;

  async function init() {
    if (!LIVE) return null;
    if (fb) return fb;
    const base = "https://www.gstatic.com/firebasejs/" + V + "/";
    const [app, fs, au] = await Promise.all([
      import(base + "firebase-app.js"),
      import(base + "firebase-firestore.js"),
      import(base + "firebase-auth.js")
    ]);
    const a = app.initializeApp(C.firebase);
    fb = { fs, au, db: fs.getFirestore(a), auth: au.getAuth(a) };
    return fb;
  }

  /* ---------- Starter content (real club details, Nov 2026) ----------
     Used as-is in preview mode, and written to Firestore once by
     Admin → Settings → "Load starter content" after going live.   */
  const now = Date.now();
  const SEED = {
    settings: {
      intro: "A new Rotary club in Bicholim taluka, Goa. Professionals from across the taluka, serving our town and the villages around it.",
      storyLead: "Bhatagrama is an ancient name recorded for Sankhali, in our own Bicholim taluka.",
      story: "When our founding members looked for a name, we wanted one that belongs to this land. Bhatagram carries our taluka's history, and gives our club an identity of its own alongside the Rotary Club of Bicholim, which has served the town since 1993.\n\nWe are lawyers, doctors, chartered accountants, teachers and business owners. Rotary membership is by invitation, and we came together to bring a new generation into service for Bicholim and the villages around it.",
      meetingDay: "Every Wednesday",
      meetingWeekday: 3,           // 0 = Sunday … 3 = Wednesday
      meetingTime: "19:00",
      meetingEnd: "21:00",
      meetingVenue: "Bicholim, Goa",
      mapUrl: "",
      email: "", phone: "", whatsapp: "", instagram: "", facebook: ""
    },
    projects: [],
    events: [
      { id: "e-install", title: "Installation & Charter Ceremony", date: "2026-11-29", time: "18:00", venue: "Momentz",
        description: "The evening our club is formally installed and the first board takes charge. Date and venue to be confirmed.", tentative: true, createdAt: now }
    ],
    gallery: [],
    leaders: [
      { id: "l1", name: "Olayinka Hakeem Babalola", role: "President, Rotary International 2026–27", photo: "assets/ri-president.jpg", order: 1 },
      { id: "l2", name: "Lenny Da Costa", role: "District Governor, RI District 3170, 2026–27", photo: "assets/district-governor.jpg", order: 2 }
    ].map(m => Object.assign({ createdAt: now }, m)),
    news: [
      // kind: "rotary" (story on rotary.org) or "club" (our own news)
      { id: "n1", kind: "rotary", title: "On the plus side", date: "2026-10-21", url: "https://www.rotary.org/en/articles/2026/10/on-the-plus-side",
        summary: "In Pakistan, Rotary and its PolioPlus partners now offer more than vaccines: nutrition checks, clean water plants and vaccination points at bus and rail stations." },
      { id: "n2", kind: "rotary", title: "Rotary projects around the globe", date: "2026-10-01", url: "https://www.rotary.org/en/articles/2026/10/rotary-projects-around-globe-october-2026",
        summary: "A roundup of what clubs are doing this season in Bolivia, Canada, Trinidad and Tobago, Italy and Australia." },
      { id: "n3", kind: "rotary", title: "High-tech classroom upgrades open pathways for girls in India", date: "2025-11-01", url: "https://www.rotary.org/en/articles/2025/11/high-tech-classroom-upgrades-open-pathways-for-girls-in-india",
        summary: "Rotary clubs in California and Vijayawada are equipping girls' residential schools in Andhra Pradesh with computer and STEM labs, solar power and clean water." }
    ].map(m => Object.assign({ image: "", createdAt: now }, m)),
    members: [
      // group: "officers", "chairs" or "founders" (founding members). Empty name = role still open.
      { id: "m1",  group: "officers", role: "President", name: "Nikhil J. Dixit", duty: "Leads the club and chairs board meetings.", order: 1 },
      { id: "m2",  group: "officers", role: "Secretary, President-Elect", name: "Aparna Amoncar", duty: "Keeps club records and minutes, and will lead the club in 2027–28.", order: 2 },
      { id: "m3",  group: "officers", role: "Treasurer", name: "", duty: "Manages club funds, member dues and accounts.", order: 3 },
      { id: "m4",  group: "officers", role: "Sergeant-at-Arms", name: "", duty: "Keeps meetings orderly and on time, and welcomes guests.", order: 4 },
      { id: "m5",  group: "officers", role: "President Nominee", name: "", duty: "Will lead the club in 2028–29.", order: 5 },
      { id: "m6",  group: "chairs", role: "Club Service", name: "", duty: "Birthdays, anniversaries, picnics, get-togethers and district events.", order: 6 },
      { id: "m7",  group: "chairs", role: "Membership Chair", name: "Abhishek Lawanis", duty: "Admission policy, new member proposals and resignations.", order: 7 },
      { id: "m8",  group: "chairs", role: "Rotary Foundation Chair", name: "", duty: "Raises and collects funds for The Rotary Foundation.", order: 8 },
      { id: "m9",  group: "chairs", role: "Service Projects", name: "", duty: "Community, vocational and international service projects.", order: 9 },
      { id: "m10", group: "chairs", role: "Youth Services", name: "Shweta Parab Naik", duty: "Rotaract and Interact clubs, youth festivals and competitions.", order: 10 },
      { id: "m11", group: "chairs", role: "Public Image", name: "Sandeep Morajkar", duty: "Press releases, media and the club's social media.", order: 11 }
    ].map(m => Object.assign({ photo: "", createdAt: now }, m)),
    suggestions: [],
    joinRequests: []
  };

  const DKEY = "rcb_preview_v4";
  let demo = null;
  function D() {
    if (demo) return demo;
    try { demo = JSON.parse(localStorage.getItem(DKEY)); } catch (e) { demo = null; }
    if (!demo) demo = JSON.parse(JSON.stringify(SEED));
    return demo;
  }
  function save() { try { localStorage.setItem(DKEY, JSON.stringify(demo)); } catch (e) { console.warn("Preview storage full", e); } }
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  /* ---------- Image helpers ---------- */
  function shrink(file, max, q) {
    return new Promise((res, rej) => {
      const img = new Image(); const u = URL.createObjectURL(file);
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(u);
        c.toBlob((b) => b ? res(b) : rej(new Error("Could not read image")), "image/jpeg", q);
      };
      img.onerror = () => rej(new Error("Not a valid image"));
      img.src = u;
    });
  }

  const api = {
    live: LIVE,
    seed: SEED,

    async list(col, opt) {
      const o = Object.assign({ by: "createdAt", dir: "desc" }, opt || {});
      if (LIVE) {
        const { fs, db } = await init();
        const snap = await fs.getDocs(fs.query(fs.collection(db, col), fs.orderBy(o.by, o.dir)));
        return snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
      }
      const arr = (D()[col] || []).slice();
      arr.sort((a, b) => (a[o.by] > b[o.by] ? 1 : a[o.by] < b[o.by] ? -1 : 0) * (o.dir === "desc" ? -1 : 1));
      return arr;
    },

    async add(col, data) {
      const doc = Object.assign({}, data, { createdAt: Date.now() });
      if (LIVE) {
        const { fs, db } = await init();
        return (await fs.addDoc(fs.collection(db, col), doc)).id;
      }
      const id = uid(); (D()[col] = D()[col] || []).push(Object.assign({ id }, doc)); save(); return id;
    },

    async update(col, id, data) {
      if (LIVE) { const { fs, db } = await init(); return fs.updateDoc(fs.doc(db, col, id), data); }
      const it = (D()[col] || []).find((x) => x.id === id); if (it) Object.assign(it, data); save();
    },

    async remove(col, id) {
      if (LIVE) { const { fs, db } = await init(); return fs.deleteDoc(fs.doc(db, col, id)); }
      D()[col] = (D()[col] || []).filter((x) => x.id !== id); save();
    },

    async getSettings() {
      if (LIVE) {
        const { fs, db } = await init();
        const s = await fs.getDoc(fs.doc(db, "settings", "site"));
        return Object.assign({}, SEED.settings, s.exists() ? s.data() : {});
      }
      return D().settings;
    },

    async saveSettings(data) {
      if (LIVE) { const { fs, db } = await init(); return fs.setDoc(fs.doc(db, "settings", "site"), data, { merge: true }); }
      D().settings = Object.assign(D().settings, data); save();
    },

    /* Live mode only: write starter settings/events/board once */
    async loadSeed(opts) {
      if (!LIVE) return;
      const o = opts || {};
      if (!o.boardOnly) await api.saveSettings(Object.assign({}, SEED.settings, { seeded: true }));
      else await api.saveSettings({ seeded: true });
      const [ev, mem] = await Promise.all([api.list("events"), api.list("members")]);
      if (!o.boardOnly && !ev.length) for (const e of SEED.events) { const c = Object.assign({}, e); delete c.id; await api.add("events", c); }
      if (!o.boardOnly) for (const col of ["leaders", "news"]) {
        const have = await api.list(col);
        if (!have.length) for (const e of SEED[col]) { const c = Object.assign({}, e); delete c.id; await api.add(col, c); }
      }
      // add any board roles that aren't there yet (matched by role name)
      const have = new Set(mem.map(m => (m.role || "").toLowerCase()));
      for (const m of SEED.members) if (!have.has(m.role.toLowerCase())) { const c = Object.assign({}, m); delete c.id; await api.add("members", c); }
    },

    /* Before "Load starter content" is run on the live site, show the
       starter board/events so the site never looks empty. */
    withSeed(S, E, M, L, N) {
      const fresh = LIVE && !(S && S.seeded), f = (x, k) => fresh && !(x && x.length) ? SEED[k] : (x || []);
      return { E: f(E, "events"), M: f(M, "members"), L: f(L, "leaders"), N: f(N, "news") };
    },

    /* Upload an image and return its URL. Cloudinary in live mode,
       compressed data-URL in preview mode. onProgress(0..1) */
    async upload(file, onProgress) {
      if (!LIVE || !CLD.cloudName) {
        const b = await shrink(file, 900, 0.7);
        return await new Promise((r) => { const fr = new FileReader(); fr.onload = () => { onProgress && onProgress(1); r(fr.result); }; fr.readAsDataURL(b); });
      }
      const blob = await shrink(file, 2000, 0.85);
      const fd = new FormData();
      fd.append("file", blob, (file.name || "photo").replace(/\.\w+$/, "") + ".jpg");
      fd.append("upload_preset", CLD.uploadPreset);
      fd.append("folder", "rotary-bhatagram");
      return await new Promise((res, rej) => {
        const x = new XMLHttpRequest();
        x.open("POST", "https://api.cloudinary.com/v1_1/" + CLD.cloudName + "/image/upload");
        x.upload.onprogress = (e) => e.lengthComputable && onProgress && onProgress(e.loaded / e.total);
        x.onload = () => { try { const j = JSON.parse(x.responseText); j.secure_url ? res(j.secure_url) : rej(new Error(j.error ? j.error.message : "Upload failed")); } catch (e) { rej(e); } };
        x.onerror = () => rej(new Error("Network error during upload"));
        x.send(fd);
      });
    },

    /* Resize on the fly for Cloudinary URLs (no-op for others) */
    img(url, w) {
      if (!url || url.indexOf("res.cloudinary.com") < 0) return url;
      return url.replace("/upload/", "/upload/f_auto,q_auto,c_limit,w_" + (w || 1200) + "/");
    },

    auth: {
      async onChange(cb) {
        if (LIVE) { const { au, auth } = await init(); au.onAuthStateChanged(auth, cb); return; }
        cb(sessionStorage.getItem("rcb_demo_admin") ? { email: "preview@admin" } : null);
      },
      async signIn(email, pw) {
        if (LIVE) { const { au, auth } = await init(); return au.signInWithEmailAndPassword(auth, email, pw); }
        if (pw !== "demo") throw new Error("Preview mode: use any email with the password demo");
        sessionStorage.setItem("rcb_demo_admin", "1");
      },
      async signOut() {
        if (LIVE) { const { au, auth } = await init(); return au.signOut(auth); }
        sessionStorage.removeItem("rcb_demo_admin");
      },
      async reset(email) {
        if (LIVE) { const { au, auth } = await init(); return au.sendPasswordResetEmail(auth, email); }
      }
    },

    resetDemo() { localStorage.removeItem(DKEY); demo = null; }
  };

  window.RCData = api;
})();
