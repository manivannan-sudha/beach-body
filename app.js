(function () {
  "use strict";

  // ---------- small helpers ----------
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = (v) => { if (v == null || v === "") return null; const n = parseFloat(String(v).replace(",", ".")); return isFinite(n) ? n : null; };
  const r0 = (n) => Math.round(n);
  const r1 = (n) => Math.round(n * 10) / 10;
  const fmt = (n, d = 0) => (n == null || !isFinite(n) ? "–" : Number(n).toLocaleString("en-IN", { maximumFractionDigits: d, minimumFractionDigits: 0 }));
  const signed = (v, d = 1) => (v > 0 ? "+" : v < 0 ? "−" : "±") + fmt(Math.abs(v), d);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
  function deepMerge(a, b) {
    const out = isObj(a) ? Object.assign({}, a) : {};
    for (const k of Object.keys(b)) {
      if (b[k] === undefined) continue;
      if (b[k] === null) { delete out[k]; continue; }
      out[k] = isObj(b[k]) ? deepMerge(isObj(out[k]) ? out[k] : {}, b[k]) : b[k];
    }
    return out;
  }
  const safeUrl = (u) => (/^https:\/\/[^\s"'<>]+$/i.test(String(u || "")) ? u : "#");

  const NK = window.NUTRIENT_KEYS;
  const zeroN = () => Object.fromEntries(NK.map((k) => [k, 0]));
  const scaleN = (n, f) => Object.fromEntries(NK.map((k) => [k, (Number(n && n[k]) || 0) * f]));
  const addN = (a, b) => { for (const k of NK) a[k] += Number(b && b[k]) || 0; return a; };
  const roundN = (n) => Object.fromEntries(NK.map((k) => [k, r1(Number(n && n[k]) || 0)]));

  // ---------- dates ----------
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseISO = (s) => { const [y, m, d] = String(s).split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parseISO(s); d.setDate(d.getDate() + n); return iso(d); };
  const today = () => iso(new Date());
  // Weeks start on Sunday.
  const dow = (s) => parseISO(s).getDay(); // Sunday = 0
  const weekStartOf = (s) => addDays(s, -dow(s));
  const fmtDate = (s, o) => parseISO(s).toLocaleDateString("en-IN", o || { weekday: "short", day: "numeric", month: "short" });
  const DOW_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const DOW_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

  // ---------- constants ----------
  const MICROS = [
    { k: "fib", label: "Fiber", unit: "g", min: 35 },
    { k: "sug", label: "Sugar", unit: "g", max: 50 },
    { k: "sf", label: "Saturated fat", unit: "g", max: 22 },
    { k: "na", label: "Sodium", unit: "mg", max: 2300 },
    { k: "k", label: "Potassium", unit: "mg", min: 3500 },
    { k: "ca", label: "Calcium", unit: "mg", min: 1000 },
    { k: "fe", label: "Iron", unit: "mg", min: 18 },
    { k: "mg", label: "Magnesium", unit: "mg", min: 400 },
    { k: "zn", label: "Zinc", unit: "mg", min: 14 },
    { k: "vc", label: "Vitamin C", unit: "mg", min: 90 },
    { k: "b12", label: "Vitamin B12", unit: "mcg", min: 2.4 },
    { k: "vd", label: "Vitamin D", unit: "mcg", min: 15 },
  ];
  const MEALS = [["breakfast", "Breakfast"], ["lunch", "Lunch"], ["snack", "Snacks"], ["dinner", "Dinner"], ["other", "Other"]];
  const mealLabel = (k) => (MEALS.find((m) => m[0] === k) || [k, "Other"])[1];
  const CARDIO = [["run", "Run"], ["walk", "Walk"], ["cycle", "Indoor cycling"], ["swim", "Swim"], ["football", "Football"], ["other", "Other"]];
  const cardioLabel = (k) => (CARDIO.find((c) => c[0] === k) || [k, cap(String(k || "Cardio"))])[1];
  const MEAS = [
    { k: "waist", l: "Waist (navel)" }, { k: "chest", l: "Chest" }, { k: "shoulders", l: "Shoulders" },
    { k: "arm", l: "Arm (flexed)" }, { k: "thigh", l: "Thigh" }, { k: "hips", l: "Hips" },
    { k: "calf", l: "Calf" }, { k: "neck", l: "Neck" }, { k: "bf", l: "Body fat", u: "%" },
  ];
  const POSES = ["front", "side", "back"];
  // Starting numbers the user gave on 18 Oct 2026: 80 kg, 177 cm, 2,200 kcal. Settings overrides them.
  const DEFAULT_PROFILE = { name: "", sex: "male", age: 24, heightCm: 177, weightKg: 80, goalKg: null, activity: 1.55, deficit: 20, proteinMax: 120, stepGoal: 6000, override: { kcal: 2200 } };

  const svg = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const I = {
    left: svg('<path d="M15 6l-6 6 6 6"/>'),
    right: svg('<path d="M9 6l6 6-6 6"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
    camera: svg('<path d="M4 8h3l2-2.5h6L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),
    run: svg('<circle cx="14.5" cy="4.5" r="1.8"/><path d="M8 21l3-6 3 2v4M6 12l3-4h4l2 3 3 1M11 15l-1.5-4"/>'),
    check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    trash: svg('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
    spark: svg('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>'),
  };

  // ---------- state ----------
  const S = {
    col: { days: {}, workouts: {}, measures: {}, config: {} },
    loaded: false,
    meta: {},
    persisted: false,
    ui: { tab: "today", date: today(), trainSub: "week", trainWeek: 0, bodyDate: today(), cmpA: null, cmpB: null, cmpPose: "front", review: null },
    sheet: null,
  };
  const prof = () => Object.assign({}, DEFAULT_PROFILE, S.col.config.profile || {});
  const myFoods = () => (S.col.config.myfoods && S.col.config.myfoods.items) || {};
  const day = (d) => S.col.days[d] || {};

  // ---------- storage: IndexedDB on this device ----------
  const IDB = {
    db: null,
    open() {
      return new Promise((res, rej) => {
        const r = indexedDB.open("beachbody", 1);
        r.onupgradeneeded = () => { const d = r.result; ["docs", "photos", "meta"].forEach((s) => { if (!d.objectStoreNames.contains(s)) d.createObjectStore(s); }); };
        r.onsuccess = () => { this.db = r.result; res(this.db); };
        r.onerror = () => rej(r.error);
        r.onblocked = () => rej(new Error("Storage is blocked by another open copy of the app"));
      });
    },
    run(store, mode, fn) {
      return new Promise((res, rej) => {
        const t = this.db.transaction(store, mode);
        const r = fn(t.objectStore(store));
        t.oncomplete = () => res(r ? r.result : undefined);
        t.onerror = () => rej(t.error);
        t.onabort = () => rej(t.error || new Error("Storage write aborted"));
      });
    },
    get(store, key) { return this.run(store, "readonly", (s) => s.get(key)); },
    put(store, key, val) { return this.run(store, "readwrite", (s) => s.put(val, key)); },
    del(store, key) { return this.run(store, "readwrite", (s) => s.delete(key)); },
    keys(store) { return this.run(store, "readonly", (s) => s.getAllKeys()); },
    values(store) { return this.run(store, "readonly", (s) => s.getAll()); },
  };

  const Store = {
    mode: "loading",
    async init() {
      try {
        await IDB.open();
        const [keys, vals] = await Promise.all([IDB.keys("docs"), IDB.values("docs")]);
        keys.forEach((k, i) => { const j = String(k).indexOf("/"); const c = k.slice(0, j); if (S.col[c]) S.col[c][k.slice(j + 1)] = vals[i]; });
        for (const k of await IDB.keys("meta")) { if (k !== "indb") S.meta[k] = await IDB.get("meta", k); }
        const indb = await IDB.get("meta", "indb");
        if (indb && Array.isArray(indb.foods)) setIndbFoods(indb.foods, indb.at);
        this.mode = "device";
      } catch (e) {
        console.warn("storage unavailable", e);
        this.mode = "memory";
      }
      try { S.persisted = !!(navigator.storage && navigator.storage.persisted && (await navigator.storage.persisted())); } catch (e) { S.persisted = false; }
      S.loaded = true;
      scheduleRender();
    },
    write(col, id) {
      if (this.mode !== "device") return Promise.resolve(false);
      const v = S.col[col][id], key = col + "/" + id;
      return (v === undefined ? IDB.del("docs", key) : IDB.put("docs", key, v)).then(() => { askPersist(); return true; }, (e) => { saveError(e); return false; });
    },
    patch(col, id, patch) { S.col[col][id] = deepMerge(S.col[col][id] || {}, patch); scheduleRender(); return this.write(col, id); },
    put(col, id, data) { S.col[col][id] = data; scheduleRender(); return this.write(col, id); },
    del(col, id) { delete S.col[col][id]; scheduleRender(); return this.write(col, id); },
    setMeta(key, val) {
      if (val == null) delete S.meta[key]; else S.meta[key] = val;
      if (this.mode !== "device") return Promise.resolve();
      return (val == null ? IDB.del("meta", key) : IDB.put("meta", key, val)).catch(saveError);
    },
  };
  function saveError(e) {
    if (e && e.name === "QuotaExceededError") toast("Your phone is out of space for this app. Free some storage, then try again.");
    else toast("Couldn't save on this device. Try again.");
    console.warn("save failed", e);
  }
  // Ask the browser not to clear this app's data when the phone runs low on space.
  let persistAsked = false;
  function askPersist() {
    if (persistAsked || S.persisted || !navigator.storage || !navigator.storage.persist) return;
    persistAsked = true;
    navigator.storage.persist().then((ok) => { S.persisted = !!ok; scheduleRender(); }, () => {});
  }
  const patchDay = (d, patch) => Store.patch("days", d, Object.assign({ date: d }, patch));

  // ---------- progress photos: blobs in IndexedDB, shown through object URLs ----------
  const Photos = {
    urls: new Map(),
    loading: new Set(),
    async save(blob) {
      const id = "ph-" + uid();
      if (Store.mode === "device") await IDB.put("photos", id, blob);
      else this.urls.set(id, URL.createObjectURL(blob));
      return id;
    },
    url(v) {
      if (!v) return "";
      if (String(v).startsWith("data:")) return v;
      const u = this.urls.get(v);
      if (u) return u;
      if (Store.mode === "device" && !this.loading.has(v)) {
        this.loading.add(v);
        IDB.get("photos", v).then((b) => { if (b) { this.urls.set(v, URL.createObjectURL(b)); scheduleRender(); } }, () => {});
      }
      return "";
    },
    async blob(v) {
      if (String(v).startsWith("data:")) return (await fetch(v)).blob();
      return Store.mode === "device" ? IDB.get("photos", v) : null;
    },
    async remove(v) {
      const u = this.urls.get(v);
      if (u) URL.revokeObjectURL(u);
      this.urls.delete(v);
      if (Store.mode === "device") await IDB.del("photos", v).catch(() => {});
    },
  };

  // ---------- Indian Nutrient Databank, downloaded once and kept on the device ----------
  let INDB_FOODS = [];
  function setIndbFoods(rows, at) {
    INDB_FOODS = rows.map((r) => {
      const per100 = {};
      NK.forEach((k, j) => { per100[k] = r[4 + j]; });
      return { id: "i" + r[0], name: r[1], serving: { label: r[2], g: r[3] }, per100, aliases: "", indb: true };
    });
    S.indbAt = at || null;
  }
  async function downloadIndb() {
    if (S.indbBusy) return;
    S.indbBusy = true; S.indbError = null;
    if (S.sheet && S.sheet.type === "settings") renderSheet();
    try {
      const { foods } = await window.INDB.download();
      const at = new Date().toISOString();
      setIndbFoods(foods, at);
      if (Store.mode === "device") await IDB.put("meta", "indb", { at, foods });
      toast("Indian dish database is ready for search");
    } catch (e) {
      console.warn("indb", e);
      S.indbError = navigator.onLine === false ? "You're offline. Connect and try again." : "Couldn't download the dish database. Try again later.";
    }
    S.indbBusy = false;
    if (S.sheet) renderSheet();
    scheduleRender();
  }

  // ---------- Claude, through the official Anthropic SDK, with the key kept on this device ----------
  const SDK_URL = "https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.131.0/+esm";
  // Always the fastest, cheapest Claude model.
  const MODEL = "claude-haiku-5-5";
  const aiOn = () => !!S.meta.apiKey;
  const AI = {
    Anthropic: null,
    client: null,
    clientKey: null,
    async get() {
      if (!S.meta.apiKey) throw { code: "no_key" };
      if (!this.Anthropic) this.Anthropic = (await import(SDK_URL)).default;
      if (!this.client || this.clientKey !== S.meta.apiKey) {
        this.client = new this.Anthropic({ apiKey: S.meta.apiKey, dangerouslyAllowBrowser: true, maxRetries: 1 });
        this.clientKey = S.meta.apiKey;
      }
      return this.client;
    },
    // If Anthropic rejects structured output with a 400, the call is retried once asking for plain JSON
    // (rejected requests are not billed) and structured output stays off for the rest of the session.
    isBadRequest(e) { return !!(this.Anthropic && e instanceof this.Anthropic.BadRequestError); },
    async create(body, signal) {
      const client = await this.get();
      return client.messages.create(Object.assign({ model: MODEL, max_tokens: 16000 }, body), { signal });
    },
    text(resp) {
      if (resp.stop_reason === "refusal") throw { code: "refused" };
      if (resp.stop_reason === "max_tokens") throw { code: "truncated" };
      return resp.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    },
    async json(prompt, schema, opts = {}) {
      const content = [];
      for (const img of opts.images || []) {
        const type = /^image\/(jpeg|png|gif|webp)$/.test(img.type) ? img.type : "image/jpeg";
        content.push({ type: "image", source: { type: "base64", media_type: type, data: await blobToBase64(img) } });
      }
      const effort = opts.effort || "low";
      if (!this.noFormat) {
        try {
          const resp = await this.create({ output_config: { effort, format: { type: "json_schema", schema } }, messages: [{ role: "user", content: content.concat({ type: "text", text: prompt }) }] }, opts.signal);
          return JSON.parse(this.text(resp));
        } catch (e) {
          if (!this.isBadRequest(e)) throw e;
          console.warn("Structured output rejected; asking for plain JSON instead:", e.message);
          this.noFormat = true;
        }
      }
      const ask = prompt + "\n\nReply with only one JSON object that matches this JSON Schema, and no other text:\n" + JSON.stringify(schema);
      const raw = this.text(await this.create({ output_config: { effort }, messages: [{ role: "user", content: content.concat({ type: "text", text: ask }) }] }, opts.signal));
      return JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));
    },
    async write(prompt, opts = {}) {
      const resp = await this.create({ output_config: { effort: opts.effort || "low" }, messages: [{ role: "user", content: prompt }] }, opts.signal);
      return this.text(resp);
    },
  };
  const FOOD_SCHEMA = {
    type: "object", additionalProperties: false, required: ["items", "notes"],
    properties: {
      items: {
        type: "array",
        items: {
          type: "object", additionalProperties: false, required: ["name", "grams"].concat(NK, ["confidence"]),
          properties: Object.assign({ name: { type: "string" }, grams: { type: "number" }, confidence: { type: "string", enum: ["high", "medium", "low"] } }, Object.fromEntries(NK.map((k) => [k, { type: "number" }]))),
        },
      },
      notes: { type: "string" },
    },
  };
  const WORKOUT_SCHEMA = {
    type: "object", additionalProperties: false, required: ["title", "date", "durationMin", "exercises"],
    properties: {
      title: { type: "string" }, date: { type: "string" }, durationMin: { type: "number" },
      exercises: {
        type: "array",
        items: {
          type: "object", additionalProperties: false, required: ["name", "sets"],
          properties: {
            name: { type: "string" },
            sets: { type: "array", items: { type: "object", additionalProperties: false, required: ["kg", "reps", "sec"], properties: { kg: { type: "number" }, reps: { type: "number" }, sec: { type: "number" } } } },
          },
        },
      },
    },
  };
  // Returns "" when the person stopped the request themselves.
  function aiError(e) {
    const A = AI.Anthropic;
    if (e && e.code === "no_key") return "Add your Anthropic API key in Settings to use Claude's estimates.";
    if (e && e.code === "refused") return "Claude declined this one. Describe the food in words instead.";
    if (e && e.code === "truncated") return "Claude's answer was cut off. Try fewer items at once.";
    if (e instanceof SyntaxError) return "Claude's answer came back unreadable. Try again.";
    if (A) {
      if (e instanceof A.APIUserAbortError) return "";
      if (e instanceof A.AuthenticationError) return "Anthropic rejected the API key. Check it in Settings.";
      if (A.PermissionDeniedError && e instanceof A.PermissionDeniedError) return "This API key can't use that model. Pick another model in Settings.";
      if (A.NotFoundError && e instanceof A.NotFoundError) return "That model isn't available to this API key. Pick another model in Settings.";
      if (e instanceof A.RateLimitError) return "Rate or spend limit reached. Wait a minute, or check your Anthropic console.";
      if (e instanceof A.BadRequestError) return "Anthropic rejected the request: " + String(e.message || "").slice(0, 180);
      if (e instanceof A.APIConnectionError) return navigator.onLine === false ? "You're offline. Food search works offline; estimates need a connection." : "Couldn't reach Anthropic. Try again.";
      if (e instanceof A.APIError) return `Anthropic returned an error (${e.status || "unknown"}). Try again.`;
    }
    if (e && e.name === "AbortError") return "";
    return navigator.onLine === false ? "You're offline. Estimates need a connection." : "Couldn't load or reach Claude. Try again.";
  }

  // ---------- domain ----------
  function foodsOf(date) {
    const f = day(date).foods || {};
    return Object.keys(f).filter((id) => f[id] && f[id].n).map((id) => Object.assign({ id }, f[id])).sort((a, b) => (a.t || 0) - (b.t || 0));
  }
  function totalsOf(date) { const t = zeroN(); foodsOf(date).forEach((e) => addN(t, e.n)); return t; }
  function cardioOf(date) {
    const c = day(date).cardio || {};
    return Object.keys(c).filter((id) => c[id]).map((id) => Object.assign({ id, date }, c[id])).sort((a, b) => (a.t || 0) - (b.t || 0));
  }
  function workoutsOn(date) {
    return Object.keys(S.col.workouts).filter((id) => S.col.workouts[id] && S.col.workouts[id].date === date).map((id) => Object.assign({ id }, S.col.workouts[id]));
  }
  const gymDone = (d) => workoutsOn(d).length > 0 || !!(day(d).checks && day(d).checks.gym);

  function weights() {
    return Object.values(S.col.days).filter((d) => d && d.date && num(d.weight)).map((d) => ({ date: d.date, v: num(d.weight) })).sort((a, b) => (a.date < b.date ? -1 : 1));
  }
  function avgWeight(end, span = 7) {
    const from = addDays(end, -(span - 1));
    const ws = weights().filter((w) => w.date >= from && w.date <= end);
    return ws.length ? ws.reduce((s, w) => s + w.v, 0) / ws.length : null;
  }
  function currentWeight() { const ws = weights(); return ws.length ? avgWeight(ws[ws.length - 1].date) : null; }

  function targets() {
    const p = prof();
    const w = currentWeight() || p.weightKg;
    let t = { kcal: 2100, p: 120, c: 225, f: 60, fib: 35, estimated: true };
    if (w && p.heightCm && p.age) {
      const bmr = 10 * w + 6.25 * p.heightCm - 5 * p.age + (p.sex === "female" ? -161 : 5);
      const tdee = bmr * (p.activity || 1.55);
      let kcal = Math.round((tdee * (1 - (p.deficit || 20) / 100)) / 50) * 50;
      kcal = Math.max(kcal, Math.round((bmr * 1.1) / 50) * 50);
      const prot = Math.min(p.proteinMax || 120, Math.max(90, Math.round(w * 1.8)));
      const fat = Math.max(45, Math.round(w * 0.8));
      const carbs = Math.max(100, Math.round((kcal - prot * 4 - fat * 9) / 4));
      t = { kcal, p: prot, c: carbs, f: fat, fib: 35, bmr: Math.round(bmr), tdee: Math.round(tdee), estimated: false };
    }
    const o = p.override || {};
    ["kcal", "p", "c", "f"].forEach((k) => { if (num(o[k])) t[k] = num(o[k]); });
    return t;
  }

  const stepGoal = () => num(prof().stepGoal) || 6000;

  function rateCheck() {
    const ws = weights();
    if (ws.length < 4) return { cls: "", short: "not enough weigh-ins yet", msg: "Weigh in every morning after the toilet, before food. After two weeks the weekly rate check shows up here." };
    const last = ws[ws.length - 1].date;
    const a = avgWeight(last), b = avgWeight(addDays(last, -7));
    if (b == null) return { cls: "", short: "one week of data so far", msg: "One more week of weigh-ins and this compares your weekly averages." };
    const pct = ((a - b) / b) * 100;
    const short = `${signed(a - b, 1)} kg (${signed(pct, 1)}%) week on week`;
    if (pct < -1) return { cls: "warn", short, msg: `Down ${fmt(-pct, 1)}% this week. That is faster than you need. Add about 150 kcal a day, mostly carbs around training, so you keep muscle.` };
    if (pct <= -0.4) return { cls: "good", short, msg: `Down ${fmt(-pct, 1)}% this week. Right in the 0.4–1% window. Change nothing.` };
    if (pct < 0.2) return { cls: "warn", short, msg: "Roughly flat this week. If it stays flat for two weeks, cut 150 kcal a day or add 2,000 steps. Weeks 1–2 back in the gym often hold extra water, so give it time." };
    return { cls: "bad", short, msg: "Up this week. Check portion weights and cooking oil first. If it rises again next week, cut 150 kcal a day." };
  }

  // ---------- rendering ----------
  let renderQueued = false, renderDeferred = false;
  function scheduleRender() {
    if (renderQueued) return;
    renderQueued = true;
    setTimeout(() => {
      renderQueued = false;
      const a = document.activeElement;
      if (a && a.closest && a.closest("#view") && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) { renderDeferred = true; return; }
      render();
    }, 0);
  }
  document.addEventListener("focusout", () => { if (renderDeferred) { renderDeferred = false; setTimeout(scheduleRender, 0); } });

  function render() {
    const sync = $("#sync");
    const mode = Store.mode;
    sync.className = "sync " + (mode === "device" ? (S.persisted ? "cloud" : "local") : mode === "memory" ? "bad" : "");
    sync.textContent = mode === "device" ? "On this phone" : mode === "memory" ? "Not saving" : "Loading";
    sync.title = mode === "device" ? (S.persisted ? "Saved on this device, protected from automatic clean-up" : "Saved on this device. Download backups now and then.") : "";
    $$(".tab").forEach((b) => b.setAttribute("aria-current", b.dataset.tab === S.ui.tab ? "page" : "false"));
    syncFab();
    const tab = S.ui.tab;
    const html = tab === "train" ? viewTrain() : tab === "body" ? viewBody() : tab === "trends" ? viewTrends() : viewToday();
    $("#view").innerHTML = (mode === "memory" ? `<p class="note warn">This browser is blocking storage (private mode or blocked site data), so nothing you log will be kept. Open the app in a normal Chrome window.</p>` : "") + html;
    bindCharts();
  }

  // ----- Today -----
  function viewToday() {
    const d = S.ui.date, t = targets(), tot = totalsOf(d);
    const isToday = d === today();
    return `
    <div class="datebar">
      <button class="icon-btn" data-act="day" data-n="-1" aria-label="Previous day">${I.left}</button>
      <button class="datebtn" data-act="day" data-n="0" title="Jump to today">${isToday ? "<span>Today</span>" : ""}${esc(fmtDate(d, { weekday: "short", day: "numeric", month: "short" }))}</button>
      <button class="icon-btn" data-act="day" data-n="1" aria-label="Next day">${I.right}</button>
    </div>
    ${S.loaded && t.estimated ? `<div class="note warn spread"><span>Add your height and weight to get your own calorie and macro targets. Until then the log uses 2,100 kcal and 120 g protein.</span><button class="btn small primary" data-act="settings">Set targets</button></div>` : ""}
    <section class="hero" aria-label="Calories and macros">
      ${dial(tot.kcal, t.kcal)}
      <div class="macros">
        ${macroRow("Protein", tot.p, t.p, "var(--c-p)")}
        ${macroRow("Carbs", tot.c, t.c, "var(--c-c)")}
        ${macroRow("Fat", tot.f, t.f, "var(--c-f)")}
        ${macroRow("Fiber", tot.fib, t.fib, "var(--c-fib)")}
      </div>
    </section>
    ${trainingCard(d)}
    ${quickCard(d)}
    ${foodCard(d)}
    ${microCard(tot, "Micronutrients", isToday ? "Today" : fmtDate(d))}`;
  }

  function dial(eaten, target) {
    const frac = target > 0 ? eaten / target : 0;
    const over = eaten > target;
    const shown = Math.min(frac, 1);
    const R = 80, C = 2 * Math.PI * R;
    let ticks = "";
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * 2 * Math.PI - Math.PI / 2;
      const long = i % 5 === 0;
      const ra = long ? 88 : 92, rb = 98;
      const on = shown > 0 && i / 60 < shown;
      ticks += `<line class="tick${on ? (over ? " over" : " on") : ""}" x1="${(100 + ra * Math.cos(a)).toFixed(2)}" y1="${(100 + ra * Math.sin(a)).toFixed(2)}" x2="${(100 + rb * Math.cos(a)).toFixed(2)}" y2="${(100 + rb * Math.sin(a)).toFixed(2)}" stroke-width="${long ? 2.2 : 1.2}"/>`;
    }
    const ha = shown * 2 * Math.PI - Math.PI / 2;
    const left = Math.round(target - eaten);
    return `<div class="dial"><svg viewBox="0 0 200 200" role="img" aria-label="${fmt(eaten)} of ${fmt(target)} kcal eaten">
      ${ticks}
      <circle class="track" cx="100" cy="100" r="${R}" fill="none" stroke-width="9"/>
      ${shown > 0 ? `<circle class="arc${over ? " over" : ""}" cx="100" cy="100" r="${R}" fill="none" stroke-width="9" stroke-linecap="round" stroke-dasharray="${(C * shown).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 100 100)"/>` : ""}
      <circle class="hand" cx="${(100 + R * Math.cos(ha)).toFixed(1)}" cy="${(100 + R * Math.sin(ha)).toFixed(1)}" r="6.5" style="stroke:var(--surface)" stroke-width="2.5"/>
      <text class="lbl" x="100" y="72" text-anchor="middle">${over ? "kcal over" : "kcal left"}</text>
      <text class="big" x="100" y="115" text-anchor="middle">${fmt(Math.abs(left))}</text>
      <text class="sub" x="100" y="139" text-anchor="middle">${fmt(eaten)} / ${fmt(target)}</text>
    </svg></div>`;
  }

  function macroRow(label, v, t, color) {
    const pct = t > 0 ? Math.min(100, (v / t) * 100) : 0;
    return `<div class="mrow"><div class="mrow-top"><span class="mlabel"><i style="background:${color}"></i>${label}</span><span class="mval"><b>${fmt(v)}</b> / ${fmt(t)} g</span></div><div class="track"><div class="fill" style="width:${pct.toFixed(1)}%;background:${color}"></div></div></div>`;
  }

  // What was trained on this day: Hevy workouts and cardio. No plan is set for now.
  function trainingCard(d) {
    const wo = workoutsOn(d), checks = day(d).checks || {};
    const gymChip = wo.length ? `<span class="chip good">${I.check}${esc(wo.map((w) => w.title || "Workout").join(", "))}</span>`
      : checks.gym ? `<button class="chip good" data-act="check" data-k="gym">${I.check}Gym done</button>`
      : `<button class="chip" data-act="check" data-k="gym">Mark gym done</button>`;
    return `<section class="card">
      <div class="card-h"><h2>Training</h2><span class="eyebrow">${DOW_LONG[dow(d)]}</span></div>
      ${wo.length || cardioOf(d).length ? "" : `<p class="muted">Nothing logged yet. Paste a Hevy workout or log a walk, run or ride.</p>`}
      ${cardioList(d)}
      <div class="spread"><div class="chips">${gymChip}</div>
        <div class="row"><button class="btn small" data-act="hevy">Paste from Hevy</button><button class="btn small" data-act="cardio">Log cardio</button></div>
      </div>
    </section>`;
  }

  function paceText(c) {
    if (!(c.km > 0 && c.min > 0) || !["run", "walk"].includes(c.type)) return "";
    const p = c.min / c.km, m = Math.floor(p), s = Math.round((p - m) * 60);
    return `${m}:${pad(s === 60 ? 0 : s)} /km`;
  }
  function cardioList(d) {
    const list = cardioOf(d);
    if (!list.length) return "";
    return `<ul class="items">${list.map((c) => `<li class="item" style="cursor:default"><div class="nm">${esc(cardioLabel(c.type))}<small>${[c.min ? fmt(c.min) + " min" : "", c.km ? fmt(c.km, 2) + " km" : "", paceText(c), c.rpe ? "effort " + c.rpe + "/10" : "", c.note ? esc(c.note) : ""].filter(Boolean).join(" · ")}</small></div><span></span><button class="icon-btn" data-act="delcardio" data-date="${d}" data-id="${esc(c.id)}" aria-label="Delete ${esc(cardioLabel(c.type))}">${I.trash}</button></li>`).join("")}</ul>`;
  }

  function quickCard(d) {
    const dd = day(d);
    return `<section class="card"><div class="quick">
      <label class="q" for="q-weight">Weight<div class="inp-u"><input id="q-weight" type="number" inputmode="decimal" step="0.1" min="20" max="250" data-field="weight" value="${dd.weight == null ? "" : dd.weight}" placeholder="–"><em>kg</em></div></label>
      <label class="q" for="q-steps"><span>Steps <small>goal ${fmt(stepGoal())}</small></span><input id="q-steps" type="number" inputmode="numeric" step="100" min="0" data-field="steps" value="${dd.steps == null ? "" : dd.steps}" placeholder="–"></label>
      <div class="q"><span>Water <small>goal 3.5 L</small></span><div class="water"><button data-act="water" data-n="-250" aria-label="Remove 250 ml">−</button><b>${fmt((dd.water || 0) / 1000, 2)} L</b><button data-act="water" data-n="250" aria-label="Add 250 ml">+</button></div></div>
      <label class="q" for="q-sleep">Sleep<div class="inp-u"><input id="q-sleep" type="number" inputmode="decimal" step="0.5" min="0" max="16" data-field="sleep" value="${dd.sleep == null ? "" : dd.sleep}" placeholder="–"><em>h</em></div></label>
    </div></section>`;
  }

  function guessMeal() {
    if (S.ui.date !== today()) return "lunch";
    const h = new Date().getHours() + new Date().getMinutes() / 60;
    return h < 11 ? "breakfast" : h < 15.5 ? "lunch" : h < 19 ? "snack" : "dinner";
  }

  function srcLabel(src) { return { ai: "Claude estimate", claude: "Logged by Claude", manual: "Manual", mine: "My food" }[src] || ""; }
  function itemRow(e) {
    const src = srcLabel(e.src);
    return `<li class="item" data-act="entry" data-id="${esc(e.id)}" role="button" tabindex="0"><div class="nm">${esc(e.name)}<small>${fmt(e.g)} g${src ? " · " + src : ""}</small></div><div class="v">${fmt(e.n.kcal)}<small>kcal</small></div><div class="v">${fmt(e.n.p)}<small>prot</small></div></li>`;
  }

  function foodCard(d) {
    const items = foodsOf(d);
    const yItems = foodsOf(addDays(d, -1));
    return `<section class="card"><div class="card-h"><h2>Food</h2><div class="row"><button class="btn small" data-act="guide">Food guide</button><button class="btn small primary" data-act="addfood">${I.plus}Add food</button></div></div>
    ${MEALS.map(([k, label]) => {
      const list = items.filter((e) => (e.meal || "other") === k);
      if (k === "other" && !list.length) return "";
      const sum = list.reduce((a, e) => addN(a, e.n), zeroN());
      const canCopy = !list.length && yItems.some((e) => e.meal === k);
      return `<div class="meal"><div class="meal-h"><h3>${label}</h3><span class="sum">${list.length ? `${fmt(sum.kcal)} kcal · ${fmt(sum.p)} g protein` : ""}</span>
        ${canCopy ? `<button class="link" data-act="copymeal" data-meal="${k}">Same as yesterday</button>` : ""}
        ${list.length ? `<button class="link" data-act="savemeal-open" data-meal="${k}">Save meal</button>` : ""}
        <button class="icon-btn" data-act="addfood" data-meal="${k}" aria-label="Add to ${label}">${I.plus}</button></div>
        ${list.length ? `<ul class="items">${list.map(itemRow).join("")}</ul>` : ""}
      </div>`;
    }).join("")}
    ${items.length ? "" : `<p class="empty">Nothing logged yet. Snap a photo of your plate and Claude estimates it, or search the Indian food list.</p>`}
    </section>`;
  }

  const fmtMicro = (v) => (Math.abs(v) < 10 ? fmt(v, 1) : fmt(v));
  function microCard(tot, title, sub) {
    return `<section class="card"><div class="card-h"><h2>${title}</h2><small>${esc(sub)}</small></div><div class="micros">${MICROS.map((m) => {
      const v = tot[m.k] || 0, tg = m.min || m.max, pct = tg ? (v / tg) * 100 : 0;
      const color = m.max ? (pct > 100 ? "var(--bad)" : pct > 85 ? "var(--warn)" : "var(--dot)") : pct >= 100 ? "var(--good)" : "var(--accent)";
      return `<div class="mi"><div class="mi-top"><span>${m.label}</span><span>${fmtMicro(v)} / ${m.max ? "≤ " : ""}${fmtMicro(tg)} ${m.unit}</span></div><div class="track"><div class="fill" style="width:${Math.min(100, pct).toFixed(1)}%;background:${color}"></div></div></div>`;
    }).join("")}</div><small>Daily values for an adult man (ICMR and US DRI). Sugar, saturated fat and sodium are upper limits. All numbers are estimates.</small></section>`;
  }

  // ----- Train -----
  function viewTrain() {
    const tabs = [["week", "Week"], ["hevy", "Workouts"], ["cardio", "Cardio"]];
    const sub = tabs.some(([k]) => k === S.ui.trainSub) ? S.ui.trainSub : "week";
    return `<div class="seg" role="group" aria-label="Training views">${tabs.map(([k, l]) => `<button data-act="trainsub" data-sub="${k}" aria-pressed="${sub === k}">${l}</button>`).join("")}</div>
    ${sub === "hevy" ? trainHevy() : sub === "cardio" ? trainCardio() : trainWeek()}`;
  }

  // A Sunday-to-Saturday week of what was logged: Hevy workouts (or "gym done") and cardio.
  function trainWeek() {
    const sun = addDays(weekStartOf(today()), S.ui.trainWeek * 7);
    const days = Array.from({ length: 7 }, (_, i) => addDays(sun, i));
    const label = S.ui.trainWeek === 0 ? "This week" : S.ui.trainWeek === -1 ? "Last week" : S.ui.trainWeek === 1 ? "Next week" : "Week of " + fmtDate(sun, { day: "numeric", month: "short" });
    let gymD = 0, cardioD = 0, cardioMin = 0;
    const cells = days.map((d) => {
      const gd = gymDone(d), cd = cardioOf(d);
      if (gd) gymD++;
      if (cd.length) cardioD++;
      cd.forEach((c) => { cardioMin += Number(c.min) || 0; });
      const tag = [gd ? "Gym" : "", cd.length ? cardioLabel(cd[0].type).split(" ")[0] : ""].filter(Boolean).join(" + ") || (d > today() ? "" : "Rest");
      return { d, gd, cd, tag };
    });
    const steps = days.map((d) => day(d).steps).filter((v) => v > 0);
    return `<section class="card">
      <div class="spread"><div class="row"><button class="icon-btn" data-act="trainweek" data-n="-1" aria-label="Previous week">${I.left}</button><h2>${esc(label)}</h2><button class="icon-btn" data-act="trainweek" data-n="1" aria-label="Next week">${I.right}</button></div>
      ${S.ui.trainWeek ? `<button class="link" data-act="trainweek" data-n="0">This week</button>` : ""}</div>
      <small>${esc(fmtDate(sun, { weekday: "short", day: "numeric", month: "short" }))} – ${esc(fmtDate(days[6], { weekday: "short", day: "numeric", month: "short" }))}</small>
      <div class="week">${cells.map((c) => `<button class="wd${c.d === today() ? " today" : ""}" data-act="gotoday" data-date="${c.d}" aria-label="${esc(fmtDate(c.d, { weekday: "long", day: "numeric", month: "short" }))}${c.tag ? ": " + esc(c.tag) : ""}"><span class="d1">${DOW_SHORT[dow(c.d)]}</span><span class="d2">${parseISO(c.d).getDate()}</span><span class="d3">${esc(c.tag)}</span><span class="marks">${c.gd ? `<i class="done"></i>` : ""}${c.cd.length ? `<i class="done"></i>` : ""}</span></button>`).join("")}</div>
      <div class="chips"><span class="chip${gymD ? " good" : ""}">Gym ${gymD} day${gymD === 1 ? "" : "s"}</span><span class="chip${cardioD ? " good" : ""}">Cardio ${fmt(cardioMin)} min</span><span class="chip">Avg steps ${steps.length ? fmt(steps.reduce((a, b) => a + b, 0) / steps.length) : "–"}</span></div>
    </section>
    <section class="card">${cells.map((c) => {
      const wo = workoutsOn(c.d);
      const done = [wo.map((w) => esc(w.title || "Workout")).join(", "), c.cd.map((x) => esc(cardioLabel(x.type)) + (x.min ? " " + fmt(x.min) + " min" : "")).join(", ")].filter(Boolean).join(" · ");
      const gymOnly = !wo.length && c.gd ? "Gym" : "";
      return `<div class="dayrow" data-act="gotoday" data-date="${c.d}" role="button" tabindex="0"><div class="dn">${DOW_SHORT[dow(c.d)]}<small>${esc(fmtDate(c.d, { day: "numeric", month: "short" }))}</small></div><div class="ds">${done || gymOnly ? `<b>${[gymOnly, done].filter(Boolean).join(" · ")}</b>` : `<span class="muted">${c.d > today() ? "–" : "Nothing logged"}</span>`}</div>${c.gd || c.cd.length ? `<span class="chip good">${I.check}</span>` : ""}</div>`;
    }).join("")}</section>`;
  }

  function sortedWorkouts() {
    return Object.keys(S.col.workouts).map((id) => Object.assign({ id }, S.col.workouts[id])).filter((w) => w.date)
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : (b.t || 0) - (a.t || 0)));
  }
  const exKey = (n) => String(n || "").toLowerCase().replace(/\s+/g, " ").trim();
  const topKg = (e) => Math.max(0, ...(e.sets || []).map((s) => Number(s.kg) || 0));
  const volumeOf = (exs) => (exs || []).reduce((v, e) => v + (e.sets || []).reduce((s, x) => s + (Number(x.kg) || 0) * (Number(x.reps) || 0), 0), 0);
  function setText(s) {
    if (s.sec) return `${fmt(s.sec)} s`;
    if (s.kg) return `${fmt(s.kg, 1)} × ${fmt(s.reps)}`;
    if (s.reps) return `${fmt(s.reps)} reps`;
    return esc(s.raw || "set");
  }
  function exRow(e, w, all) {
    const prev = all.find((x) => x.date < w.date && (x.exercises || []).some((pe) => exKey(pe.name) === exKey(e.name)));
    let chip = "";
    if (prev) {
      const pe = prev.exercises.find((p) => exKey(p.name) === exKey(e.name));
      const diff = topKg(e) - topKg(pe);
      if (topKg(e) > 0) chip = diff > 0 ? `<span class="chip good">+${fmt(diff, 1)} kg</span>` : diff < 0 ? `<span class="chip warn">−${fmt(-diff, 1)} kg</span>` : `<span class="chip">same weight</span>`;
    } else if (topKg(e) > 0) chip = `<span class="chip">first time</span>`;
    return `<div class="ex"><span class="exn">${esc(e.name)}</span>${chip}<span class="sets">${(e.sets || []).map(setText).join(", ")}</span></div>`;
  }
  function trainHevy() {
    const list = sortedWorkouts();
    return `<section class="card"><div class="card-h"><h2>Workouts from Hevy</h2><button class="btn small" data-act="hevy">Paste from Hevy</button></div>
      <p class="muted">After a workout, open its Hevy link in Chrome, select all the text, copy it, then tap Paste from Hevy. The phone reads it itself, with no AI, and each lift shows how it compares with last time.</p>
      ${list.length ? list.slice(0, 60).map((w) => {
        const sets = (w.exercises || []).reduce((s, e) => s + (e.sets || []).length, 0);
        const vol = w.volumeKg != null ? w.volumeKg : volumeOf(w.exercises);
        return `<details class="wo"><summary><div><div class="wo-t">${esc(w.title || "Workout")}</div><div class="wo-m">${esc(fmtDate(w.date))}${w.durationMin ? " · " + fmt(w.durationMin) + " min" : ""} · ${sets} sets · ${fmt(vol)} kg moved</div></div>${I.right}</summary>
          <div class="wo-body">${(w.exercises || []).map((e) => exRow(e, w, list)).join("")}
            <div class="spread">${w.url ? `<a class="link" href="${esc(safeUrl(w.url))}" target="_blank" rel="noopener">Open in Hevy</a>` : "<span></span>"}<button class="btn small danger" data-act="delwo" data-id="${esc(w.id)}">Delete</button></div>
          </div></details>`;
      }).join("") : `<p class="empty">No workouts yet. Your first Hevy session shows up here with sets, weights and how they compare with last time.</p>`}
    </section>`;
  }

  function allCardio() {
    const out = [];
    Object.values(S.col.days).forEach((dd) => { if (dd && dd.cardio && dd.date) Object.keys(dd.cardio).forEach((id) => { const c = dd.cardio[id]; if (c) out.push(Object.assign({ id, date: dd.date }, c)); }); });
    return out.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : (b.t || 0) - (a.t || 0)));
  }
  function trainCardio() {
    const list = allCardio();
    const sun = weekStartOf(today());
    const wk = list.filter((c) => c.date >= sun);
    const byType = {};
    wk.forEach((c) => { byType[c.type] = (byType[c.type] || 0) + (Number(c.min) || 0); });
    return `<section class="card"><div class="card-h"><h2>Cardio</h2><button class="btn small primary" data-act="cardio" data-date="${today()}">${I.plus}Log cardio</button></div>
      <div class="chips">${Object.keys(byType).length ? Object.keys(byType).map((k) => `<span class="chip">${esc(cardioLabel(k))} ${fmt(byType[k])} min this week</span>`).join("") : `<span class="chip">Nothing logged this week</span>`}</div>
      ${list.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Date</th><th>Activity</th><th class="n">Time</th><th class="n">Distance</th><th class="n">Pace</th><th class="n">Effort</th><th></th></tr></thead><tbody>
        ${list.slice(0, 60).map((c) => `<tr><td>${esc(fmtDate(c.date, { day: "numeric", month: "short" }))}</td><td>${esc(cardioLabel(c.type))}${c.note ? `<br><small>${esc(c.note)}</small>` : ""}</td><td class="n">${c.min ? fmt(c.min) + " min" : "–"}</td><td class="n">${c.km ? fmt(c.km, 2) + " km" : "–"}</td><td class="n">${paceText(c) || "–"}</td><td class="n">${c.rpe ? c.rpe + "/10" : "–"}</td><td><button class="icon-btn" data-act="delcardio" data-date="${c.date}" data-id="${esc(c.id)}" aria-label="Delete">${I.trash}</button></td></tr>`).join("")}
      </tbody></table></div>` : `<p class="empty">Runs, walks, cycling, swims and football all go here. Pace is worked out for runs and walks.</p>`}
    </section>`;
  }

  function foodByName(name) { return window.FOODS.find((f) => f.name === name); }
  function portion(name, g) { const f = foodByName(name); return f ? scaleN(f.per100, g / 100) : zeroN(); }

  function nutritionGuide() {
    const t = targets();
    const prot = [
      ["Chicken breast (cooked, skinless)", 150, "150 g cooked"], ["Soya chunks (dry)", 50, "50 g dry"], ["Paneer (low fat)", 100, "100 g"],
      ["Whey protein", 32, "1 scoop"], ["Greek yogurt / hung curd (low fat)", 200, "200 g"], ["Tofu (firm)", 100, "100 g"],
      ["Moong dal chilla", 160, "2 chillas"], ["Chole / chana masala", 150, "1 katori"], ["Dal tadka (toor)", 150, "1 katori"],
      ["Milk (toned, 3%)", 250, "1 glass"], ["Roasted chana", 30, "1 handful"],
    ];
    const dayPlan = [
      ["Breakfast", "2 moong dal chillas + 150 g hung curd", [["Moong dal chilla", 160], ["Greek yogurt / hung curd (low fat)", 150]]],
      ["Lunch", "1 katori chicken curry + 2 rotis + salad", [["Chicken curry (home style)", 200], ["Roti / chapati (no ghee)", 80], ["Green salad", 100]]],
      ["Before gym", "Banana + a handful of roasted chana", [["Banana", 110], ["Roasted chana", 30]]],
      ["Dinner", "Soya chunk curry + dal + 1 cup rice + sabzi", [["Soya chunk curry", 150], ["Dal tadka (toor)", 150], ["Steamed white rice", 150], ["Mixed veg sabzi", 150]]],
      ["Night", "1 glass toned milk", [["Milk (toned, 3%)", 250]]],
    ];
    const dayTot = zeroN();
    dayPlan.forEach((m) => m[2].forEach(([n, g]) => addN(dayTot, portion(n, g))));
    return `
      <p class="muted">${t.estimated ? "Add your height and weight (gear icon, top right) for exact numbers. These are the defaults." : `Maintenance is about ${fmt(t.tdee)} kcal. Eating ${fmt(t.kcal)} loses fat at roughly 0.5–0.8% of body weight a week.`}</p>
      <div class="preview-n"><div><b>${fmt(t.kcal)}</b><span>kcal</span></div><div><b>${fmt(t.p)}</b><span>protein g</span></div><div><b>${fmt(t.c)}</b><span>carbs g</span></div><div><b>${fmt(t.f)}</b><span>fat g</span></div></div>
      <h3>Protein that fits how you eat</h3>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Food</th><th>Amount</th><th class="n">Protein</th><th class="n">kcal</th></tr></thead><tbody>
        ${prot.map(([n, g, lbl]) => { const x = portion(n, g); return `<tr><td>${esc(n)}</td><td>${esc(lbl)}</td><td class="n"><b>${fmt(x.p)} g</b></td><td class="n">${fmt(x.kcal)}</td></tr>`; }).join("")}
      </tbody></table></div>
      <h3>Rules that do the most work</h3>
      <ul class="plain">
        <li>Weigh food for the first two weeks. Your eye gets accurate fast.</li>
        <li>Measure cooking oil. One tablespoon is about 120 kcal; ask for 1–2 teaspoons per dish.</li>
        <li>Split protein into four servings of 25–35 g: every meal plus one snack.</li>
        <li>Fill half the plate with sabzi or salad. Fiber target is 35 g.</li>
        <li>Eat most of your rice and roti in the meals before and after training.</li>
        <li>Keep chai and coffee an hour away from dal, palak and chana so you absorb the iron; lemon or amla helps.</li>
        <li>Sweets and fried snacks are fine when planned and logged. Keep them under 10% of calories.</li>
      </ul>
      <h3>A day that fits</h3>
      <div class="tbl-wrap"><table class="tbl"><tbody>${dayPlan.map((m) => { const x = zeroN(); m[2].forEach(([n, g]) => addN(x, portion(n, g))); return `<tr><td><b>${m[0]}</b></td><td>${esc(m[1])}</td><td class="n">${fmt(x.kcal)} kcal<br><small>${fmt(x.p)} g protein</small></td></tr>`; }).join("")}</tbody></table></div>
      <p class="muted">About ${fmt(dayTot.kcal)} kcal and ${fmt(dayTot.p)} g protein, with no whey. Add a teaspoon of ghee, fruit or more rice to reach a higher target.</p>
      <h3>Worth considering</h3>
      <ul class="plain">
        <li>Creatine monohydrate, 3–5 g a day. Vegetarians tend to respond well to it.</li>
        <li>Vitamin B12 and D3: get a blood test first. Both are commonly low in Indian vegetarians.</li>
        <li>Whey, only on days you fall short of protein.</li>
        <li>Omega-3: a tablespoon of ground flax or a few walnuts a day.</li>
      </ul>
      <small>General guidance, not medical advice. Check with a doctor if you have a health condition.</small>`;
  }

  // ----- Body -----
  function viewBody() { return weightCard() + checkinCard() + historyCard() + compareCard(); }

  function deltaLine(delta, label, downIsGood) {
    if (Math.abs(delta) < 0.05) return `<span class="t-d">steady ${label}</span>`;
    const good = (delta < 0) === downIsGood;
    return `<span class="t-d ${good ? "good" : "warn"}">${signed(delta, 1)} kg ${label}</span>`;
  }

  function weightCard() {
    const ws = weights(), td = today(), dd = day(td);
    const last = ws[ws.length - 1];
    const avg = last ? avgWeight(last.date) : null;
    const prev = last ? avgWeight(addDays(last.date, -7)) : null;
    const first = ws[0];
    return `<section class="card"><div class="card-h"><h2>Weight</h2><small>Every morning, after the toilet, before food</small></div>
      <div class="grid3">
        <label class="q span-n" for="b-weight">Today<div class="inp-u"><input id="b-weight" type="number" inputmode="decimal" step="0.1" min="20" max="250" data-field="weight" data-date="${td}" value="${dd.weight == null ? "" : dd.weight}" placeholder="–"><em>kg</em></div></label>
        <div class="tile"><span class="t-l">7-day average</span><span class="t-v">${avg ? fmt(avg, 1) : "–"}<small> kg</small></span>${avg && prev ? deltaLine(avg - prev, "vs last week", true) : `<span class="t-d">needs a week of data</span>`}</div>
        <div class="tile"><span class="t-l">Since first weigh-in</span><span class="t-v">${first && avg && ws.length > 1 ? signed(avg - first.v, 1) : "–"}<small> kg</small></span><span class="t-d">${first ? "from " + fmt(first.v, 1) + " kg on " + esc(fmtDate(first.date, { day: "numeric", month: "short" })) : "no weigh-ins yet"}</span></div>
      </div>
      ${weightChart(60)}
    </section>`;
  }

  function weightChart(days) {
    const end = today(), start = addDays(end, -(days - 1));
    const dates = Array.from({ length: days }, (_, i) => addDays(start, i));
    const raw = new Map(weights().filter((w) => w.date >= start).map((w) => [w.date, w.v]));
    const avg = new Map();
    let seen = false;
    dates.forEach((d) => { if (raw.has(d)) seen = true; if (seen) { const v = avgWeight(d); if (v != null) avg.set(d, v); } });
    return chart("wt", {
      label: "Weight over the last 60 days", dates, unit: "kg", dec: 1, endLabel: true,
      series: [{ name: "Weigh-in", kind: "dot", color: "var(--dot)", vals: raw }, { name: "7-day average", kind: "line", color: "var(--accent)", vals: avg }],
      empty: "Your weigh-ins and the 7-day average line appear here.",
    });
  }

  function checkinCard() {
    const d = S.ui.bodyDate;
    const m = S.col.measures[d] || {};
    const earlier = Object.values(S.col.measures).filter((x) => x && x.date < d).sort((a, b) => (a.date < b.date ? 1 : -1))[0];
    return `<section class="card"><div class="card-h"><h2>Weekly check-in</h2><label class="row" for="m-date" style="font-size:13px;font-weight:600;color:var(--ink-2)">Date <input id="m-date" type="date" value="${d}" data-change="mdate" style="width:auto"></label></div>
      <p class="muted">Sunday morning, before food. Tape snug, not tight. Waist at the navel, arm flexed at its widest point, thigh 15 cm above the kneecap.</p>
      <div class="grid3">${MEAS.map((f) => `<label class="f${f.k === "bf" ? " span-n" : ""}" for="m-${f.k}">${f.l}<div class="inp-u"><input id="m-${f.k}" type="number" inputmode="decimal" step="0.1" min="0" value="${m[f.k] == null ? "" : m[f.k]}" placeholder="${earlier && earlier[f.k] != null ? "last " + fmt(earlier[f.k], 1) : "–"}"><em>${f.u || "cm"}</em></div></label>`).join("")}</div>
      <div class="row end"><button class="btn primary" data-act="savemeasure">Save check-in</button></div>
      <hr class="sep">
      <div class="card-h"><h3>Progress photos</h3><small>Same spot, same light, same distance</small></div>
      <div class="photos">${POSES.map((pose) => {
        const v = m.photos && m.photos[pose], src = Photos.url(v);
        return `<label class="ph" for="ph-${pose}">${v ? (src ? `<img src="${esc(src)}" alt="${cap(pose)} photo, ${esc(fmtDate(d))}">` : `<span>Loading…</span>`) + `<span class="tag">${cap(pose)}</span>` : `${I.camera}<span>Add ${pose}</span>`}</label><input id="ph-${pose}" class="vh" type="file" accept="image/*" data-file="photo" data-pose="${pose}">`;
      }).join("")}</div>
      <small>Tap a photo to replace it. Photos stay on this phone only, so download a backup from Settings now and then.</small>
    </section>`;
  }

  function historyCard() {
    const list = Object.values(S.col.measures).filter((m) => m && m.date && MEAS.some((f) => m[f.k] != null)).sort((a, b) => (a.date < b.date ? 1 : -1));
    if (!list.length) return `<section class="card"><h2>Check-in history</h2><p class="empty">Your first check-in becomes the baseline. Do it before week 1 starts.</p></section>`;
    const cols = MEAS.filter((f) => list.some((m) => m[f.k] != null));
    const first = list[list.length - 1], last = list[0];
    const waist = list.filter((m) => m.waist != null).slice().reverse();
    return `<section class="card"><h2>Check-in history</h2>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Date</th>${cols.map((f) => `<th class="n">${esc(f.l.replace(/ \(.*\)/, ""))}</th>`).join("")}</tr></thead><tbody>
        ${list.length > 1 ? `<tr class="cur"><td><b>Change</b></td>${cols.map((f) => `<td class="n"><b>${first[f.k] != null && last[f.k] != null ? signed(last[f.k] - first[f.k], 1) : "–"}</b></td>`).join("")}</tr>` : ""}
        ${list.map((m) => `<tr><td><button class="link" data-act="bodydate" data-date="${m.date}">${esc(fmtDate(m.date, { day: "numeric", month: "short" }))}</button></td>${cols.map((f) => `<td class="n">${m[f.k] != null ? fmt(m[f.k], 1) : "–"}</td>`).join("")}</tr>`).join("")}
      </tbody></table></div>
      ${waist.length > 1 ? `<h3>Waist</h3>${chart("waist", { label: "Waist measurement at each check-in", dates: waist.map((m) => m.date), unit: "cm", dec: 1, endLabel: true, series: [{ name: "Waist", kind: "line", color: "var(--accent)", vals: new Map(waist.map((m) => [m.date, m.waist])) }] })}` : ""}
    </section>`;
  }

  function compareCard() {
    const withPhotos = Object.values(S.col.measures).filter((m) => m && m.date && m.photos && POSES.some((p) => m.photos[p])).sort((a, b) => (a.date < b.date ? -1 : 1));
    if (withPhotos.length < 2) return `<section class="card"><h2>Compare photos</h2><p class="empty">After two check-ins with photos, compare them side by side here.</p></section>`;
    const a = withPhotos.find((m) => m.date === S.ui.cmpA) || withPhotos[0];
    const b = withPhotos.find((m) => m.date === S.ui.cmpB) || withPhotos[withPhotos.length - 1];
    const pose = S.ui.cmpPose || "front";
    const opts = (sel) => withPhotos.map((m) => `<option value="${m.date}"${m.date === sel ? " selected" : ""}>${esc(fmtDate(m.date, { day: "numeric", month: "short", year: "numeric" }))}</option>`).join("");
    const fig = (m) => `<figure>${m.photos[pose] && Photos.url(m.photos[pose]) ? `<img src="${esc(Photos.url(m.photos[pose]))}" alt="${cap(pose)} photo, ${esc(fmtDate(m.date))}">` : `<div class="ph-empty">No ${pose} photo</div>`}<figcaption>${esc(fmtDate(m.date, { day: "numeric", month: "short" }))}${m.waist != null ? " · waist " + fmt(m.waist, 1) + " cm" : ""}</figcaption></figure>`;
    return `<section class="card"><h2>Compare photos</h2>
      <div class="seg" role="group" aria-label="Pose">${POSES.map((p) => `<button data-act="cmppose" data-pose="${p}" aria-pressed="${p === pose}">${cap(p)}</button>`).join("")}</div>
      <div class="grid2"><label class="f" for="cmp-a">Before<select id="cmp-a" data-change="cmpa">${opts(a.date)}</select></label><label class="f" for="cmp-b">After<select id="cmp-b" data-change="cmpb">${opts(b.date)}</select></label></div>
      <div class="cmp">${fig(a)}${fig(b)}</div>
    </section>`;
  }

  // ----- Trends -----
  function viewTrends() {
    const t = targets(), end = today();
    const last7 = Array.from({ length: 7 }, (_, i) => addDays(end, -i));
    const logged = last7.filter((d) => foodsOf(d).length);
    const avgN = logged.length ? scaleN(logged.reduce((a, d) => addN(a, totalsOf(d)), zeroN()), 1 / logged.length) : null;
    const stepDays = last7.map((d) => day(d).steps).filter((v) => v > 0);
    const avgSteps = stepDays.length ? stepDays.reduce((a, b) => a + b, 0) / stepDays.length : null;
    const sun = weekStartOf(end);
    const wkDays = Array.from({ length: 7 }, (_, i) => addDays(sun, i)).filter((d) => d <= end);
    let gymD = 0, cardioMin = 0;
    wkDays.forEach((d) => { if (gymDone(d)) gymD++; cardioOf(d).forEach((c) => { cardioMin += Number(c.min) || 0; }); });
    const ws = weights(), lastW = ws[ws.length - 1];
    const avgW = lastW ? avgWeight(lastW.date) : null, prevW = lastW ? avgWeight(addDays(lastW.date, -7)) : null;
    const rate = rateCheck();
    const steps14 = Array.from({ length: 14 }, (_, i) => addDays(end, i - 13));
    const kcalMap = new Map(), protMap = new Map(), stepMap = new Map();
    steps14.forEach((d) => { if (foodsOf(d).length) { const x = totalsOf(d); kcalMap.set(d, x.kcal); protMap.set(d, x.p); } if (day(d).steps > 0) stepMap.set(d, day(d).steps); });
    const goalSteps = stepGoal();
    const tile = (l, v, u, d) => `<div class="tile"><span class="t-l">${l}</span><span class="t-v">${v}${u ? `<small> ${u}</small>` : ""}</span>${d || ""}</div>`;
    return `
    <div class="tiles">
      ${tile("Weight, 7-day avg", avgW ? fmt(avgW, 1) : "–", "kg", avgW && prevW ? deltaLine(avgW - prevW, "vs last week", true) : `<span class="t-d">weigh in daily</span>`)}
      ${tile("Calories, 7-day avg", avgN ? fmt(avgN.kcal) : "–", "kcal", `<span class="t-d">target ${fmt(t.kcal)}</span>`)}
      ${tile("Protein, 7-day avg", avgN ? fmt(avgN.p) : "–", "g", `<span class="t-d ${avgN && avgN.p >= t.p * 0.9 ? "good" : ""}">target ${fmt(t.p)} g</span>`)}
      ${tile("Steps, 7-day avg", avgSteps ? fmt(avgSteps) : "–", "", `<span class="t-d">goal ${fmt(goalSteps)}</span>`)}
      ${tile("Training this week", `${gymD}<small> gym</small> · ${fmt(cardioMin)}`, "min cardio", `<span class="t-d">since ${esc(fmtDate(sun, { weekday: "short", day: "numeric", month: "short" }))}</span>`)}
      ${tile("Food logged", `${logged.length}<small> of 7</small>`, "days", `<span class="t-d">${logged.length >= 6 ? "solid tracking" : "log every day for clean numbers"}</span>`)}
    </div>
    <section class="card"><div class="card-h"><h2>Fat-loss rate</h2>${rate.cls ? `<span class="chip ${rate.cls}">${esc(rate.short)}</span>` : ""}</div><p>${esc(rate.msg)}</p></section>
    <section class="card"><div class="card-h"><h2>Weight</h2><small>Last 60 days</small></div>${weightChart(60)}</section>
    <section class="card"><div class="card-h"><h2>Calories</h2><small>Last 14 days, logged days only</small></div>${chart("kcal", { label: "Calories eaten per day", dates: steps14, unit: "kcal", zero: true, target: t.kcal, series: [{ name: "Calories", kind: "bar", color: "var(--accent)", vals: kcalMap }], empty: "Log food and your daily calories appear here." })}</section>
    <section class="card"><div class="card-h"><h2>Protein</h2><small>Last 14 days</small></div>${chart("prot", { label: "Protein eaten per day", dates: steps14, unit: "g", zero: true, target: t.p, series: [{ name: "Protein", kind: "bar", color: "var(--c-p)", vals: protMap }], empty: "Log food and your daily protein appears here." })}</section>
    <section class="card"><div class="card-h"><h2>Steps</h2><small>Last 14 days</small></div>${chart("steps", { label: "Steps per day", dates: steps14, unit: "steps", zero: true, target: goalSteps, series: [{ name: "Steps", kind: "bar", color: "var(--c-c)", vals: stepMap }], empty: "Enter your steps on Today and they appear here." })}</section>
    ${avgN ? microCard(avgN, "Micronutrients", `Average of ${logged.length} logged day${logged.length > 1 ? "s" : ""}`) : ""}
    ${reviewCard()}`;
  }

  function reviewCard() {
    const r = S.ui.review || {};
    const off = !aiOn();
    return `<section class="card"><div class="card-h"><h2>Weekly review</h2>${off ? `<button class="btn small" data-act="settings">Add API key</button>` : `<button class="btn small primary" data-act="review"${r.busy ? " disabled" : ""}>${I.spark}${r.text ? "Write it again" : "Ask Claude"}</button>`}</div>
      ${off ? `<p class="muted">Add your Anthropic API key in Settings and Claude will write a review of your week.</p>` : ""}
      ${r.busy ? `<div class="busy"><span class="spinner"></span><span>Reading your week…</span><button class="btn small" data-act="review-stop">Stop</button></div>` : ""}
      <div class="review" id="review-text">${esc(r.text || (r.busy || off ? "" : "Claude reads your last 7 days of food, weight, steps and training, then says what to keep and what to change."))}</div>
      ${r.err ? `<p class="err">${esc(r.err)}</p>` : ""}
    </section>`;
  }

  // ---------- charts ----------
  const CH = {};
  const chartW = () => Math.max(260, Math.min(728, (($("#view") && $("#view").clientWidth) || 360) - 34));
  function niceStep(raw) {
    const p = Math.pow(10, Math.floor(Math.log10(raw || 1)));
    const f = raw / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  }
  const fmtTick = (v, step) => (Math.abs(v) >= 1000 ? fmt(v / 1000, 1) + "K" : fmt(v, step < 1 ? 1 : 0));
  const barPath = (x, y, w, h, r) => `M${x},${y + h}L${x},${y + r}Q${x},${y} ${x + r},${y}L${x + w - r},${y}Q${x + w},${y} ${x + w},${y + r}L${x + w},${y + h}Z`;

  function chart(id, o) {
    const W = chartW();
    const H = Math.round(Math.min(230, Math.max(170, W * 0.4)));
    const L = 42, R = o.endLabel ? 44 : 12, T = 18, B = 24;
    const n = o.dates.length, pw = W - L - R, ph = H - T - B;
    const vals = [];
    o.series.forEach((s) => o.dates.forEach((d) => { const v = s.vals.get(d); if (v != null && isFinite(v)) vals.push(v); }));
    if (!vals.length || !n) return `<p class="empty">${esc(o.empty || "No data yet.")}</p>`;
    if (o.target) vals.push(o.target);
    let lo = Math.min(...vals), hi = Math.max(...vals);
    if (o.zero) lo = 0;
    if (hi === lo) { hi += 1; if (!o.zero) lo -= 1; }
    const span = hi - lo;
    if (!o.zero) lo -= span * 0.12;
    hi += span * 0.12;
    const step = niceStep((hi - lo) / 4);
    lo = Math.floor(lo / step) * step;
    hi = Math.ceil(hi / step) * step;
    const band = pw / n;
    const xAt = (i) => L + band * (i + 0.5);
    const yAt = (v) => T + ph - ((v - lo) / (hi - lo)) * ph;
    let g = "";
    for (let v = lo; v <= hi + step / 2; v += step) {
      const y = yAt(v);
      g += `<line class="${Math.abs(v - lo) < 1e-9 && o.zero ? "axis" : "grid"}" x1="${L}" x2="${W - R}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"/><text class="ytxt" x="${L - 7}" y="${(y + 4).toFixed(1)}" text-anchor="end">${fmtTick(v, step)}</text>`;
    }
    const every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(pw / 74))));
    for (let i = 0; i < n; i += every) g += `<text class="xtxt" x="${xAt(i).toFixed(1)}" y="${H - 6}" text-anchor="middle">${esc(fmtDate(o.dates[i], { day: "numeric", month: "short" }))}</text>`;
    o.series.forEach((s) => {
      if (s.kind === "bar") {
        const bw = Math.max(3, Math.min(24, band * 0.62));
        o.dates.forEach((d, i) => {
          const v = s.vals.get(d);
          if (v == null || v <= 0) return;
          const x = xAt(i) - bw / 2, y = yAt(v), h = yAt(lo) - y;
          g += `<path d="${barPath(+x.toFixed(1), +y.toFixed(1), +bw.toFixed(1), +h.toFixed(1), Math.min(4, bw / 2, h))}" style="fill:${s.color}"/>`;
        });
      } else if (s.kind === "dot") {
        o.dates.forEach((d, i) => { const v = s.vals.get(d); if (v == null) return; g += `<circle cx="${xAt(i).toFixed(1)}" cy="${yAt(v).toFixed(1)}" r="4" style="fill:${s.color};stroke:var(--surface)" stroke-width="2"/>`; });
      } else {
        let path = "", pen = false, lastI = -1;
        o.dates.forEach((d, i) => { const v = s.vals.get(d); if (v == null) { pen = false; return; } path += `${pen ? "L" : "M"}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`; pen = true; lastI = i; });
        if (path) g += `<path d="${path}" fill="none" style="stroke:${s.color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
        if (lastI >= 0) {
          const v = s.vals.get(o.dates[lastI]);
          g += `<circle cx="${xAt(lastI).toFixed(1)}" cy="${yAt(v).toFixed(1)}" r="4.5" style="fill:${s.color};stroke:var(--surface)" stroke-width="2"/>`;
          if (o.endLabel) g += `<text class="endtxt" x="${(xAt(lastI) + 9).toFixed(1)}" y="${(yAt(v) + 4).toFixed(1)}">${fmt(v, o.dec || 0)}</text>`;
        }
      }
    });
    if (o.target) {
      const y = yAt(o.target);
      g += `<line class="tgt" x1="${L}" x2="${W - R}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
    }
    CH[id] = { W, L, band, n, xs: o.dates.map((_, i) => xAt(i)), dates: o.dates, series: o.series, unit: o.unit, dec: o.dec || 0 };
    const keys = o.series.length > 1 ? o.series.map((s) => `<span><i class="${s.kind === "line" ? "ln" : "dot"}" style="background:${s.color}"></i>${esc(s.name)}</span>`) : [];
    if (o.target) keys.push(`<span><i class="ln" style="background:var(--ink-2)"></i>Target ${fmt(o.target)}${o.unit && o.unit !== "steps" ? " " + esc(o.unit) : ""}</span>`);
    const legend = keys.length ? `<div class="legend">${keys.join("")}</div>` : "";
    return `${legend}<div class="chart" data-chart="${id}"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label)}">${g}<line class="xh" x1="0" x2="0" y1="${T}" y2="${T + ph}" visibility="hidden"/><rect class="hit" x="${L}" y="${T}" width="${pw}" height="${ph}"/></svg><div class="tip" hidden></div></div>`;
  }

  function bindCharts() {
    $$(".chart").forEach((el) => {
      const c = CH[el.dataset.chart];
      if (!c) return;
      const svgEl = el.querySelector("svg"), tip = el.querySelector(".tip"), xh = el.querySelector(".xh"), hit = el.querySelector(".hit");
      const hide = () => { tip.hidden = true; xh.setAttribute("visibility", "hidden"); };
      const move = (e) => {
        const r = svgEl.getBoundingClientRect();
        const sx = (e.clientX - r.left) * (c.W / r.width);
        const i = Math.max(0, Math.min(c.n - 1, Math.floor((sx - c.L) / c.band)));
        const d = c.dates[i];
        const rows = c.series.map((s) => { const v = s.vals.get(d); return v == null ? "" : `<div>${esc(s.name)}: <b>${fmt(v, c.dec)}</b> ${esc(c.unit || "")}</div>`; }).join("");
        if (!rows) { hide(); return; }
        tip.innerHTML = `<div>${esc(fmtDate(d))}</div>${rows}`;
        tip.hidden = false;
        const px = c.xs[i] * (r.width / c.W);
        tip.style.left = Math.max(70, Math.min(r.width - 70, px)) + "px";
        xh.setAttribute("x1", c.xs[i]); xh.setAttribute("x2", c.xs[i]); xh.setAttribute("visibility", "visible");
      };
      hit.addEventListener("pointermove", move);
      hit.addEventListener("pointerdown", move);
      hit.addEventListener("pointerleave", hide);
    });
  }

  // ---------- sheets ----------
  function syncFab() { const f = $("#fab"); if (f) f.hidden = S.ui.tab !== "today" || !!S.sheet; }
  function openSheet(state) {
    S.sheet = state;
    $("#sheet").hidden = false;
    document.body.style.overflow = "hidden";
    syncFab();
    renderSheet();
    const p = $("#sheet-panel"); p.setAttribute("tabindex", "-1"); p.focus({ preventScroll: true });
  }
  function closeSheet() {
    const sh = S.sheet;
    if (sh && sh.ctl) sh.ctl.abort();
    if (sh && sh.photos) sh.photos.forEach((p) => URL.revokeObjectURL(p.url));
    S.sheet = null;
    $("#sheet").hidden = true;
    document.body.style.overflow = "";
    syncFab();
    scheduleRender();
  }
  const head = (title) => `<div class="sheet-h"><h2 id="sheet-title">${esc(title)}</h2><button class="icon-btn" data-act="close" aria-label="Close">${I.close}</button></div>`;
  function renderSheet() {
    const sh = S.sheet;
    if (!sh) return;
    if (sh.type === "food") grabFoodInputs(sh);
    const html = sh.type === "food" ? sheetFood(sh) : sh.type === "entry" ? sheetEntry(sh) : sh.type === "cardio" ? sheetCardio(sh)
      : sh.type === "guide" ? sheetGuide() : sh.type === "hevy" ? sheetHevy(sh) : sh.type === "settings" ? sheetSettings(sh)
      : sh.type === "savemeal" ? sheetSaveMeal(sh) : "";
    $("#sheet-panel").innerHTML = html;
  }

  // ----- food sheet -----
  function grabFoodInputs(sh) {
    const v = (id) => { const el = $("#" + id); return el ? el.value : undefined; };
    if (v("f-note") !== undefined) sh.note = v("f-note");
    if (v("f-grams") !== undefined) sh.grams = v("f-grams");
    if (v("f-desc") !== undefined) sh.desc = v("f-desc");
  }
  function sheetFood(sh) {
    const modes = [["search", "Search"], ["photo", "Photo"], ["text", "Describe"], ["manual", "Manual"]];
    const aiOff = !aiOn();
    let body = "";
    if (sh.results) body = resultsEditor(sh);
    else if (sh.pick) body = pickPanel(sh);
    else if (sh.mode === "photo" || sh.mode === "text") {
      if (aiOff) body = `<div class="note spread"><span>Add your Anthropic API key in Settings to estimate dishes that aren't in the food list. Search works without it.</span><button class="btn small primary" data-act="settings">Add key</button></div>`;
      else if (sh.mode === "photo") {
        const photos = sh.photos || [], maxP = photoCap();
        body = `${photos.length ? `<div class="thumbs">${photos.map((p, i) => `<figure class="thumb"><img src="${p.url}" alt="Meal photo ${i + 1}"><button class="thumb-x" data-act="food-unphoto" data-i="${i}" aria-label="Remove photo ${i + 1}">${I.close}</button></figure>`).join("")}</div>` : ""}
          ${photos.length < maxP ? `<div class="drop" data-drop="food">
            ${photos.length ? `<small>Add another angle or a separate dish (up to ${maxP} photos).</small>` : `${I.camera}<b>Photograph your plate</b><small>Shoot from above in good light. On a computer you can also drag a photo here or paste one with Ctrl+V.</small>`}
            <div class="row"><label class="btn primary cam-only" for="f-cam">${I.camera}Take photo</label><label class="btn" for="f-photo">${photos.length ? "Add photo" : "Choose photo"}</label></div>
          </div>` : ""}
          <input id="f-cam" class="vh" type="file" accept="image/*" capture="environment" data-file="foodphoto">
          <input id="f-photo" class="vh" type="file" accept="image/*" multiple data-file="foodphoto">
          <div class="grid2">
            <label class="f" for="f-grams">Total weight (optional)<div class="inp-u"><input id="f-grams" type="number" inputmode="numeric" min="0" value="${esc(sh.grams || "")}" placeholder="e.g. 350"><em>g</em></div></label>
            <label class="f" for="f-note">What's on the plate? (optional)<input id="f-note" type="text" value="${esc(sh.note || "")}" placeholder="rajma chawal, 1 tsp ghee"></label>
          </div>
          <button class="btn primary wide" data-act="food-estimate"${!photos.length || sh.busy ? " disabled" : ""}>${I.spark}Estimate with Claude</button>`;
      } else {
        body = `<label class="f" for="f-desc">What did you eat? Add weights or katori counts where you know them.
            <textarea id="f-desc" rows="4" placeholder="2 rotis, 1 katori dal tadka, 150 g chicken curry, salad">${esc(sh.desc || "")}</textarea></label>
          <button class="btn primary wide" data-act="food-estimate"${sh.busy ? " disabled" : ""}>${I.spark}Estimate with Claude</button>`;
      }
      if (sh.busy) body += `<div class="busy"><span class="spinner"></span><span>Claude is working out your plate. Every item gets saved, so next time it's an instant search.</span><button class="btn small" data-act="food-stop">Stop</button></div>`;
      if (sh.error) body += `<p class="err">${esc(sh.error)}</p>`;
    } else if (sh.mode === "search") {
      body = `<input id="f-q" type="search" data-input="food-search" placeholder="Search roti, dal, paneer, chicken…" value="${esc(sh.query || "")}" aria-label="Search foods" autocomplete="off">
        <div id="f-results">${foodOptions(sh)}</div>`;
    } else {
      body = `<label class="f" for="mn-name">Name<input id="mn-name" type="text" placeholder="e.g. Office canteen thali"></label>
        <div class="grid3">
          <label class="f" for="mn-g">Weight<div class="inp-u"><input id="mn-g" type="number" min="0" value="100"><em>g</em></div></label>
          <label class="f" for="mn-kcal">Calories<div class="inp-u"><input id="mn-kcal" type="number" min="0"><em>kcal</em></div></label>
          <label class="f" for="mn-p">Protein<div class="inp-u"><input id="mn-p" type="number" min="0" step="0.1"><em>g</em></div></label>
          <label class="f" for="mn-c">Carbs<div class="inp-u"><input id="mn-c" type="number" min="0" step="0.1"><em>g</em></div></label>
          <label class="f" for="mn-f">Fat<div class="inp-u"><input id="mn-f" type="number" min="0" step="0.1"><em>g</em></div></label>
          <label class="f" for="mn-fib">Fiber<div class="inp-u"><input id="mn-fib" type="number" min="0" step="0.1"><em>g</em></div></label>
        </div>
        <label class="chk"><input id="mn-save" type="checkbox"> Save to My Foods for next time</label>
        <button class="btn primary wide" data-act="manual-add">Add to ${mealLabel(sh.meal)}</button>`;
    }
    return `${head("Add food")}
      <div class="chips" role="group" aria-label="Meal">${MEALS.map(([k, l]) => `<button class="chip" data-act="food-meal" data-meal="${k}" aria-pressed="${sh.meal === k}">${l}</button>`).join("")}</div>
      ${sh.results || sh.pick ? "" : `<div class="seg" role="group" aria-label="How to add">${modes.map(([k, l]) => `<button data-act="food-mode" data-mode="${k}" aria-pressed="${sh.mode === k}">${l}</button>`).join("")}</div>`}
      ${body}`;
  }

  function searchFoods(q) {
    const toks = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!toks.length) return null;
    const mf = myFoods();
    const mine = Object.keys(mf).filter((id) => mf[id] && mf[id].per100).map((id) => ({ id: "m:" + id, name: mf[id].name, serving: mf[id].serving || { label: "100 g", g: 100 }, per100: mf[id].per100, aliases: "", mine: true }));
    // Your saved foods first, then the curated list, then the Indian Nutrient Databank.
    return mine.concat(window.FOODS, INDB_FOODS).map((f) => {
      const hay = (f.name + " " + f.aliases).toLowerCase();
      if (!toks.every((t) => hay.includes(t))) return null;
      return { f, score: (f.name.toLowerCase().startsWith(toks[0]) ? 0 : 1) - (f.mine ? 0.5 : 0) + (f.indb ? 0.4 : 0) };
    }).filter(Boolean).sort((a, b) => a.score - b.score || a.f.name.length - b.f.name.length).slice(0, 40).map((x) => x.f);
  }
  function recentFoods() {
    const out = [], seen = new Set();
    const dates = Object.keys(S.col.days).sort().reverse().slice(0, 30);
    for (const d of dates) {
      for (const e of foodsOf(d).reverse()) {
        const key = String(e.name).toLowerCase();
        if (seen.has(key) || !(e.g > 0)) continue;
        seen.add(key);
        out.push({ id: "r:" + d + ":" + e.id, name: e.name, serving: { label: fmt(e.g) + " g", g: e.g }, per100: scaleN(e.n, 100 / e.g), aliases: "", recent: true });
        if (out.length >= 12) return out;
      }
    }
    return out;
  }
  const savedMeals = () => (S.col.config.meals && S.col.config.meals.items) || {};
  function foodRow(f) {
    return `<li class="fopt" data-act="food-pick" data-fid="${esc(f.id)}" role="button" tabindex="0"><div class="nm">${esc(f.name)}<small>${esc(f.serving.label)}${/ g$/.test(f.serving.label) ? "" : " · " + fmt(f.serving.g) + " g"}${f.mine ? " · My food" : f.indb ? " · Databank" : ""}</small></div><div class="k">${fmt((f.per100.kcal * f.serving.g) / 100)}<small> kcal</small></div></li>`;
  }
  function foodOptions(sh) {
    const res = searchFoods(sh.query || "");
    if (res) {
      sh.opts = Object.fromEntries(res.map((f) => [f.id, f]));
      if (!res.length) return `<p class="empty">No match. Try another word${aiOn() ? ", or let Claude estimate it under Photo or Describe" : ", or add it under Manual"}.</p>`;
      return `<ul class="flist">${res.map(foodRow).join("")}</ul>`;
    }
    const mf = myFoods();
    const mine = Object.keys(mf).filter((id) => mf[id] && mf[id].per100)
      .map((id) => ({ id: "m:" + id, name: mf[id].name, serving: mf[id].serving || { label: "100 g", g: 100 }, per100: mf[id].per100, aliases: "", mine: true, t: mf[id].t || 0 }))
      .sort((a, b) => b.t - a.t).slice(0, 8);
    const mineNames = new Set(mine.map((f) => f.name.toLowerCase()));
    const recent = recentFoods().filter((f) => !mineNames.has(f.name.toLowerCase()));
    sh.opts = Object.fromEntries(mine.concat(recent).map((f) => [f.id, f]));
    const sm = savedMeals(), smIds = Object.keys(sm).filter((id) => sm[id] && Array.isArray(sm[id].items));
    let html = "";
    if (smIds.length) {
      html += `<span class="eyebrow">Saved meals</span><ul class="flist">${smIds.map((id) => {
        const m = sm[id], k = m.items.reduce((a, e) => a + (Number(e.n && e.n.kcal) || 0), 0);
        return `<li class="fopt" data-act="addsaved" data-id="${esc(id)}" role="button" tabindex="0"><div class="nm">${esc(m.name)}<small>${esc(m.items.map((e) => e.name).join(", ").slice(0, 80))}</small></div><div class="k">${fmt(k)}<small> kcal</small></div></li>`;
      }).join("")}</ul>`;
    }
    if (mine.length) html += `<span class="eyebrow">My foods</span><ul class="flist">${mine.map(foodRow).join("")}</ul>`;
    if (recent.length) html += `<span class="eyebrow">Recent</span><ul class="flist">${recent.map(foodRow).join("")}</ul>`;
    return html || `<p class="empty">Type to search Indian foods and dishes. Anything Claude estimates for you is saved here too.</p>`;
  }
  const previewN = (n) => `<div class="preview-n"><div><b>${fmt(n.kcal)}</b><span>kcal</span></div><div><b>${fmt(n.p, 1)}</b><span>protein</span></div><div><b>${fmt(n.c, 1)}</b><span>carbs</span></div><div><b>${fmt(n.f, 1)}</b><span>fat</span></div></div>`;
  function pickGrams(sh) {
    const q = num($("#p-qty") && $("#p-qty").value);
    const u = ($("#p-unit") && $("#p-unit").value) || sh.pick.unit;
    const qty = q == null ? sh.pick.qty : q;
    return u === "g" ? qty : qty * sh.pick.f.serving.g;
  }
  function pickPanel(sh) {
    const f = sh.pick.f;
    const sLabel = /^[\d.,]+ g$/.test(f.serving.label) ? null : f.serving.label;
    return `<div class="stack"><h3>${esc(f.name)}</h3>
      <div class="grid2">
        <label class="f" for="p-qty">Amount<input id="p-qty" type="number" inputmode="decimal" min="0" step="${sh.pick.unit === "g" ? 5 : 0.5}" value="${sh.pick.qty}" data-input="pick"></label>
        <label class="f" for="p-unit">Unit<select id="p-unit" data-input="pick">${sLabel ? `<option value="s"${sh.pick.unit === "s" ? " selected" : ""}>${esc(sLabel.replace(/^1 /, ""))} (${fmt(f.serving.g)} g)</option>` : ""}<option value="g"${sh.pick.unit === "g" ? " selected" : ""}>grams</option></select></label>
      </div>
      <div id="p-prev">${previewN(scaleN(f.per100, pickGrams(sh) / 100))}</div>
      <div class="row end"><button class="btn" data-act="pick-back">Back</button><button class="btn primary" data-act="pick-add">Add to ${mealLabel(sh.meal)}</button></div></div>`;
  }

  function resNums(r) { const n = scaleN(r.n0, r.g / r.g0); return `<b>${fmt(n.kcal)}</b> kcal · ${fmt(n.p, 1)} P · ${fmt(n.c, 1)} C · ${fmt(n.f, 1)} F`; }
  function resTotal(rs) { const t = zeroN(); rs.forEach((r) => addN(t, scaleN(r.n0, r.g / r.g0))); return `Total <b>${fmt(t.kcal)}</b> kcal · ${fmt(t.p)} g protein · ${fmt(t.c)} g carbs · ${fmt(t.f)} g fat`; }
  function resultsEditor(sh) {
    return `${sh.aiNotes ? `<p class="note">${esc(sh.aiNotes)}</p>` : ""}
      <p class="muted">Check the names and weights. Changing a weight rescales that item.</p>
      <ul class="results">${sh.results.map((r, i) => `<li class="res">
        <div class="res-top"><input type="text" data-input="res-name" data-i="${i}" value="${esc(r.name)}" aria-label="Food name"><button class="icon-btn" data-act="res-del" data-i="${i}" aria-label="Remove ${esc(r.name)}">${I.close}</button></div>
        <div class="res-bot"><div class="inp-u"><input type="number" inputmode="numeric" min="0" data-input="res-g" data-i="${i}" value="${r1(r.g)}" aria-label="Grams"><em>g</em></div><span class="res-n" id="res-n-${i}">${resNums(r)}</span><span class="chip${r.conf === "low" ? " warn" : ""}">${esc(r.conf)}</span></div>
        <label class="chk"><input type="checkbox" data-change="res-save" data-i="${i}"${r.save ? " checked" : ""}> Save to My Foods</label>
      </li>`).join("")}</ul>
      <div class="total-bar"><div class="res-n" id="res-total">${resTotal(sh.results)}</div>
        <div class="row end"><button class="btn" data-act="res-back">Start over</button><button class="btn primary" data-act="res-add">Add to ${mealLabel(sh.meal)}</button></div></div>`;
  }

  function foodPrompt(note, grams, nPhotos) {
    const hasPhoto = nPhotos > 0;
    return [
      "You are a sports nutritionist who knows Indian home and restaurant food well (IFCT 2017 and USDA values).",
      nPhotos > 1 ? `Estimate the nutrition of the meal in the ${nPhotos} attached photos. They show the same meal from different angles or its separate dishes, so count each item once.`
        : hasPhoto ? "Estimate the nutrition of the food in the attached photo." : "Estimate the nutrition of the food described below.",
      note ? `The person says: """${String(note).slice(0, 1500)}"""` : "",
      grams ? `Total weight of all the food: ${grams} g. Split that weight across the items realistically.` : "No total weight was given. Estimate portions from the photo or description using typical Indian servings (1 roti about 40 g, 1 katori about 150 g, 1 cup cooked rice about 150 g).",
      "Assume home-style cooking with normal oil or ghee unless it looks like restaurant food, and include the cooking fat in each dish's numbers. The person eats no eggs and no meat other than chicken, so read ambiguous items accordingly.",
      "List each distinct item separately (for example rice, dal and sabzi as three items), with a plain name that would make sense in a food list, like \"Rajma curry\" or \"Jeera rice\".",
      "Units: p (protein), c (carbs), f (fat), fib (fiber), sug (sugar), sf (saturated fat) in grams; na (sodium), k (potassium), ca (calcium), fe (iron), mg (magnesium), zn (zinc), vc (vitamin C) in mg; b12 and vd (vitamin D) in mcg. Every value is the total for that item's grams, not per 100 g. notes is one short sentence on what you assumed.",
    ].filter(Boolean).join("\n");
  }
  function normalizeItems(out) {
    const arr = Array.isArray(out) ? out : out && Array.isArray(out.items) ? out.items : [];
    return arr.slice(0, 20).map((it) => {
      const g = Math.max(1, num(it && it.grams) || 100);
      const n = {};
      NK.forEach((k) => { n[k] = Math.max(0, num(it && it[k]) || 0); });
      return { name: String((it && it.name) || "Food").slice(0, 80), g0: g, g, n0: n, conf: ["high", "medium", "low"].includes(it && it.confidence) ? it.confidence : "medium", save: true };
    }).filter((r) => r.n0.kcal > 0 || r.n0.p > 0);
  }
  async function estimateFood() {
    const sh = S.sheet;
    grabFoodInputs(sh);
    const isPhoto = sh.mode === "photo";
    const blobs = (sh.photos || []).map((p) => p.blob);
    if (isPhoto && !blobs.length) return;
    if (!isPhoto && !String(sh.desc || "").trim()) { sh.error = "Describe what you ate first."; renderSheet(); return; }
    if (!aiOn()) { sh.error = aiError({ code: "no_key" }); renderSheet(); return; }
    sh.busy = true; sh.error = null; sh.ctl = new AbortController();
    renderSheet();
    const prompt = foodPrompt(isPhoto ? sh.note : sh.desc, isPhoto ? num(sh.grams) : null, isPhoto ? blobs.length : 0);
    try {
      const out = await AI.json(prompt, FOOD_SCHEMA, { images: isPhoto ? blobs : [], signal: sh.ctl.signal, effort: "low" });
      if (S.sheet !== sh) return;
      const items = normalizeItems(out);
      if (!items.length) sh.error = "Claude couldn't find food in that. Try a clearer photo, or describe it.";
      else { sh.results = items; sh.aiNotes = String((out && out.notes) || "").slice(0, 300); }
    } catch (e) {
      if (S.sheet !== sh) return;
      sh.error = aiError(e) || null;
    }
    sh.busy = false; sh.ctl = null;
    renderSheet();
  }

  function addEntries(date, meal, list) {
    const foods = {}, t = Date.now();
    list.forEach((e, i) => { foods[uid() + i] = { meal, name: String(e.name).slice(0, 80), g: r1(e.g), n: roundN(e.n), src: e.src || "db", t: t + i }; });
    patchDay(date, { foods });
    toast(`Added ${list.length} item${list.length > 1 ? "s" : ""} to ${mealLabel(meal)}`);
  }
  // One saved entry per food name: saving the same name again updates it.
  function saveMyFood(name, n, g) {
    if (!(g > 0)) return;
    name = String(name).trim().slice(0, 80);
    const mf = myFoods();
    const id = Object.keys(mf).find((k) => mf[k] && String(mf[k].name).toLowerCase() === name.toLowerCase()) || uid();
    Store.patch("config", "myfoods", { items: { [id]: { name, per100: roundN(scaleN(n, 100 / g)), serving: { label: fmt(g) + " g", g: r1(g) }, t: Date.now() } } });
  }
  function saveMeal(name, mealKey, items) {
    Store.patch("config", "meals", { items: { [uid()]: { name: String(name).trim().slice(0, 60) || mealLabel(mealKey), meal: mealKey, items: items.map((e) => ({ name: e.name, g: e.g, n: roundN(e.n), src: e.src || "db" })), t: Date.now() } } });
  }

  // ----- entry sheet -----
  function sheetEntry(sh) {
    const e = foodsOf(sh.date).find((x) => x.id === sh.id);
    if (!e) return head("Food") + `<p class="empty">This item was removed.</p>`;
    const g = sh.g == null ? e.g : sh.g;
    return `${head("Edit food")}
      <label class="f" for="e-name">Name<input id="e-name" type="text" value="${esc(e.name)}"></label>
      <div class="grid2">
        <label class="f" for="e-g">Weight<div class="inp-u"><input id="e-g" type="number" inputmode="decimal" min="0" value="${r1(g)}" data-input="entry-g"><em>g</em></div></label>
        <label class="f" for="e-meal">Meal<select id="e-meal">${MEALS.map(([k, l]) => `<option value="${k}"${(e.meal || "other") === k ? " selected" : ""}>${l}</option>`).join("")}</select></label>
      </div>
      <div id="e-prev">${previewN(scaleN(e.n, g / e.g))}</div>
      <small>${srcLabel(e.src) || "From the food list"}. Fiber ${fmt((e.n.fib * g) / e.g, 1)} g · sodium ${fmt((e.n.na * g) / e.g)} mg · iron ${fmt((e.n.fe * g) / e.g, 1)} mg</small>
      <div class="spread"><button class="btn danger" data-act="entry-del">${I.trash}Delete</button>
        <div class="row"><button class="btn" data-act="entry-mine">Save to My Foods</button><button class="btn primary" data-act="entry-save">Save</button></div></div>`;
  }

  // ----- cardio sheet -----
  function sheetCardio(sh) {
    const type = sh.ctype || "walk";
    return `${head("Log cardio")}
      <small>${esc(fmtDate(sh.date, { weekday: "long", day: "numeric", month: "short" }))}</small>
      <div class="grid2">
        <label class="f" for="c-type">Activity<select id="c-type">${CARDIO.map(([k, l]) => `<option value="${k}"${k === type ? " selected" : ""}>${l}</option>`).join("")}</select></label>
        <label class="f" for="c-min">Time<div class="inp-u"><input id="c-min" type="number" inputmode="decimal" min="0" placeholder="30"><em>min</em></div></label>
        <label class="f" for="c-km">Distance (optional)<div class="inp-u"><input id="c-km" type="number" inputmode="decimal" min="0" step="0.01" placeholder="3.2"><em>km</em></div></label>
        <label class="f" for="c-rpe">Effort<select id="c-rpe"><option value="">–</option>${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1} – ${["very easy", "easy", "easy", "comfortable", "steady", "steady", "hard", "hard", "very hard", "all out"][i]}</option>`).join("")}</select></label>
      </div>
      <label class="f" for="c-note">Note (optional)<input id="c-note" type="text" placeholder="Finished all intervals, shins fine"></label>
      <button class="btn primary wide" data-act="cardio-save">Save</button>`;
  }

  function sheetGuide() { return head("Food guide") + nutritionGuide(); }

  // ----- Hevy sheet -----
  function parseLooseDate(l) {
    const s = String(l).toLowerCase();
    let m = s.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
    m = s.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})/);
    if (m) return `${m[3]}-${pad(MONTHS.indexOf(m[1]) + 1)}-${pad(+m[2])}`;
    m = s.match(/\b(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?,?\s+(\d{4})/);
    if (m) return `${m[3]}-${pad(MONTHS.indexOf(m[2]) + 1)}-${pad(+m[1])}`;
    return null;
  }
  // Reads two layouts with no AI: Hevy's text share ("Set 1: 20 kg x 10") and the text copied from a
  // hevy.com/workout page ("1" / "50kg x 12 reps" under SETS / WEIGHT & REPS headings).
  const HEVY_NOISE = /^(sets?|weight\s*&\s*reps|weight|reps|duration|volume|records?|best\b.*|download|copy link|share|follow(ers|ing)?|workouts|distance|time|rpe|\d+|[\d,.]+\s*(kg|lbs?)|to (follow|view)\b.*|explore more\b.*)$/i;
  const hevyDuration = (s) => { const m = String(s).match(/^(?:(\d+)\s*h)?\s*(?:(\d+)\s*m(?:in)?)?$/i); return m && (m[1] || m[2]) ? (+m[1] || 0) * 60 + (+m[2] || 0) : null; };
  function hevySet(l) {
    const w = l.match(/([+-]?\d+(?:[.,]\d+)?)\s*(kg|lbs?)\s*[x×*]\s*(\d+)/i);
    if (w) { const kg = parseFloat(w[1].replace(",", ".")) * (/lb/i.test(w[2]) ? 0.4536 : 1); return { kg: Math.max(0, r1(kg)), reps: +w[3] }; }
    const prefix = l.match(/^(?:set\s+\w{1,3}\s*:?\s*|w\s*:\s*)/i);
    const rest = prefix ? l.slice(prefix[0].length) : l;
    if (prefix || /^\d+\s*reps?$/i.test(l) || /^\d+:\d{2}$/.test(l)) {
      const reps = rest.match(/^(\d+)\s*reps?\b/i), mmss = rest.match(/^(\d+):(\d{2})\b/), secs = rest.match(/^(\d+)\s*s(?:ec)?\b/i);
      if (reps) return { kg: 0, reps: +reps[1] };
      if (mmss) return { sec: +mmss[1] * 60 + +mmss[2] };
      if (secs) return { sec: +secs[1] };
      if (prefix) return { raw: l.slice(0, 40) };
    }
    return null;
  }
  function parseHevy(txt) {
    const all = String(txt).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (!all.length) return null;
    const lines = all.filter((l) => !/^@hevy/i.test(l));
    let url = null, durationMin = null, pending = null, cur = null, title = null, date = null;
    const di = lines.findIndex((l) => parseLooseDate(l));
    if (di >= 0) {
      date = parseLooseDate(lines[di]);
      const next = lines[di + 1], after = lines[di + 2];
      // Web page: the title comes right after the date. Text share: the title is the line before it.
      if (next && !hevySet(next) && !HEVY_NOISE.test(next) && after && !hevySet(after) && !/^sets?$/i.test(after)) title = next;
      else if (di > 0) title = lines[di - 1];
    }
    const exercises = [];
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      const u = l.match(/https?:\/\/\S*hevy\S*/i);
      if (u) { url = u[0]; continue; }
      if (i === di || l === title) continue;
      if (/^duration$/i.test(l) && hevyDuration(lines[i + 1]) != null) { durationMin = hevyDuration(lines[++i]); continue; }
      const inline = l.match(/^duration[:\s]+(.+)$/i);
      if (inline && hevyDuration(inline[1].trim()) != null) { durationMin = hevyDuration(inline[1].trim()); continue; }
      const set = hevySet(l);
      if (set) {
        if (pending) { cur = { name: pending.slice(0, 80), sets: [] }; exercises.push(cur); pending = null; }
        if (cur) cur.sets.push(set);
      } else if (!HEVY_NOISE.test(l)) pending = l;
    }
    return { title: String(title || lines[0]).slice(0, 80), date, url, durationMin, exercises: exercises.filter((e) => e.sets.length) };
  }
  function sheetHevy(sh) {
    if (!sh.parsed) {
      return `${head("Add a Hevy workout")}
        <p class="muted">Open your Hevy workout link in Chrome, select all the text on the page, copy it, and paste it here. The phone reads it itself, with no AI.</p>
        <textarea id="h-text" rows="9" placeholder="Afternoon workout&#10;Sep 14, 2026, 8:33 AM&#10;Chest Press (Machine)&#10;1&#10;50kg x 12 reps&#10;2&#10;50kg x 12 reps">${esc(sh.text || "")}</textarea>
        ${sh.error ? `<p class="err">${esc(sh.error)}</p>` : ""}
        ${sh.link ? `<a class="btn small" href="${esc(safeUrl(sh.link))}" target="_blank" rel="noopener">Open the workout</a>` : ""}
        ${sh.busy ? `<div class="busy"><span class="spinner"></span><span>Claude is reading the workout…</span></div>` : ""}
        <div class="row end">${aiOn() ? `<button class="btn" data-act="hevy-ai"${sh.busy ? " disabled" : ""}>${I.spark}Read with Claude</button>` : ""}<button class="btn primary" data-act="hevy-parse"${sh.busy ? " disabled" : ""}>Read workout</button></div>`;
    }
    const w = sh.parsed;
    const sets = w.exercises.reduce((s, e) => s + e.sets.length, 0);
    return `${head("Check the workout")}
      <div class="grid3">
        <label class="f" for="h-title">Name<input id="h-title" type="text" value="${esc(w.title || "Workout")}"></label>
        <label class="f" for="h-date">Date<input id="h-date" type="date" value="${esc(w.date || today())}"></label>
        <label class="f" for="h-dur">Duration<div class="inp-u"><input id="h-dur" type="number" min="0" value="${w.durationMin || ""}" placeholder="–"><em>min</em></div></label>
      </div>
      <p class="muted">${w.exercises.length} exercises · ${sets} sets · ${fmt(volumeOf(w.exercises))} kg moved</p>
      <div class="stack">${w.exercises.map((e) => `<div class="ex"><span class="exn">${esc(e.name)}</span><span></span><span class="sets">${e.sets.map(setText).join(", ")}</span></div>`).join("")}</div>
      <div class="row end"><button class="btn" data-act="hevy-back">Back</button><button class="btn primary" data-act="hevy-save">Save workout</button></div>`;
  }
  function normalizeWorkout(j) {
    if (!j || !Array.isArray(j.exercises)) return null;
    const exercises = j.exercises.slice(0, 40).map((e) => ({
      name: String((e && e.name) || "Exercise").slice(0, 80),
      sets: (Array.isArray(e && e.sets) ? e.sets : []).slice(0, 30).map((s) => {
        const o = { kg: Math.max(0, r1(num(s && s.kg) || 0)) };
        if (num(s && s.reps) > 0) o.reps = r0(num(s.reps));
        if (num(s && s.sec) > 0) o.sec = r0(num(s.sec));
        return o;
      }).filter((s) => s.reps != null || s.sec != null),
    })).filter((e) => e.sets.length);
    return { title: String(j.title || "Workout").slice(0, 80), date: /^\d{4}-\d{2}-\d{2}$/.test(j.date || "") ? j.date : null, durationMin: num(j.durationMin) || null, url: j.url || null, exercises };
  }

  // ----- save-meal sheet -----
  function sheetSaveMeal(sh) {
    const items = foodsOf(sh.date).filter((e) => (e.meal || "other") === sh.meal);
    const k = items.reduce((a, e) => a + e.n.kcal, 0);
    return `${head("Save as a meal")}
      <p class="muted">${items.length} item${items.length === 1 ? "" : "s"}, ${fmt(k)} kcal: ${esc(items.map((e) => e.name).join(", "))}. Saved meals sit at the top of food search, ready to add in one tap.</p>
      <label class="f" for="sm-name">Name<input id="sm-name" type="text" maxlength="60" value="${esc("My " + mealLabel(sh.meal).toLowerCase())}"></label>
      <div class="row end"><button class="btn" data-act="close">Cancel</button><button class="btn primary" data-act="savemeal">Save meal</button></div>`;
  }

  // ----- settings sheet -----
  const appUrl = () => location.origin + location.pathname.replace(/index\.html$/, "");
  function sheetSettings(sh) {
    const p = prof(), t = targets(), o = p.override || {};
    const sel = (id, opts, val, extra) => `<select id="${id}"${extra || ""}>${opts.map(([v, l]) => `<option value="${v}"${String(v) === String(val) ? " selected" : ""}>${l}</option>`).join("")}</select>`;
    const sm = savedMeals(), smIds = Object.keys(sm).filter((id) => sm[id] && Array.isArray(sm[id].items));
    if (typeof window.qrcode !== "function") loadQr();
    return `${head("Settings")}
      <h3>Profile and targets</h3>
      <div class="grid2">
        <label class="f" for="s-name">Name<input id="s-name" type="text" value="${esc(p.name || "")}" placeholder="Optional"></label>
        <label class="f" for="s-age">Age<input id="s-age" type="number" min="14" max="90" value="${p.age == null ? "" : p.age}"></label>
        <label class="f" for="s-h">Height<div class="inp-u"><input id="s-h" type="number" step="0.5" min="120" max="230" value="${p.heightCm == null ? "" : p.heightCm}" placeholder="e.g. 175"><em>cm</em></div></label>
        <label class="f" for="s-w">Weight now<div class="inp-u"><input id="s-w" type="number" step="0.1" min="30" max="250" value="${p.weightKg == null ? "" : p.weightKg}" placeholder="e.g. 78"><em>kg</em></div></label>
        <label class="f" for="s-goal">Goal weight<div class="inp-u"><input id="s-goal" type="number" step="0.1" min="30" max="250" value="${p.goalKg == null ? "" : p.goalKg}" placeholder="optional"><em>kg</em></div></label>
        <label class="f" for="s-sex">Sex${sel("s-sex", [["male", "Male"], ["female", "Female"]], p.sex)}</label>
        <label class="f" for="s-act">Activity${sel("s-act", [[1.375, "Light: desk job, 3 workouts"], [1.55, "Moderate: desk job, 5–6 workouts"], [1.65, "High: active job or 6 workouts + runs"], [1.725, "Very high: physical job + training"]], p.activity)}</label>
        <label class="f" for="s-def">Deficit${sel("s-def", [[10, "Gentle, 10%"], [15, "Steady, 15%"], [20, "Standard, 20%"], [25, "Aggressive, 25%"]], p.deficit)}</label>
        <label class="f" for="s-pmax">Protein ceiling<div class="inp-u"><input id="s-pmax" type="number" min="60" max="250" value="${p.proteinMax || 120}"><em>g</em></div></label>
        <label class="f" for="s-steps">Daily step goal<input id="s-steps" type="number" inputmode="numeric" min="1000" max="40000" step="500" value="${p.stepGoal || 6000}"></label>
      </div>
      <p class="note">${t.estimated ? "Add height and weight to calculate your targets." : `Resting burn about ${fmt(t.bmr)} kcal, maintenance about ${fmt(t.tdee)} kcal. Target: <b>${fmt(t.kcal)} kcal</b>, ${fmt(t.p)} g protein, ${fmt(t.c)} g carbs, ${fmt(t.f)} g fat. ${num(o.kcal) ? "Calories stay at your number below until you change it." : "Calories follow your 7-day average weight once you weigh in daily."}`}</p>
      <p class="muted">To set your own numbers, fill these in. Leave them blank to use the calculated targets.</p>
      <div class="grid2">
        <label class="f" for="o-kcal">Calories<div class="inp-u"><input id="o-kcal" type="number" min="0" value="${o.kcal || ""}" placeholder="${t.estimated ? "" : fmt(t.kcal)}"><em>kcal</em></div></label>
        <label class="f" for="o-p">Protein<div class="inp-u"><input id="o-p" type="number" min="0" value="${o.p || ""}"><em>g</em></div></label>
        <label class="f" for="o-c">Carbs<div class="inp-u"><input id="o-c" type="number" min="0" value="${o.c || ""}"><em>g</em></div></label>
        <label class="f" for="o-f">Fat<div class="inp-u"><input id="o-f" type="number" min="0" value="${o.f || ""}"><em>g</em></div></label>
      </div>
      <div class="row end"><button class="btn primary" data-act="saveprofile">Save profile</button></div>

      <hr class="sep">
      <h3>Claude estimates</h3>
      <p class="muted">Food search is instant and works offline. Claude only runs when you use Photo or Describe for something new, and each item it estimates is saved to My foods for next time. It uses your own Anthropic API key, billed to your Anthropic account.</p>
      ${S.meta.apiKey ? `<p class="note">A key ending in <b>${esc(String(S.meta.apiKey).slice(-4))}</b> is saved on this phone.</p>` : ""}
      <div class="row"><input id="s-key" type="password" autocomplete="off" spellcheck="false" placeholder="${S.meta.apiKey ? "Paste a new key to replace it" : "Paste your API key (sk-ant-…)"}" aria-label="Anthropic API key" style="flex:1"><button class="btn small primary" data-act="savekey">Save key</button></div>
      ${S.meta.apiKey ? `<div class="row"><button class="btn small" data-act="checkkey"${sh.keyBusy ? " disabled" : ""}>Test the key</button><button class="btn small danger" data-act="removekey">Remove key</button></div>` : ""}
      ${sh.keyBusy ? `<div class="busy"><span class="spinner"></span><span>Checking with Anthropic…</span></div>` : ""}
      ${sh.keyMsg ? `<p class="${sh.keyOk ? "note" : "err"}">${esc(sh.keyMsg)}</p>` : ""}
      <small>Estimates use Claude Haiku 5.5, the fastest and cheapest Claude model, at roughly a tenth of a US cent per photo. The key stays on this phone and is sent only to Anthropic. Set a monthly spend limit in the Anthropic console.</small>

      <hr class="sep">
      <h3>Food database</h3>
      <p class="muted">Common Indian foods are built in. ${INDB_FOODS.length ? `Cooked dishes from the Indian Nutrient Databank are also stored on this phone${S.indbAt ? ", downloaded " + esc(fmtDate(iso(new Date(S.indbAt)), { day: "numeric", month: "short", year: "numeric" })) : ""}.` : "Cooked dishes from the Indian Nutrient Databank download once (about 1 MB) and then work offline."}</p>
      ${S.indbBusy ? `<div class="busy"><span class="spinner"></span><span>Downloading dishes…</span></div>` : `<div class="row"><button class="btn small" data-act="indb">${INDB_FOODS.length ? "Download again" : "Download dishes"}</button></div>`}
      ${S.indbError ? `<p class="err">${esc(S.indbError)}</p>` : ""}
      <small>Indian Nutrient Databank, Jaacks Lab, University of Edinburgh. Deep-fried dishes are left out because the source counts all the frying oil, and so are egg, fish and meat dishes other than chicken.</small>
      ${smIds.length ? `<h3>Saved meals</h3><ul class="items">${smIds.map((id) => { const m = sm[id], k = m.items.reduce((a, e) => a + (Number(e.n && e.n.kcal) || 0), 0); return `<li class="item" style="cursor:default"><div class="nm">${esc(m.name)}<small>${m.items.length} item${m.items.length === 1 ? "" : "s"} · ${fmt(k)} kcal</small></div><span></span><button class="icon-btn" data-act="delsaved" data-id="${esc(id)}" aria-label="Delete ${esc(m.name)}">${I.trash}</button></li>`; }).join("")}</ul>` : ""}

      <hr class="sep">
      <h3>Install it on your phone</h3>
      <div class="phone">${qrSvg(appUrl())}
        <ol class="plain">
          <li>Scan the code with your phone camera, or open the link below in Chrome on the phone.</li>
          <li>In Chrome tap ⋮, then <b>Install app</b> or <b>Add to Home screen</b>. It opens full screen and works offline.</li>
          <li>Each phone or browser keeps its own log. To move it, download a backup here and restore it there.</li>
        </ol>
      </div>
      <div class="row"><input id="s-link" type="text" readonly value="${esc(appUrl())}" aria-label="Link to Beach Body" style="flex:1"><button class="btn small" data-act="copylink">Copy link</button></div>

      ${S.accessOn ? `<hr class="sep">
      <h3>Privacy</h3>
      <p class="muted">Beach Body asks for your passcode the first time it opens on a device. Your log and API key never leave this phone, so anyone else who opens the link only gets an empty app of their own.</p>
      <div class="row"><button class="btn small" data-act="lockdevice">Lock this device</button></div>` : ""}

      <hr class="sep">
      <h3>Your data</h3>
      <p class="muted">Everything, photos included, is stored on this device${S.persisted ? " and protected from automatic clean-up" : ""}. Nothing is uploaded anywhere. Download a backup every week or two, and always before clearing Chrome's data or changing phones. ${S.meta.lastBackup ? "Last backup: " + esc(fmtDate(S.meta.lastBackup, { day: "numeric", month: "short", year: "numeric" })) + "." : "No backup yet."}</p>
      ${sh.importData ? `<p class="note warn">Restore ${esc(sh.importInfo)}? Entries with the same date are replaced.</p><div class="row"><button class="btn" data-act="import-cancel">Cancel</button><button class="btn primary" data-act="import-go"${sh.importBusy ? " disabled" : ""}>Restore</button></div>`
        : `<div class="row"><button class="btn small" data-act="export">Download backup</button><label class="btn small" for="s-import">Restore a backup</label><input id="s-import" class="vh" type="file" accept="application/json,.json" data-file="import"></div>`}`;
  }

  // The QR library loads only when settings opens.
  let qrLoading = false;
  function loadQr() {
    if (qrLoading) return;
    qrLoading = true;
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";
    s.onload = () => { if (S.sheet && S.sheet.type === "settings") renderSheet(); };
    s.onerror = () => { qrLoading = false; };
    document.head.appendChild(s);
  }
  // Black-on-white so every phone camera can read it, whatever the theme.
  function qrSvg(text) {
    if (typeof window.qrcode !== "function") return "";
    try {
      const qr = window.qrcode(0, "M");
      qr.addData(text);
      qr.make();
      const n = qr.getModuleCount(), q = 4, size = n + q * 2;
      let d = "";
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c + q},${r + q}h1v1h-1z`;
      return `<svg class="qr" viewBox="0 0 ${size} ${size}" role="img" aria-label="QR code that opens Beach Body" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#ffffff"/><path d="${d}" fill="#000000"/></svg>`;
    } catch (e) { return ""; }
  }

  // ---------- images ----------
  async function compressImage(file, maxDim, quality) {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
      const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(img.naturalWidth * scale));
      c.height = Math.max(1, Math.round(img.naturalHeight * scale));
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      const blob = await new Promise((res) => c.toBlob(res, "image/jpeg", quality));
      if (!blob) throw new Error("encode failed");
      return blob;
    } finally { URL.revokeObjectURL(url); }
  }
  const blobToDataURL = (b) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(b); });
  const blobToBase64 = (b) => blobToDataURL(b).then((u) => String(u).slice(String(u).indexOf(",") + 1));

  const photoCap = () => 4;
  async function addFoodPhotos(files) {
    const sh = S.sheet;
    if (!sh || sh.type !== "food") return;
    grabFoodInputs(sh);
    sh.photos = sh.photos || [];
    const list = Array.from(files || []).filter((f) => /^image\//.test(f.type) || /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(f.name || ""));
    if (!list.length) { toast("That file isn't a photo."); return; }
    const cap = photoCap();
    for (const f of list) {
      if (sh.photos.length >= cap) { toast(`Up to ${cap} photos per meal`); break; }
      let blob;
      try { blob = await compressImage(f, 1400, 0.86); } catch (e) { blob = f; }
      if (S.sheet !== sh) return;
      sh.photos.push({ blob, url: URL.createObjectURL(blob) });
    }
    sh.mode = "photo"; sh.results = null; sh.pick = null; sh.error = null;
    renderSheet();
  }
  function onFoodPhoto(input) { const files = Array.from(input.files || []); input.value = ""; addFoodPhotos(files); }

  async function onProgressPhoto(input) {
    const f = input.files && input.files[0];
    input.value = "";
    if (!f) return;
    const pose = input.dataset.pose, d = S.ui.bodyDate;
    const old = S.col.measures[d] && S.col.measures[d].photos && S.col.measures[d].photos[pose];
    try {
      const blob = await compressImage(f, 1600, 0.86).catch(() => f);
      const id = await Photos.save(blob);
      const ok = await Store.patch("measures", d, { date: d, photos: { [pose]: id } });
      if (ok && old) Photos.remove(old);
      toast("Photo saved on this phone");
    } catch (e) { saveError(e); }
  }

  // ---------- backup ----------
  async function exportBackup() {
    toast("Preparing backup…", 20000);
    try {
      const photos = {};
      for (const m of Object.values(S.col.measures)) {
        for (const pose of POSES) {
          const v = m && m.photos && m.photos[pose];
          if (v && !String(v).startsWith("data:") && !photos[v]) { const b = await Photos.blob(v); if (b) photos[v] = await blobToDataURL(b); }
        }
      }
      const body = JSON.stringify({ app: "beach-body", v: 2, exported: new Date().toISOString(), data: S.col, photos });
      const url = URL.createObjectURL(new Blob([body], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url; a.download = `beach-body-backup-${today()}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 15000);
      await Store.setMeta("lastBackup", today());
      toast("Backup downloaded");
      if (S.sheet && S.sheet.type === "settings") renderSheet();
    } catch (e) { console.warn(e); toast("Couldn't make the backup. Try again."); }
  }
  async function onImport(input) {
    const f = input.files && input.files[0];
    input.value = "";
    if (!f || !S.sheet) return;
    try {
      const j = JSON.parse(await f.text());
      const data = (j && j.data) || j;
      if (!data || typeof data !== "object" || !data.days) throw new Error("bad");
      S.sheet.importData = data;
      S.sheet.importPhotos = (j && j.photos) || {};
      const count = (o, one, many) => { const n = Object.keys(o || {}).length; return `${n} ${n === 1 ? one : many}`; };
      S.sheet.importInfo = `${count(data.days, "day", "days")}, ${count(data.workouts, "workout", "workouts")} and ${count(data.measures, "check-in", "check-ins")}`;
      renderSheet();
    } catch (e) { toast("That file isn't a Beach Body backup."); }
  }
  async function restoreBackup() {
    const sh = S.sheet, data = sh.importData, photos = sh.importPhotos || {}, okId = /^[A-Za-z0-9_.~:@+-]{1,120}$/;
    sh.importBusy = true; renderSheet();
    let n = 0;
    for (const c of Object.keys(S.col)) {
      for (const id of Object.keys(data[c] || {})) {
        let doc = data[c][id];
        if (!okId.test(id) || !isObj(doc)) continue;
        if (c === "measures" && isObj(doc.photos)) {
          const ph = {};
          for (const pose of POSES) {
            const v = doc.photos[pose], src = v && (String(v).startsWith("data:") ? v : photos[v]);
            if (src) { try { ph[pose] = await Photos.save(await (await fetch(src)).blob()); } catch (e) { /* skip unreadable photo */ } }
          }
          doc = Object.assign({}, doc, { photos: ph });
        }
        await Store.put(c, id, doc);
        n++;
      }
    }
    closeSheet();
    toast(`Restored ${n} records`);
  }

  // ---------- review ----------
  function reviewPrompt() {
    const t = targets(), p = prof(), end = today();
    const rows = [];
    for (let i = 6; i >= 0; i--) {
      const d = addDays(end, -i), tot = totalsOf(d), dd = day(d);
      rows.push({
        date: d, weekday: DOW_SHORT[dow(d)], gymDone: gymDone(d),
        gymLogged: workoutsOn(d).map((w) => w.title), cardio: cardioOf(d).map((c) => `${c.type} ${c.min || "?"} min${c.km ? " " + c.km + " km" : ""}`),
        foodLogged: foodsOf(d).length > 0, kcal: r0(tot.kcal), protein: r0(tot.p), carbs: r0(tot.c), fat: r0(tot.f), fiber: r0(tot.fib), sodiumMg: r0(tot.na),
        weightKg: dd.weight == null ? null : dd.weight, steps: dd.steps == null ? null : dd.steps, sleepH: dd.sleep == null ? null : dd.sleep,
      });
    }
    return `You are a direct, encouraging strength and nutrition coach. Write a weekly check-in addressed to the person as "you".
About them: 24-year-old man easing back into training after a 60-day break with almost no activity, taking it slowly at first. Goal: a lean, shredded swimmer's physique (broad shoulders, lats, arms, visible abs, leaner athletic legs). Eats vegetarian food plus chicken, no eggs, and can manage 100–120 g protein a day at most. Logs lifting in Hevy and cardio separately. Weeks start on Sunday.
Daily targets: ${t.kcal} kcal, ${t.p} g protein, ${t.c} g carbs, ${t.f} g fat, 35 g fiber. Step goal ${stepGoal()}. Height ${p.heightCm || "unknown"} cm, goal weight ${p.goalKg || "unknown"} kg.
Weight trend: ${rateCheck().short}.
Last 7 days as JSON: ${JSON.stringify(rows)}
Days with foodLogged false were not tracked, so don't count them as zero intake.
Write plain text with no markdown, headings or bold. Exactly five lines, each starting with "• ": what went well, the biggest gap, one food fix naming specific Indian foods, one training or running note, and one concrete change for next week with a number. Under 140 words.`;
  }
  async function runReview() {
    if (!aiOn()) { openSheet({ type: "settings" }); return; }
    const r = (S.ui.review = { busy: true, text: "", err: null, ctl: new AbortController() });
    render();
    try { r.text = await AI.write(reviewPrompt(), { signal: r.ctl.signal, effort: "low" }); }
    catch (e) { r.err = aiError(e) || null; }
    r.busy = false; r.ctl = null;
    render();
  }

  // ---------- toast & confirm ----------
  let toastTimer = null;
  function toast(msg, ms = 2600) {
    const t = $("#toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, ms);
  }
  function armed(el) {
    if (el.dataset.armed) return true;
    el.dataset.armed = "1";
    const html = el.innerHTML;
    el.textContent = "Tap again to confirm";
    setTimeout(() => { if (el.isConnected && el.dataset.armed) { delete el.dataset.armed; el.innerHTML = html; } }, 3500);
    return false;
  }

  // ---------- actions ----------
  function remember() { try { localStorage.setItem("beachbody.ui", JSON.stringify({ tab: S.ui.tab, trainSub: S.ui.trainSub })); } catch (e) { /* ignore */ } }
  const val = (id) => { const el = $("#" + id); return el ? el.value : ""; };

  const ACT = {
    tab(el) { S.ui.tab = el.dataset.tab; if (el.dataset.sub) S.ui.trainSub = el.dataset.sub; remember(); render(); window.scrollTo(0, 0); },
    day(el) { const n = +el.dataset.n; S.ui.date = n === 0 ? today() : addDays(S.ui.date, n); render(); },
    settings() { openSheet({ type: "settings" }); },
    close() { closeSheet(); },
    addfood(el) {
      openSheet({ type: "food", meal: el.dataset.meal || guessMeal(), mode: el.dataset.mode || "search", date: S.ui.date });
      if (!el.dataset.mode) setTimeout(() => { const q = $("#f-q"); if (q && window.matchMedia("(hover: hover)").matches) q.focus(); }, 30);
    },
    "savemeal-open"(el) { openSheet({ type: "savemeal", meal: el.dataset.meal, date: S.ui.date }); },
    savemeal() {
      const sh = S.sheet, items = foodsOf(sh.date).filter((e) => (e.meal || "other") === sh.meal);
      if (!items.length) { closeSheet(); return; }
      saveMeal(val("sm-name"), sh.meal, items);
      closeSheet();
      toast("Meal saved. Find it at the top of food search.");
    },
    addsaved(el) {
      const m = savedMeals()[el.dataset.id], sh = S.sheet;
      if (!m || !sh) return;
      addEntries(sh.date, sh.meal, m.items.map((e) => ({ name: e.name, g: e.g, n: e.n, src: e.src })));
      closeSheet();
    },
    delsaved(el) { if (!armed(el)) return; Store.patch("config", "meals", { items: { [el.dataset.id]: null } }).then(() => renderSheet()); },
    async savekey() {
      const k = val("s-key").trim(), sh = S.sheet;
      if (!/^sk-ant-[A-Za-z0-9_-]{20,}$/.test(k)) { sh.keyMsg = "That doesn't look like an Anthropic API key. It starts with sk-ant-."; sh.keyOk = false; renderSheet(); return; }
      await Store.setMeta("apiKey", k);
      sh.keyMsg = "Key saved on this phone. Tap Test the key to check it."; sh.keyOk = true;
      renderSheet(); scheduleRender();
    },
    async removekey(el) {
      if (!armed(el)) return;
      await Store.setMeta("apiKey", null);
      AI.client = null;
      S.sheet.keyMsg = "Key removed from this phone."; S.sheet.keyOk = true;
      renderSheet(); scheduleRender();
    },
    async checkkey() {
      const sh = S.sheet;
      sh.keyBusy = true; sh.keyMsg = null; renderSheet();
      try {
        const out = await AI.json("Reply with ok set to true.", { type: "object", additionalProperties: false, required: ["ok"], properties: { ok: { type: "boolean" } } }, { effort: "low" });
        sh.keyOk = !!(out && out.ok); sh.keyMsg = sh.keyOk ? "The key works." : "The key answered, but not as expected. Try again.";
      } catch (e) { sh.keyOk = false; sh.keyMsg = aiError(e) || "Stopped."; }
      sh.keyBusy = false;
      if (S.sheet === sh) renderSheet();
    },
    indb() { downloadIndb(); },
    lockdevice(el) { if (!armed(el)) return; lsSet(ACCESS_KEY, null); location.reload(); },
    "food-meal"(el) { S.sheet.meal = el.dataset.meal; renderSheet(); },
    "food-mode"(el) { S.sheet.mode = el.dataset.mode; S.sheet.error = null; renderSheet(); if (el.dataset.mode === "search") setTimeout(() => { const q = $("#f-q"); if (q) q.focus(); }, 30); },
    "food-estimate"() { estimateFood(); },
    "food-unphoto"(el) {
      const sh = S.sheet, p = sh.photos && sh.photos.splice(+el.dataset.i, 1)[0];
      if (p) URL.revokeObjectURL(p.url);
      grabFoodInputs(sh); renderSheet();
    },
    copylink() {
      const p = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(appUrl()) : Promise.reject(new Error("no clipboard"));
      p.then(() => toast("Link copied"), () => { const el = $("#s-link"); if (el) { el.focus(); el.select(); } toast("Link selected. Press Ctrl+C to copy."); });
    },
    "food-stop"() { if (S.sheet && S.sheet.ctl) S.sheet.ctl.abort(); },
    "food-pick"(el) {
      const f = S.sheet.opts && S.sheet.opts[el.dataset.fid];
      if (!f) return;
      const servingIsGrams = /^[\d.,]+ g$/.test(f.serving.label);
      S.sheet.pick = { f, qty: servingIsGrams ? r1(f.serving.g) : 1, unit: servingIsGrams ? "g" : "s" };
      renderSheet();
      setTimeout(() => { const q = $("#p-qty"); if (q) q.select(); }, 30);
    },
    "pick-back"() { S.sheet.pick = null; renderSheet(); },
    "pick-add"() {
      const sh = S.sheet, g = pickGrams(sh), f = sh.pick.f;
      if (!(g > 0)) { toast("Enter an amount"); return; }
      addEntries(sh.date, sh.meal, [{ name: f.name, g, n: scaleN(f.per100, g / 100), src: f.mine ? "mine" : f.recent ? "recent" : "db" }]);
      closeSheet();
    },
    "manual-add"() {
      const sh = S.sheet, n = zeroN();
      const name = val("mn-name").trim() || "Food";
      const g = num(val("mn-g")) || 100;
      n.kcal = num(val("mn-kcal")) || 0; n.p = num(val("mn-p")) || 0; n.c = num(val("mn-c")) || 0; n.f = num(val("mn-f")) || 0; n.fib = num(val("mn-fib")) || 0;
      if (!n.kcal && !n.p && !n.c && !n.f) { toast("Enter calories or macros first"); return; }
      if (!n.kcal) n.kcal = n.p * 4 + n.c * 4 + n.f * 9;
      addEntries(sh.date, sh.meal, [{ name, g, n, src: "manual" }]);
      if ($("#mn-save") && $("#mn-save").checked) saveMyFood(name, n, g);
      closeSheet();
    },
    "res-del"(el) { const sh = S.sheet; sh.results.splice(+el.dataset.i, 1); if (!sh.results.length) sh.results = null; renderSheet(); },
    "res-back"() { S.sheet.results = null; renderSheet(); },
    "res-add"() {
      const sh = S.sheet;
      const list = sh.results.filter((r) => r.g > 0).map((r) => ({ name: r.name.trim() || "Food", g: r.g, n: scaleN(r.n0, r.g / r.g0), src: "ai" }));
      if (!list.length) { toast("Every item has 0 g"); return; }
      addEntries(sh.date, sh.meal, list);
      sh.results.filter((r) => r.save && r.g > 0).forEach((r) => saveMyFood(r.name.trim() || "Food", scaleN(r.n0, r.g / r.g0), r.g));
      closeSheet();
    },
    entry(el) { openSheet({ type: "entry", id: el.dataset.id, date: S.ui.date }); },
    "entry-save"() {
      const sh = S.sheet, e = foodsOf(sh.date).find((x) => x.id === sh.id);
      if (!e) { closeSheet(); return; }
      const g = num(val("e-g")) || e.g;
      patchDay(sh.date, { foods: { [sh.id]: { meal: val("e-meal") || e.meal, name: val("e-name").trim() || e.name, g: r1(g), n: roundN(scaleN(e.n, g / e.g)), src: e.src || "db", t: e.t || Date.now() } } });
      closeSheet();
    },
    "entry-del"(el) { if (!armed(el)) return; const sh = S.sheet; patchDay(sh.date, { foods: { [sh.id]: null } }); closeSheet(); toast("Removed"); },
    "entry-mine"() {
      const sh = S.sheet, e = foodsOf(sh.date).find((x) => x.id === sh.id);
      if (!e) return;
      const g = num(val("e-g")) || e.g;
      saveMyFood(val("e-name").trim() || e.name, scaleN(e.n, g / e.g), g);
      toast("Saved to My Foods");
    },
    copymeal(el) {
      const d = S.ui.date, k = el.dataset.meal;
      const y = foodsOf(addDays(d, -1)).filter((e) => e.meal === k);
      if (y.length) addEntries(d, k, y.map((e) => ({ name: e.name, g: e.g, n: e.n, src: e.src })));
    },
    water(el) { const d = S.ui.date; patchDay(d, { water: Math.max(0, (day(d).water || 0) + +el.dataset.n) }); },
    check(el) { const d = S.ui.date, k = el.dataset.k; patchDay(d, { checks: { [k]: !(day(d).checks && day(d).checks[k]) } }); },
    cardio(el) { openSheet({ type: "cardio", date: el.dataset.date || S.ui.date, ctype: el.dataset.type || null }); },
    "cardio-save"() {
      const sh = S.sheet, type = val("c-type");
      const min = num(val("c-min")), km = num(val("c-km"));
      if (!min && !km) { toast("Enter the time or distance"); return; }
      patchDay(sh.date, { cardio: { [uid()]: { type, min, km, rpe: num(val("c-rpe")), note: val("c-note").trim().slice(0, 140), t: Date.now() } } });
      closeSheet();
      toast(`${cardioLabel(type)} saved`);
    },
    delcardio(el) { if (!armed(el)) return; patchDay(el.dataset.date, { cardio: { [el.dataset.id]: null } }); },
    guide() { openSheet({ type: "guide" }); },
    trainsub(el) { S.ui.trainSub = el.dataset.sub; remember(); render(); },
    trainweek(el) { const n = +el.dataset.n; S.ui.trainWeek = n === 0 ? 0 : S.ui.trainWeek + n; render(); },
    gotoday(el) { S.ui.date = el.dataset.date; S.ui.tab = "today"; remember(); render(); window.scrollTo(0, 0); },
    bodydate(el) { S.ui.bodyDate = el.dataset.date; render(); },
    hevy() { openSheet({ type: "hevy" }); },
    "hevy-parse"() {
      const sh = S.sheet;
      sh.text = val("h-text");
      const w = parseHevy(sh.text);
      const link = (sh.text.match(/https?:\/\/(?:www\.)?hevy\.com\/(?:workout|user)\/[\w-]+/i) || [])[0];
      if (!w || !w.exercises.length) {
        sh.link = link || null;
        const profile = (link && /\/user\//i.test(link)) || /^\d+\s+sets?\s+\S/im.test(sh.text);
        sh.error = profile ? "That's your Hevy profile. It only lists exercises from your latest workout, without weights or reps. Open the workout itself, then copy that page."
          : link ? "A link on its own can't be read: Hevy only shows the sets on its own page. Open the workout below, select all the text on the page, copy it, and paste it here."
          : "No sets found in that text. Paste the whole workout page, with lines like \"50kg x 12 reps\".";
        renderSheet(); return;
      }
      sh.parsed = w; sh.error = null; sh.link = null; renderSheet();
    },
    async "hevy-ai"() {
      const sh = S.sheet;
      sh.text = val("h-text");
      if (!sh.text.trim()) { sh.error = "Paste the workout first."; renderSheet(); return; }
      if (!aiOn()) { sh.error = aiError({ code: "no_key" }); renderSheet(); return; }
      sh.busy = true; sh.error = null; sh.ctl = new AbortController(); renderSheet();
      try {
        const j = await AI.json(`Extract this gym workout log. Weights in kg (convert lb by multiplying by 0.4536); use 0 kg for bodyweight sets. A timed set has its seconds in sec and 0 reps; a rep set has 0 sec. Date as YYYY-MM-DD, or an empty string if the text has none. durationMin is 0 when unknown. Skip warm-up notes that are not sets.\n\nWorkout text:\n"""${sh.text.slice(0, 20000)}"""`, WORKOUT_SCHEMA, { effort: "low", signal: sh.ctl.signal });
        if (S.sheet !== sh) return;
        const w = normalizeWorkout(j);
        if (!w || !w.exercises.length) sh.error = "Claude couldn't find any sets in that text.";
        else sh.parsed = w;
      } catch (e) {
        if (S.sheet !== sh) return;
        sh.error = aiError(e) || null;
      }
      sh.busy = false; sh.ctl = null; renderSheet();
    },
    "hevy-back"() { S.sheet.parsed = null; renderSheet(); },
    "hevy-save"() {
      const w = S.sheet.parsed;
      const date = val("h-date") || today();
      const hid = w.url && (w.url.match(/workout\/([A-Za-z0-9_-]+)/) || [])[1];
      const doc = { date, title: val("h-title").trim() || w.title || "Workout", durationMin: num(val("h-dur")), exercises: w.exercises, volumeKg: r0(volumeOf(w.exercises)), url: w.url || null, src: "hevy-text", t: Date.now() };
      // Same Hevy link, or same day and same volume: treat it as the same workout and update it.
      const id = hid ? "hevy-" + hid : `w-${date}-${doc.volumeKg}`;
      const existed = !!S.col.workouts[id];
      Store.put("workouts", id, doc);
      closeSheet();
      toast(existed ? "Workout updated" : "Workout saved");
    },
    delwo(el) { if (!armed(el)) return; Store.del("workouts", el.dataset.id); },
    savemeasure() {
      const d = val("m-date") || S.ui.bodyDate || today();
      const patch = { date: d };
      MEAS.forEach((f) => { patch[f.k] = num(val("m-" + f.k)); });
      Store.patch("measures", d, patch);
      toast("Check-in saved");
    },
    cmppose(el) { S.ui.cmpPose = el.dataset.pose; render(); },
    saveprofile() {
      const p = {
        name: val("s-name").trim().slice(0, 40), age: num(val("s-age")), heightCm: num(val("s-h")), weightKg: num(val("s-w")), goalKg: num(val("s-goal")),
        sex: val("s-sex") || "male", activity: num(val("s-act")) || 1.55, deficit: num(val("s-def")) || 20, proteinMax: num(val("s-pmax")) || 120,
        stepGoal: num(val("s-steps")) || 6000,
        override: { kcal: num(val("o-kcal")), p: num(val("o-p")), c: num(val("o-c")), f: num(val("o-f")) },
      };
      Store.put("config", "profile", p);
      closeSheet();
      toast("Targets updated");
    },
    export() { exportBackup(); },
    "import-cancel"() { S.sheet.importData = null; renderSheet(); },
    "import-go"() { if (!S.sheet.importBusy) restoreBackup(); },
    review() { runReview(); },
    "review-stop"() { if (S.ui.review && S.ui.review.ctl) S.ui.review.ctl.abort(); },
  };

  const INP = {
    "food-search"(el) { S.sheet.query = el.value; const box = $("#f-results"); if (box) box.innerHTML = foodOptions(S.sheet); },
    pick(el) {
      const sh = S.sheet, unitEl = $("#p-unit"), qEl = $("#p-qty");
      if (el === unitEl && unitEl.value !== sh.pick.unit) {
        const q = num(qEl.value) || 0, sg = sh.pick.f.serving.g;
        qEl.value = unitEl.value === "g" ? r0(q * sg) : r1(q / sg);
        qEl.step = unitEl.value === "g" ? 5 : 0.5;
        sh.pick.unit = unitEl.value;
      }
      sh.pick.qty = num(qEl.value) || 0;
      $("#p-prev").innerHTML = previewN(scaleN(sh.pick.f.per100, pickGrams(sh) / 100));
    },
    "res-name"(el) { S.sheet.results[+el.dataset.i].name = el.value; },
    "res-g"(el) {
      const r = S.sheet.results[+el.dataset.i];
      r.g = Math.max(0, num(el.value) || 0);
      $("#res-n-" + el.dataset.i).innerHTML = resNums(r);
      $("#res-total").innerHTML = resTotal(S.sheet.results);
    },
    "entry-g"(el) {
      const sh = S.sheet, e = foodsOf(sh.date).find((x) => x.id === sh.id);
      if (!e) return;
      sh.g = Math.max(0, num(el.value) || 0);
      $("#e-prev").innerHTML = previewN(scaleN(e.n, sh.g / e.g));
    },
  };
  const CHG = {
    "res-save"(el) { S.sheet.results[+el.dataset.i].save = el.checked; },
    mdate(el) { S.ui.bodyDate = /^\d{4}-\d{2}-\d{2}$/.test(el.value) ? el.value : today(); render(); },
    cmpa(el) { S.ui.cmpA = el.value; render(); },
    cmpb(el) { S.ui.cmpB = el.value; render(); },
  };

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const fn = ACT[el.dataset.act];
    if (!fn) return;
    if (el.tagName !== "SUMMARY") e.preventDefault();
    fn(el, e);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && S.sheet) { closeSheet(); return; }
    if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches('[role="button"][data-act]')) { e.preventDefault(); e.target.click(); }
  });
  document.addEventListener("change", (e) => {
    const el = e.target;
    if (el.matches("[data-field]")) {
      const d = el.dataset.date || S.ui.date, k = el.dataset.field;
      let v = num(el.value);
      if (v != null && v < 0) return;
      if (v != null && k === "steps") v = r0(v);
      patchDay(d, { [k]: v });
    } else if (el.matches("[data-file]")) {
      const kind = el.dataset.file;
      if (kind === "foodphoto") onFoodPhoto(el);
      else if (kind === "photo") onProgressPhoto(el);
      else if (kind === "import") onImport(el);
    } else if (el.matches("[data-change]")) {
      const fn = CHG[el.dataset.change];
      if (fn) fn(el);
    }
  });
  document.addEventListener("input", (e) => {
    const el = e.target;
    if (el.matches && el.matches("[data-input]")) { const fn = INP[el.dataset.input]; if (fn) fn(el); }
  });
  // Photos from the clipboard or dragged in from the desktop.
  const foodSheetTakesPhotos = () => S.sheet && S.sheet.type === "food" && !S.sheet.results && !S.sheet.pick && !S.sheet.busy;
  document.addEventListener("paste", (e) => {
    const files = Array.from((e.clipboardData && e.clipboardData.files) || []).filter((f) => /^image\//.test(f.type));
    if (!files.length) return;
    if (foodSheetTakesPhotos()) { e.preventDefault(); addFoodPhotos(files); }
    else if (!S.sheet && S.ui.tab === "today") { e.preventDefault(); openSheet({ type: "food", meal: guessMeal(), mode: "photo", date: S.ui.date }); addFoodPhotos(files); }
  });
  document.addEventListener("dragover", (e) => {
    if (!foodSheetTakesPhotos()) return;
    e.preventDefault();
    const zone = e.target.closest && e.target.closest("[data-drop]");
    $$("[data-drop]").forEach((d) => d.classList.toggle("over", d === zone));
  });
  document.addEventListener("dragleave", (e) => { const z = e.target.closest && e.target.closest("[data-drop]"); if (z && !z.contains(e.relatedTarget)) z.classList.remove("over"); });
  document.addEventListener("drop", (e) => {
    if (!foodSheetTakesPhotos()) return;
    e.preventDefault();
    const files = e.dataTransfer && e.dataTransfer.files;
    if (files && files.length) addFoodPhotos(files);
  });
  let resizeT = null, lastW = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { const w = ($("#view") && $("#view").clientWidth) || 0; if (Math.abs(w - lastW) > 24 && (S.ui.tab === "body" || S.ui.tab === "trends")) { lastW = w; scheduleRender(); } }, 200);
  });

  // ---------- passcode lock ----------
  // access.json holds a salt and a PBKDF2-SHA256 hash of the passcode, never the passcode itself.
  // It keeps other people out of the app; the log and API key only ever live on each device anyway.
  const ACCESS_KEY = "beachbody.access";
  function lsSet(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  const toB64 = (u8) => btoa(String.fromCharCode.apply(null, Array.from(u8)));
  const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  async function loadAccess() {
    try {
      const r = await fetch("access.json", { cache: "no-store" });
      if (r.status === 404) return { open: true };
      if (!r.ok) throw new Error("HTTP " + r.status);
      const a = await r.json();
      return a && a.hash && a.salt && a.iter ? a : { open: true };
    } catch (e) { return { offline: true }; }
  }
  async function passHash(pass, a) {
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pass.trim()), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: fromB64(a.salt), iterations: a.iter, hash: "SHA-256" }, key, 256);
    return toB64(new Uint8Array(bits));
  }
  function showLock(a) {
    document.body.classList.add("locked");
    const box = $("#lock");
    box.hidden = false;
    box.innerHTML = `<form class="lock-card" id="lock-form" novalidate>
      <div class="brand"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 12V5.5"/><path d="M12 3v1M21 12h-1M12 21v-1M3 12h1"/></svg>Beach Body</div>
      <div class="rope" aria-hidden="true"></div>
      <p class="muted">${a.offline ? "Connect to the internet once to unlock Beach Body on this device." : "This is a private app. Enter the passcode to open it on this device."}</p>
      ${a.offline ? "" : `<label class="vh" for="lock-pass">Passcode</label>
      <input id="lock-pass" type="password" autocomplete="current-password" autocapitalize="off" spellcheck="false" placeholder="Passcode">
      <button class="btn primary wide" type="submit" id="lock-go">Unlock</button>`}
      <p class="err" id="lock-err" role="alert" hidden></p>
    </form>`;
    $("#lock-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = $("#lock-pass"), btn = $("#lock-go"), err = $("#lock-err");
      if (!input || !input.value.trim()) return;
      btn.disabled = true; btn.textContent = "Checking…"; err.hidden = true;
      let ok = false;
      try { ok = (await passHash(input.value, a)) === a.hash; } catch (e2) { ok = false; }
      if (ok) {
        lsSet(ACCESS_KEY, a.hash);
        box.hidden = true; box.innerHTML = "";
        document.body.classList.remove("locked");
        start();
      } else {
        btn.disabled = false; btn.textContent = "Unlock";
        err.textContent = "That passcode isn't right."; err.hidden = false;
        input.select();
      }
    });
    const inp = $("#lock-pass");
    if (inp) setTimeout(() => inp.focus(), 50);
  }

  // ---------- boot ----------
  let started = false;
  function start() {
    if (started) return;
    started = true;
    render();
    lastW = ($("#view") && $("#view").clientWidth) || 0;
    Store.init().then(() => {
      // First launch: fetch the dish database once so search covers it offline afterwards.
      if (!INDB_FOODS.length && Store.mode === "device" && navigator.onLine !== false) downloadIndb();
    });
  }
  async function boot() {
    try {
      const u = JSON.parse(localStorage.getItem("beachbody.ui") || "{}");
      if (["today", "train", "body", "trends"].includes(u.tab)) S.ui.tab = u.tab;
      if (u.trainSub) S.ui.trainSub = u.trainSub;
    } catch (e) { /* ignore */ }
    const h = (location.hash || "").slice(1);
    if (["today", "train", "body", "trends"].includes(h)) S.ui.tab = h;
    if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch((e) => console.warn("offline support unavailable", e));
    const a = await loadAccess();
    const saved = lsGet(ACCESS_KEY);
    S.accessOn = !!a.hash || (!!a.offline && !!saved);
    // Offline with a device that was unlocked before: let it in; the passcode is checked again once online.
    if (a.open || (a.hash && saved === a.hash) || (a.offline && saved)) start();
    else showLock(a);
  }
  boot();
})();
