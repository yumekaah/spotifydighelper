// Spotify Dig Helper - constants & config
// 設定値とDOMセレクタを一元管理する。
// SpotifyのDOMは変わりやすいため、セレクタの修正はこのファイルだけで完結させる。

(function () {
  "use strict";

  window.SDH = window.SDH || {};

  // ---- 全体設定 ----
  SDH.CONFIG = {
    // デバッグログ (Track検出 / スコアリング / 採用結果 などを console 出力)
    ENABLE_DEBUG: true,
    // キャッシュ有効期限 (日)
    CACHE_TTL_DAYS: 30,
    // UI再描画のデバウンス (ms)
    OBSERVER_DEBOUNCE_MS: 250,
    // 拡張が注入した要素の目印 (重複注入防止)
    INJECTED_FLAG: "data-sdh-injected",
  };

  // ---- Spotify DOM セレクタ ----
  // data-testid を最優先し、壊れた場合に備えてフォールバックを併記する。
  // カンマ区切りは querySelector の OR フォールバックとして機能する。
  SDH.SELECTORS = {
    // 画面下部の Now Playing ウィジェット
    nowPlayingWidget: '[data-testid="now-playing-widget"]',
    nowPlayingTitle:
      '[data-testid="context-item-info-title"], [data-testid="context-item-link"], [data-testid="now-playing-widget"] a[href*="/track/"]',
    nowPlayingArtist:
      '[data-testid="context-item-info-artist"] a, [data-testid="context-item-info-subtitles"] a, [data-testid="now-playing-widget"] a[href*="/artist/"]',

    // トラックリストの各行 (アルバム / プレイリスト / 検索結果)
    tracklistRow: '[data-testid="tracklist-row"]',
    rowTrackLink: 'a[href*="/track/"]',
    rowTrackFallbackTitle: 'div[dir="auto"]',
    rowArtistLink: 'a[href*="/artist/"]',
  };

  // ---- ストア検索URLテンプレート ----
  // {q} は encodeURIComponent 済みの "artist track" に置換される。
  SDH.STORE_URLS = {
    beatport:   "https://www.beatport.com/search?q={q}",
    bandcamp:   "https://bandcamp.com/search?q={q}",
    traxsource: "https://www.traxsource.com/search?term={q}",
    soundcloud: "https://soundcloud.com/search?q={q}",
    discogs:    "https://www.discogs.com/search?q={q}",
    google:     "https://www.google.com/search?q={q}",
    applemusic: "https://music.apple.com/search?term={q}",
  };

  // ボタン定義 (label, icon, key, title)
  SDH.STORE_BUTTONS = [
    { key: "beatport",   label: "Beatport",   icon: "favicons/beatport.png",   title: "Beatport で検索" },
    { key: "traxsource", label: "Traxsource", icon: "favicons/traxsource.ico", title: "Traxsource で検索" },
    { key: "applemusic", label: "Apple Music", icon: "favicons/applemusic.png", title: "Apple Music で検索" },
    { key: "discogs",    label: "Discogs",    icon: "favicons/discogs.png",    title: "Discogs で検索" },
    { key: "bandcamp",   label: "Bandcamp",   icon: "favicons/bandcamp.png",   title: "Bandcamp で検索" },
    { key: "soundcloud", label: "SoundCloud", icon: "favicons/soundcloud.png", title: "SoundCloud で検索" },
    { key: "google",     label: "Google",     icon: "favicons/google.ico",     title: "Google で検索" },
  ];
})();
