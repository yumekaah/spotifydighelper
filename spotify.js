// Spotify Dig Helper - Spotify DOM 解析
// Now Playing ウィジェットおよびトラックリスト各行から TrackInfo を抽出する。
//
// TrackInfo = { trackName, artistName, albumName? }
//
// DOM変更時の修正は constants.js の SELECTORS 側で吸収する想定。

(function () {
  "use strict";

  window.SDH = window.SDH || {};
  SDH.spotify = {};

  const S = () => SDH.SELECTORS;

  // テキストを正規化して取り出す。
  function text(el) {
    return el ? (el.textContent || "").trim() : "";
  }

  // --- Now Playing ウィジェットから取得 ---
  SDH.spotify.getNowPlaying = function () {
    const widget = SDH.qs(document, S().nowPlayingWidget);
    if (!widget) return null;

    const titleEl = SDH.qs(widget, S().nowPlayingTitle) || SDH.qs(document, S().nowPlayingTitle);
    // artist は aria-label など複数取り得るので最初の1件を採用。
    const artistEl = SDH.qs(widget, S().nowPlayingArtist) || SDH.qs(document, S().nowPlayingArtist);

    const trackName = text(titleEl);
    const artistName = text(artistEl);

    if (!trackName) return null;

    const info = { trackName, artistName, albumName: undefined };
    info._container = widget;
    info._scope = "now-playing";
    return info;
  };

  // --- トラックリストの1行から取得 ---
  SDH.spotify.parseRow = function (row) {
    if (!row) return null;

    // トラック名: /track/ リンク優先、無ければ dir="auto" の先頭テキスト。
    let trackName = "";
    const trackLink = SDH.qs(row, S().rowTrackLink);
    if (trackLink) {
      trackName = text(trackLink);
    } else {
      const fallback = SDH.qs(row, S().rowTrackFallbackTitle);
      trackName = text(fallback);
    }

    // アーティスト: /artist/ リンクを全て連結。
    const artistLinks = SDH.qsa(row, S().rowArtistLink);
    const artistName = artistLinks.map(text).filter(Boolean).join(", ");

    if (!trackName) return null;

    const info = { trackName, artistName, albumName: undefined };
    info._container = row;
    info._scope = "tracklist-row";
    return info;
  };

  // --- 現在DOM上にある全トラックコンテナを収集 ---
  // 戻り値: TrackInfo[] (重複注入は ui 側でフラグ管理)
  SDH.spotify.collectTracks = function () {
    const results = [];

    const np = SDH.spotify.getNowPlaying();
    if (np) results.push(np);

    SDH.qsa(document, S().tracklistRow).forEach((row) => {
      const info = SDH.spotify.parseRow(row);
      if (info) results.push(info);
    });

    return results;
  };
})();
