// Sxxxxfy Dig Helper - background service worker (MV3)
//
// Phase 5/6 (feature/discogs-api ブランチ) で Discogs / iTunes API への
// fetch プロキシ役を担う。CORS 回避とトークン秘匿のためここで fetch する。

chrome.runtime.onInstalled.addListener(() => {
  console.log("[SDH] Sxxxxfy Dig Helper installed (v0.2.0)");
});
