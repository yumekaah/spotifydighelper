// Spotify Dig Helper - UI 描画
// 各トラックコンテナに [BP][BC][TX][DG](+[IT]) と Label/Cat# パネルを注入する。

(function () {
  "use strict";

  window.SDH = window.SDH || {};
  SDH.ui = {};

  const FLAG = () => SDH.CONFIG.INJECTED_FLAG;

  // 新しいタブでストアを開くアンカーを生成。
  function makeButton(label, title, href) {
    const a = document.createElement("a");
    a.className = "sdh-btn";
    a.textContent = label;
    a.title = title;
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    // Spotify 側の行クリック(再生)に伝播させない。
    a.addEventListener("click", (e) => e.stopPropagation());
    return a;
  }

  function makeMetaLine(labelText, valueText) {
    const line = document.createElement("div");
    line.className = "sdh-meta-line";
    const k = document.createElement("span");
    k.className = "sdh-meta-key";
    k.textContent = labelText + ": ";
    const v = document.createElement("span");
    v.className = "sdh-meta-val";
    v.textContent = valueText;
    line.appendChild(k);
    line.appendChild(v);
    return line;
  }

  // バー要素を生成して返す (まだDOMには挿入しない)。
  SDH.ui.createBar = function (trackInfo) {
    const links = SDH.buildStoreLinks(trackInfo);

    const bar = document.createElement("div");
    bar.className = "sdh-bar sdh-scope-" + (trackInfo._scope || "unknown");

    // ボタン列
    const btnRow = document.createElement("div");
    btnRow.className = "sdh-btn-row";
    SDH.STORE_BUTTONS.forEach((b) => {
      btnRow.appendChild(makeButton(b.label, b.title, links[b.key]));
    });
    bar.appendChild(btnRow);

    // メタ情報 (Label / Cat#)。API未実装のうちは "-"。
    const meta = document.createElement("div");
    meta.className = "sdh-meta";
    meta.appendChild(makeMetaLine("Label", "-"));
    meta.appendChild(makeMetaLine("Cat#", "-"));
    bar.appendChild(meta);

    // 参照を保持 (後でメタ更新する用)。
    bar._meta = meta;
    bar._btnRow = btnRow;
    return bar;
  };

  // コンテナに対してバーを注入 (重複防止)。
  SDH.ui.inject = function (trackInfo) {
    const container = trackInfo._container;
    if (!container) return null;
    if (container.getAttribute(FLAG()) === "1") return null;

    const bar = SDH.ui.createBar(trackInfo);
    container.setAttribute(FLAG(), "1");
    container.appendChild(bar);

    SDH.log("UI注入:", trackInfo.artistName, "-", trackInfo.trackName, "(" + trackInfo._scope + ")");
    return bar;
  };
})();
