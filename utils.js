// Sxxxxfy Dig Helper - utilities
// ログ・文字列正規化・クエリ/リンク生成などの共通ヘルパー。

(function () {
  "use strict";

  window.SDH = window.SDH || {};

  const PREFIX = "%c[SDH]";
  const STYLE = "color:#1db954;font-weight:bold";

  // デバッグログ。ENABLE_DEBUG が true の時だけ出力する。
  SDH.log = function (...args) {
    if (SDH.CONFIG && SDH.CONFIG.ENABLE_DEBUG) {
      console.log(PREFIX, STYLE, ...args);
    }
  };

  SDH.warn = function (...args) {
    if (SDH.CONFIG && SDH.CONFIG.ENABLE_DEBUG) {
      console.warn(PREFIX, STYLE, ...args);
    }
  };

  // 文字列正規化 (比較・キャッシュキー用)。
  // 小文字化・前後空白除去・連続空白の単一化。
  SDH.normalize = function (str) {
    return (str || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  };

  // "artist track" を組み立てる (表示・検索用の生文字列)。
  SDH.buildSearchString = function (artist, track) {
    return [artist, track].filter(Boolean).join(" ").trim();
  };

  // ストア検索リンクを生成する。
  SDH.buildStoreLinks = function (trackInfo) {
    const raw = SDH.buildSearchString(trackInfo.artistName, trackInfo.trackName);
    const q = encodeURIComponent(raw);
    const links = {};
    Object.keys(SDH.STORE_URLS).forEach((key) => {
      links[key] = SDH.STORE_URLS[key].replace("{q}", q);
    });
    return links;
  };

  // キャッシュキー: "artistName|trackName" (正規化済み)。
  SDH.cacheKey = function (trackInfo) {
    return (
      SDH.normalize(trackInfo.artistName) +
      "|" +
      SDH.normalize(trackInfo.trackName)
    );
  };

  // 簡易デバウンス。
  SDH.debounce = function (fn, wait) {
    let t = null;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  };

  // セレクタOR文字列に対する安全な querySelector。
  SDH.qs = function (root, selector) {
    try {
      return root.querySelector(selector);
    } catch (e) {
      SDH.warn("querySelector失敗:", selector, e);
      return null;
    }
  };

  SDH.qsa = function (root, selector) {
    try {
      return Array.from(root.querySelectorAll(selector));
    } catch (e) {
      SDH.warn("querySelectorAll失敗:", selector, e);
      return [];
    }
  };
})();
