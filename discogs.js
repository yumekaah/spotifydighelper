// Spotify Dig Helper - Discogs メタデータ取得
//
// 役割: artist + track で Discogs Search API を叩き、候補をスコアリングして
//       Label / Catalog Number / Year を返す。
//
// スコアリング仕様:
//   Artist 完全一致 +50 / Track 完全一致 +50 / 最大100 / 最高スコア採用
//
// 注意: fetch は background.js 経由 (CORS 回避 + トークン秘匿)。

(function () {
  "use strict";

  window.SDH = window.SDH || {};
  SDH.discogs = {};

  // ReleaseInfo = { label, catalogNumber, year } | null
  // background.js 経由で Discogs Search API を叩き、スコアリングして最良候補を返す。
  SDH.discogs.fetchReleaseInfo = function (trackInfo) {
    const q = SDH.buildSearchString(trackInfo.artistName, trackInfo.trackName);
    SDH.log("[discogs] 検索:", q);

    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: "DISCOGS_SEARCH", q }, (res) => {
        if (chrome.runtime.lastError) {
          SDH.warn("[discogs] sendMessage失敗:", chrome.runtime.lastError.message);
          return resolve(null);
        }
        if (!res || !res.ok || !res.results || !res.results.length) {
          SDH.log("[discogs] 結果なし:", res && res.error);
          return resolve(null);
        }

        let best = null;
        let bestScore = -1;
        res.results.forEach((r) => {
          const score = SDH.discogs.score(trackInfo, r);
          SDH.log("[discogs]", score, "点:", r.title, "/", (r.label || []).join(", "), r.catno);
          if (score > bestScore) { bestScore = score; best = r; }
        });

        if (!best || bestScore === 0) return resolve(null);
        SDH.log("[discogs] 採用:", best.title, bestScore + "点");
        resolve({
          label: (best.label && best.label[0]) || null,
          catalogNumber: best.catno || null,
          year: best.year || null,
        });
      });
    });
  };

  // 候補スコアリング。
  // candidate: { title } (Discogs は "Artist - Title" 形式が多い)
  SDH.discogs.score = function (trackInfo, candidate) {
    const artist = SDH.normalize(trackInfo.artistName);
    const track = SDH.normalize(trackInfo.trackName);
    const title = SDH.normalize(candidate.title);

    let score = 0;
    if (artist && title.includes(artist)) score += 50;
    if (track && title.includes(track)) score += 50;
    return score;
  };
})();
