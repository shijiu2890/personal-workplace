/* Service Worker：网络优先 + 断网回退缓存
 *
 * 为什么用"网络优先"而不是"缓存优先"：
 *   缓存优先会把旧页面一直喂给浏览器 —— 改完代码用户还是看到旧版（我在工作台主站上踩过这个坑）。
 *   这里改成：能联网就拿最新的；连不上网（比如地铁里）才退回缓存，照样能记东西。
 *   数据本身存在 localStorage，跟这个缓存无关，不会被覆盖。
 */
const CACHE = "workbench-pw-v1";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== location.origin) return; // 外链不插手

  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match("./index.html")))
  );
});
