// Sxxxxfy Dig Helper - エントリポイント / オーケストレーション
// Track 検出 -> ストアリンク生成 -> UI 描画。SPA 対応で MutationObserver を使う。
// (Discogs/iTunes メタ取得は Phase 5/6 で本処理に接続する。)

(function () {
  "use strict";

  window.SDH = window.SDH || {};

  function processOnce() {
    try {
      const tracks = SDH.spotify.collectTracks();
      if (!tracks.length) return;

      tracks.forEach((info) => {
        const bar = SDH.ui.inject(info);
        if (!bar) return; // 既に注入済み
        SDH.log("検出:", info.artistName + " - " + info.trackName);
      });

      SDH.ui.patchSectionSpacing();
    } catch (e) {
      SDH.warn("[SDH] processOnce エラー (Sxxxxfyへの影響なし):", e);
    }
  }

  const run = SDH.debounce(processOnce, SDH.CONFIG.OBSERVER_DEBOUNCE_MS);

  function start() {
    SDH.log("Sxxxxfy Dig Helper 起動 v0.2.0");
    processOnce();

    const observer = new MutationObserver(() => {
      try { run(); } catch (e) { SDH.warn("[SDH] Observer エラー:", e); }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    SDH.log("MutationObserver 監視開始 (document.body)");
  }

  if (document.body) {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start);
  }
})();
