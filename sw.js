/**
 * Service Worker · Conteos de labores
 *
 * Al publicar una versión nueva: cambiar CACHE_VERSION.
 *
 * Importante: esta app comparte origen (alvaroapb.github.io) con la app de plagas.
 * Por eso solo se tocan las cachés que empiezan por "conteos-": nunca las de otras apps.
 */

const CACHE_PREFIJO = "conteos-";
const CACHE_VERSION = CACHE_PREFIJO + "v2c-1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      Promise.all(APP_SHELL.map((url) => cache.add(url).catch((e) => console.warn("[SW] No se pudo guardar:", url, e.message))))
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((nombres) => Promise.all(
        nombres.filter((n) => n.startsWith(CACHE_PREFIJO) && n !== CACHE_VERSION).map((n) => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET") return;
  // La API (Supabase) nunca se guarda en caché.
  if (url.hostname.includes("supabase.co") || /^\/(rest|auth|storage|realtime|functions)\/v1\//.test(url.pathname)) return;
  // Las imágenes de satélite van a su propia base de datos, no a esta caché.
  if (url.hostname.includes("ign.es")) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        fetch(event.request).then((resp) => {
          if (resp && resp.ok) caches.open(CACHE_VERSION).then((c) => c.put(event.request, resp.clone()).catch(() => {}));
        }).catch(() => {});
        return cached;
      }
      return fetch(event.request).then((resp) => {
        if (resp && resp.ok && (resp.type === "basic" || resp.type === "cors")) {
          const copia = resp.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(event.request, copia).catch(() => {}));
        }
        return resp;
      }).catch(() => {
        if (event.request.mode === "navigate") return caches.match("./index.html");
        return new Response("", { status: 503, statusText: "Sin conexión" });
      });
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});
