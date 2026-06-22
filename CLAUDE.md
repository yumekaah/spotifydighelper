# Spotify Dig Helper — Claude Code コンテキスト

## プロジェクト概要

Spotify Web Player 上の楽曲に DJ 向け Dig 支援情報を表示する Chrome Extension (Manifest V3)。
各トラックに `[BP] [BC] [TX] [DG]` のストア検索ボタンと Label / Cat# を表示する。

## リポジトリ

- Bitbucket: `https://bitbucket.org/ymk_ah/spotifydighelper` (main ブランチ)
- ローカル: `C:\Users\usa\OneDrive\ドキュメント\spotifydighelper`

## 現在の実装状況

### 完了 (Phase 1〜4) ✅

| フェーズ | 内容 | 状態 |
|---|---|---|
| Phase 1 | MV3 スキャフォールド・アイコン | ✅ 完了・動作確認済み |
| Phase 2 | Spotify DOM 解析・MutationObserver | ✅ 完了・動作確認済み |
| Phase 3 | UI 描画 (ボタン + Label/Cat# パネル) | ✅ 完了・動作確認済み |
| Phase 4 | ストアリンク生成 (BP/BC/TX/DG) | ✅ 完了・動作確認済み |

**Chrome での動作確認済み**: Spotify Web Player で `[BP][BC][TX][DG]` ボタンが Now Playing バーとトラックリスト各行に表示される。

### 未実装 (後回し)

| フェーズ | 内容 | ファイル |
|---|---|---|
| Phase 5 | Discogs API → Label / Cat# 取得 | `discogs.js` (スタブあり) |
| Phase 6 | iTunes API → `[IT]` ボタン | `itunes.js` (スタブあり) |
| Phase 7 | キャッシュ接続 | `cache.js` (実装済み・未接続) |
| Phase 8 | リリース準備 | - |

## ファイル構成と役割

```
spotifydighelper/
├── manifest.json     # MV3。open.spotify.com に content scripts を注入
├── constants.js      # ★ DOMセレクタ集約 (変更はここだけ)・設定・ストアURLテンプレート
├── utils.js          # ログ(SDH.log) / 正規化 / リンク生成 / debounce
├── spotify.js        # Spotify DOM から TrackInfo 抽出
├── ui.js             # [BP][BC][TX][DG] ボタン + Label/Cat# パネル注入
├── content.js        # エントリポイント + MutationObserver
├── cache.js          # chrome.storage.local キャッシュ (TTL 30日、未接続)
├── discogs.js        # Discogs メタ取得 (Phase 5 スタブ・score() 雛形あり)
├── itunes.js         # iTunes リンク取得 (Phase 6 スタブ)
├── background.js     # service worker (将来の API fetch プロキシ枠)
├── styles.css        # Spotify ダークテーマ調スタイル
└── icons/            # 16/48/128 PNG
```

## 設計の重要ポイント

### DOM セレクタ管理
Spotify の DOM は変わりやすい。**セレクタは `constants.js` の `SDH.SELECTORS` に一元化**。
壊れたら `constants.js` 1ファイルを修正するだけで直る設計。
`data-testid` ベース + カンマ区切りフォールバック。

### デバッグログ
`constants.js` の `SDH.CONFIG.ENABLE_DEBUG = true` で `[SDH]` プレフィックス付きログが出る。
DevTools Console で Track 検出・UI 注入・API スコアリングを追える。

### Phase 5 接続ポイント
`content.js` の `processOnce()` 関数内にコメントで接続ポイントを明示済み:
```js
// --- Phase 5/6 接続ポイント (現状はスタブで no-op) ---
// const key = SDH.cacheKey(info);
// SDH.cache.get(key).then(...) ... SDH.discogs.fetchReleaseInfo(info) ...
```

### Discogs スコアリング仕様
Artist 完全一致 +50 / Track 完全一致 +50 / 最大 100 / 最高スコア採用。
`discogs.js` の `SDH.discogs.score()` に雛形実装済み。

## 次の候補タスク

1. **Phase 5: Discogs API 接続** — Label / Cat# を `-` から実データに
   - Discogs Personal Access Token が必要 (https://www.discogs.com/settings/developers)
   - `discogs.js` を本実装 + `content.js` の接続ポイントを有効化
   - background.js 経由で fetch (CORS 回避・Token 秘匿)

2. **DOM セレクタ検証** — DevTools Console で `[SDH]` ログを確認し、
   Now Playing / トラックリスト行の検出精度をチェック。
   ずれがあれば `constants.js` の `SDH.SELECTORS` を修正。

3. **Phase 6: iTunes API** — `[IT]` ボタン追加

## Chrome へのローカルロード手順

1. `chrome://extensions` → デベロッパーモード ON
2. 「パッケージ化されていない拡張機能を読み込む」
3. このフォルダ (`spotifydighelper/`) を選択
4. `https://open.spotify.com/` を開く
5. DevTools Console で `[SDH]` ログを確認
