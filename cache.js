// Sxxxxfy Dig Helper - キャッシュ (chrome.storage.local)
// キー: "artistName|trackName"
// 値:   { releaseInfo, itunesUrl, cachedAt }
// 有効期限: CONFIG.CACHE_TTL_DAYS 日
//
// Phase 5/6 (Discogs/iTunes) で利用する。リンク生成のみのMVPでは未使用だが
// 基盤として先に用意しておく。

(function () {
  "use strict";

  window.SDH = window.SDH || {};
  SDH.cache = {};

  function ttlMs() {
    return (SDH.CONFIG.CACHE_TTL_DAYS || 30) * 24 * 60 * 60 * 1000;
  }

  // 取得。期限切れ/未存在なら null。
  SDH.cache.get = function (key) {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.get([key], (items) => {
          const entry = items && items[key];
          if (!entry) return resolve(null);
          if (Date.now() - (entry.cachedAt || 0) > ttlMs()) {
            // 期限切れ -> 破棄
            chrome.storage.local.remove([key], () => resolve(null));
            return;
          }
          resolve(entry);
        });
      } catch (e) {
        SDH.warn("cache.get失敗:", e);
        resolve(null);
      }
    });
  };

  // 保存。
  SDH.cache.set = function (key, data) {
    return new Promise((resolve) => {
      const entry = Object.assign({}, data, { cachedAt: Date.now() });
      try {
        chrome.storage.local.set({ [key]: entry }, () => resolve(entry));
      } catch (e) {
        SDH.warn("cache.set失敗:", e);
        resolve(null);
      }
    });
  };
})();
