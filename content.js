// Spotify Dig Helper - エントリポイント / オーケストレーション
// Track 検出 -> ストアリンク生成 -> UI 描画。SPA 対応で MutationObserver を使う。
// (Discogs/iTunes メタ取得は Phase 5/6 で本処理に接続する。)

(function () {
  "use strict";

  window.SDH = window.SDH || {};

  function processOnce() {
    const tracks = SDH.spotify.collectTracks();
    if (!tracks.length) return;

    tracks.forEach((info) => {
      const bar = SDH.ui.inject(info);
      if (!bar) return; // 既に注入済み

      // Phase 2 完了条件: コンソールに "Artist - Track" を出力。
      SDH.log("検出:", info.artistName + " - " + info.trackName);

      // --- Phase 5/6 接続ポイント (現状はスタブで no-op) ---
      // const key = SDH.cacheKey(info);
      // SDH.cache.get(key).then(...) ... SDH.discogs.fetchReleaseInfo(info) ...
      // SDH.itunes.fetchTrackViewUrl(info) ...
    });
  }

  const run = SDH.debounce(processOnce, SDH.CONFIG.OBSERVER_DEBOUNCE_MS);

  function start() {
    SDH.log("Spotify Dig Helper 起動 v0.2.0");
    processOnce();

    const observer = new MutationObserver(() => run());
    observer.observe(document.body, { childList: true, subtree: true });
    SDH.log("MutationObserver 監視開始 (document.body)");
  }

  if (document.body) {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start);
  }
})();
