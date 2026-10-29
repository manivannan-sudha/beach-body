// Offline support. App files: network first (fresh when online, cached copy when not).
// Fonts and libraries from CDNs: cache first. Anthropic API calls and the dish-database download pass straight through.
const CACHE = "beachbody-v16";
const SHELL = ["./", "index.html", "app.js", "foods.js", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "icons/apple-touch-icon.png"];
const CDN_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com", "cdn.jsdelivr.net", "cdnjs.cloudflare.com"];

// "reload" skips the browser's own HTTP cache (GitHub Pages lets it keep files for 10 minutes),
// so a new version never gets installed with the old app.js inside it.
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function store(req, res) {
  if (res && (res.ok || res.type === "opaque")) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
  return res;
}

async function networkFirst(req) {
  const fallback = async () => (await caches.match(req, { ignoreSearch: true })) || (req.mode === "navigate" ? caches.match("./") : undefined);
  try {
    // "no-cache" asks GitHub whether the file changed (a quick 304 when it hasn't) instead of trusting a stale copy.
    const res = await Promise.race([
      fetch(new Request(req.url, { cache: "no-cache", credentials: "same-origin" })),
      new Promise((_, reject) => setTimeout(() => reject(new Error("slow network")), 4000)),
    ]);
    return store(req, res);
  } catch (e) {
    const hit = await fallback();
    if (hit) return hit;
    return fetch(req);
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(req));
  } else if (CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => store(req, res))));
  }
});
