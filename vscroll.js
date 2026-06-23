// Sxxxxfy Dig Helper - 仮想スクロール高さパッチ
// Sxxxxfy の Virtual List は translateY と height を inline style で管理する。
// SDH バー挿入で行高が 56px → 91px に増えると transform がズレるため補正する。
//
// 無限ループ防止：
//   Spotify の Y 値は必ず ROW_H(56) の倍数。
//   我々が設定したスケール済みの値は倍数にならないため、
//   % ROW_H チェックで「Spotify の更新か自分の更新か」を区別できる。

(function () {
  "use strict";
  window.SDH = window.SDH || {};

  const ROW_H = 56; // Sxxxxfy 基本行高 (px)

  let _rc = null;   // rowContainer (translateY 持ち)
  let _he = null;   // heightEl (height: Npx 持ち)
  let _origH = 0;   // Sxxxxfy の元の総高さ
  let _barH = 0;    // 注入バーの高さ
  let _obs = null;  // MutationObserver (1つだけ)

  // style から translateY の値を取り出す
  function parseY(el) {
    const m = (el.style.transform || "").match(/translateY\(([\d.e+]+)px\)/);
    return m ? parseFloat(m[1]) : null;
  }

  function applyPatch() {
    if (!_rc || _barH <= 0) return;
    const y = parseY(_rc);
    if (y === null) return;

    // Spotify の値 → ROW_H の倍数。我々が設定した値 → 倍数ではない。
    if (Math.abs(y % ROW_H) > 0.5) return;

    const scale = (ROW_H + _barH) / ROW_H;
    const newY = y * scale;

    // 値が変わらない場合はスキップ (y=0 など)
    if (Math.abs(newY - y) < 0.1) return;

    _rc.style.transform = `translateY(${newY}px)`;
    if (_he && _origH > 0) {
      _he.style.height = `${_origH * scale}px`;
    }
    SDH.log(`vscroll: Y ${y}→${Math.round(newY)}px  totalH→${Math.round(_origH * scale)}px`);
  }

  function findRowContainer(firstRow) {
    let el = firstRow.parentElement;
    for (let i = 0; i < 10 && el && el !== document.body; i++) {
      if ((el.style?.transform || "").includes("translateY")) return el;
      el = el.parentElement;
    }
    return null;
  }

  function findHeightEl(rc) {
    let el = rc.parentElement;
    for (let i = 0; i < 10 && el && el !== document.body; i++) {
      if (el.style?.height) {
        const h = parseFloat(el.style.height);
        if (h > 500) return { el, origH: h };
      }
      el = el.parentElement;
    }
    return null;
  }

  SDH.vscroll = {
    init() {
      if (_obs) return; // 既に起動済み → 重複防止

      const firstRow = document.querySelector('[data-testid="tracklist-row"]');
      if (!firstRow) return;

      _rc = findRowContainer(firstRow);
      if (!_rc) { SDH.warn("vscroll: rowContainer not found"); return; }

      const heResult = findHeightEl(_rc);
      if (heResult) { _he = heResult.el; _origH = heResult.origH; }
      else { SDH.warn("vscroll: heightEl not found"); }

      const bar = document.querySelector(".sdh-scope-tracklist-row");
      _barH = bar ? Math.round(bar.getBoundingClientRect().height) : 0;
      if (!_barH) { SDH.warn("vscroll: barH=0, skip"); return; }

      SDH.log(`vscroll init: barH=${_barH}px origH=${_origH}px`);
      applyPatch();

      _obs = new MutationObserver(applyPatch);
      _obs.observe(_rc, { attributes: true, attributeFilter: ["style"] });
    },

    shutdown() {
      if (_obs) { _obs.disconnect(); _obs = null; }
      // 元の高さを復元
      if (_he && _origH > 0) _he.style.height = `${_origH}px`;
      _rc = null; _he = null; _origH = 0; _barH = 0;
    },
  };
})();
