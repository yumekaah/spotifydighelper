// Spotify Dig Helper - Discogs メタデータ取得 (Phase 5 で実装予定)
//
// 役割: artist + track で Discogs Search API を叩き、候補をスコアリングして
//       Label / Catalog Number / Year を返す。
//
// スコアリング仕様 (spec):
//   Artist 完全一致 +50 / Track 完全一致 +50 / 最大100 / 最高スコア採用
//
// 注意:
//   - Discogs API は Personal Access Token が必要 (host_permissions 済み)。
//   - CORS とトークン秘匿のため、実際の fetch は background.js 経由を推奨。
//   - 現状(リンク生成MVP)では未使用のスタブ。null を返す。

(function () {
  "use strict";

  window.SDH = window.SDH || {};
  SDH.discogs = {};

  // ReleaseInfo = { label?, catalogNumber?, year? } | null
  // 返り値は Promise<ReleaseInfo | null>。
  SDH.discogs.fetchReleaseInfo = function (trackInfo) {
    // TODO(Phase5): Search API 呼び出し + スコアリング + 採用ログ。
    SDH.log("[discogs] スタブ呼び出し (未実装):", trackInfo.artistName, "-", trackInfo.trackName);
    return Promise.resolve(null);
  };

  // 候補スコアリング (Phase5 用に先出し)。
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
