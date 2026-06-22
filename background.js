// Spotify Dig Helper - background service worker (MV3)
// Discogs / iTunes API への fetch プロキシ。CORS 回避とトークン秘匿を担う。

// ★ ここにトークンを設定 (https://www.discogs.com/settings/developers)
const DISCOGS_TOKEN = "YOUR_DISCOGS_TOKEN_HERE";

chrome.runtime.onInstalled.addListener(() => {
  console.log("[SDH] Spotify Dig Helper installed (v0.3.0)");
});

// リクエストキュー: 1秒間隔に絞って Discogs レート制限(60req/min)を超えない。
const queue = [];
let processing = false;

function processQueue() {
  if (processing || queue.length === 0) return;
  processing = true;
  const { q, sendResponse } = queue.shift();
  const url = `https://api.discogs.com/database/search?q=${encodeURIComponent(q)}&type=release&per_page=5&token=${DISCOGS_TOKEN}`;
  fetch(url, { headers: { "User-Agent": "SpotifyDigHelper/0.3.0" } })
    .then((r) => r.json())
    .then((data) => sendResponse({ ok: true, results: data.results || [] }))
    .catch((e) => sendResponse({ ok: false, error: e.message }))
    .finally(() => {
      setTimeout(() => { processing = false; processQueue(); }, 1000);
    });
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "DISCOGS_SEARCH") {
    if (!DISCOGS_TOKEN || DISCOGS_TOKEN === "YOUR_DISCOGS_TOKEN_HERE") {
      sendResponse({ ok: false, error: "Discogs token not set" });
      return false;
    }
    queue.push({ q: msg.q, sendResponse });
    processQueue();
    return true; // 非同期レスポンス
  }
});
