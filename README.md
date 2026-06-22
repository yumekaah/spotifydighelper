# Spotify Dig Helper

Spotify Web Player 上の楽曲に、DJ 向けの Dig 支援情報を表示する Chrome 拡張 (Manifest V3)。

各トラックに `[BP] [BC] [TX] [DG]`（+ 将来 `[IT]`）のストア検索ボタンと、`Label` / `Cat#` を表示します。

## 現在の実装状況 (v0.2.0)

- ✅ Phase 1: スキャフォールド (MV3 manifest, content scripts, icons)
- ✅ Phase 2: Spotify DOM 解析 (Now Playing + トラックリスト行 / MutationObserver)
- ✅ Phase 3: UI 描画 (ボタン + Label/Cat# パネル)
- ✅ Phase 4: ストアリンク生成 (Beatport / Bandcamp / Traxsource / Discogs)
- ⏳ Phase 5: Discogs メタ取得 (Label/Cat#) — `discogs.js` はスタブ
- ⏳ Phase 6: iTunes リンク (`[IT]`) — `itunes.js` はスタブ
- ⏳ Phase 7: キャッシュ (`cache.js` は実装済み・未接続)

> 現状は **リンク生成まで**。Label / Cat# は API 未接続のため `-` 表示です。

## インストール (開発用ローカルロード)

1. Chrome で `chrome://extensions` を開く
2. 右上「デベロッパーモード」を ON
3. 「パッケージ化されていない拡張機能を読み込む」→ このフォルダを選択
4. `https://open.spotify.com/` を開く

## 動作確認

- DevTools Console に `[SDH] ...` ログが出る (`ENABLE_DEBUG=true`)
  - 起動 / MutationObserver 開始 / `検出: Artist - Track` / `UI注入` など
- 再生中のトラック (画面下部) とトラックリスト各行にボタンが出る
- ボタンクリックで各ストアの検索ページが新規タブで開く

## ファイル構成

| ファイル | 役割 |
|---|---|
| `manifest.json` | MV3 マニフェスト |
| `constants.js` | 設定・**DOMセレクタ**・ストアURLテンプレート (DOM変更時はここを修正) |
| `utils.js` | ログ / 正規化 / クエリ・リンク生成 / debounce |
| `spotify.js` | Spotify DOM から TrackInfo 抽出 |
| `ui.js` | ボタン・メタパネルの注入 |
| `content.js` | エントリポイント / MutationObserver |
| `cache.js` | chrome.storage.local キャッシュ (TTL 30日) |
| `discogs.js` | Discogs メタ取得 (Phase5 スタブ) |
| `itunes.js` | iTunes リンク取得 (Phase6 スタブ) |
| `background.js` | service worker (将来 API fetch プロキシ) |
| `styles.css` | スタイル |

## DOM が変わったら

Spotify Web Player の DOM はしばしば変わります。ボタンが出なくなったら
`constants.js` の `SDH.SELECTORS` を実 DOM (`data-testid` ベース推奨) に合わせて更新してください。
ログ (`ENABLE_DEBUG`) で検出有無を確認できます。

## デバッグ

`constants.js` の `SDH.CONFIG.ENABLE_DEBUG = true` で詳細ログ出力。
リリース時は `false` に。
