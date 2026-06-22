// Spotify Dig Helper - UI 描画
// 各トラックコンテナに [BP][BC][TX][DG](+[IT]) と Label/Cat# パネルを注入する。

(function () {
  "use strict";

  window.SDH = window.SDH || {};
  SDH.ui = {};

  const FLAG = () => SDH.CONFIG.INJECTED_FLAG;

// 新しいタブでストアを開くアンカーを生成。
  function makeButton(label, icon, title, href) {
    const a = document.createElement("a");
    a.className = "sdh-btn";
    a.title = title;
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    // Spotify 側の行クリック(再生)に伝播させない。
    a.addEventListener("click", (e) => e.stopPropagation());

    if (icon) {
      const img = document.createElement("img");
      img.src = chrome.runtime.getURL(icon);
      img.className = "sdh-btn-icon";
      a.appendChild(img);
    }
    const span = document.createElement("span");
    span.className = "sdh-btn-label";
    span.textContent = label;
    a.appendChild(span);
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
      btnRow.appendChild(makeButton(b.label, b.icon, b.title, links[b.key]));
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

  // コンテナに対してバーを注入 (重複防止・曲変更時に再注入)。
  SDH.ui.inject = function (trackInfo) {
    const container = trackInfo._container;
    if (!container) return null;

    const trackKey = trackInfo.artistName + "||" + trackInfo.trackName;
    if (container.getAttribute(FLAG()) === trackKey) return null;

    // 曲が変わった場合は古いバーを除去する。
    if (trackInfo._scope === "tracklist-row") {
      const next = container.nextElementSibling;
      if (next && next.classList.contains("sdh-bar")) next.remove();
    } else {
      const old = container.querySelector(".sdh-bar");
      if (old) old.remove();
    }

    const bar = SDH.ui.createBar(trackInfo);
    container.setAttribute(FLAG(), trackKey);

    if (trackInfo._scope === "tracklist-row") {
      container.insertAdjacentElement("afterend", bar);
    } else {
      container.appendChild(bar);
    }

    SDH.log("UI注入:", trackInfo.artistName, "-", trackInfo.trackName, "(" + trackInfo._scope + ")");
    return bar;
  };

  // アーティストページでSDHバーと被る要素にマージンを付与する。
  SDH.ui.patchSectionSpacing = function () {
    // ディスコグラフィーセクション (href で特定)
    const discLink = SDH.qs(document, '[data-testid="see-all-link"][href*="/discography/"]');
    if (discLink) {
      const section = discLink.closest("section") || discLink.parentElement;
      if (section && !section.hasAttribute("data-sdh-section-spaced")) {
        section.setAttribute("data-sdh-section-spaced", "1");
        SDH.log("セクション間隔調整: discography section");
      }
    }

    // 「もっと見る」/「表示数を少なくする」ボタン
    // 展開前後で行数が変わるためバー実高を毎回合算して動的にマージンを設定する。
    const expandBtnTexts = ["もっと見る", "Show more", "表示数を少なくする", "Show less"];
    SDH.qsa(document, '[data-encore-id="text"]').forEach((textEl) => {
      const text = (textEl.textContent || "").trim();
      if (!expandBtnTexts.includes(text)) return;
      const btn = textEl.closest("button");
      if (!btn) return;
      const bars = SDH.qsa(document, ".sdh-scope-tracklist-row");
      const totalH = bars.reduce((s, b) => s + b.getBoundingClientRect().height, 0);
      btn.style.marginTop = Math.ceil(totalH) + "px";
      btn.setAttribute("data-sdh-btn-spaced", "1");
      SDH.log("ボタンマージン調整:", Math.ceil(totalH) + "px", text);
    });
  };
})();
