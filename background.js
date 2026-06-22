// Spotify Dig Helper - background service worker (MV3)
//
// 現状(リンク生成MVP)は実処理なし。
// Phase 5/6 で Discogs / iTunes API への fetch プロキシ役を担う想定:
//   - content script からの message を受けて API を叩く (CORS 回避)
//   - Discogs Personal Access Token をここで付与 (秘匿)
//
// 例 (将来):
//   chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//     if (msg.type === "DISCOGS_SEARCH") { ... ; return true; }
//     if (msg.type === "ITUNES_SEARCH") { ... ; return true; }
//   });

chrome.runtime.onInstalled.addListener(() => {
  console.log("[SDH] Spotify Dig Helper installed (v0.2.0)");
});
