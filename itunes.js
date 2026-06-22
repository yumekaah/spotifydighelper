// Sxxxxfy Dig Helper - iTunes Store リンク取得 (Phase 6 で実装予定)
//
// 役割: Apple iTunes Search API で artist + track を検索し trackViewUrl を取得。
//       成功時に [IT] ボタンを表示する。失敗時は非表示。
//
// API例: https://itunes.apple.com/search?term={q}&entity=song&limit=1
//   (host_permissions 済み, トークン不要だが CORS 回避のため background 経由推奨)
//
// 現状(リンク生成MVP)では未使用のスタブ。null を返す。

(function () {
  "use strict";

  window.SDH = window.SDH || {};
  SDH.itunes = {};

  // 返り値: Promise<string | null> (trackViewUrl)
  SDH.itunes.fetchTrackViewUrl = function (trackInfo) {
    // TODO(Phase6): Search API 呼び出し -> results[0].trackViewUrl。
    SDH.log("[itunes] スタブ呼び出し (未実装):", trackInfo.artistName, "-", trackInfo.trackName);
    return Promise.resolve(null);
  };
})();
