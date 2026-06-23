# Sxxxxfy Dig Helper

Sxxxxfy Web Player の各トラックに、DJ向けの Dig 支援ボタンを追加する Chrome 拡張機能 (Manifest V3)。

トラックリストの各行と下部の Now Playing バーに、各ストアへの検索リンクボタンをホバーで表示します。

![スクリーンショット](screenshots/スクリーンショット%202026-06-24%20020734.png)

---

## 機能

- **ストア検索ボタン**: Beatport / Traxsource / Apple Music / Discogs / Bandcamp / SoundCloud / YouTube / Google
- **トラックリスト対応**: アルバム・プレイリスト・アーティストページの全行に表示
- **Now Playing 対応**: 画面下部のプレイヤーにもボタンを常時表示
- **レスポンシブ**: 画面幅 1250px 以下ではアイコンのみ表示に切替
- **SPA 対応**: Sxxxxfy のページ遷移・仮想リスト更新を MutationObserver で追従

---

## インストール

Chrome の開発者モードでローカルインストールします。Chrome Web Store への公開は未対応です。

1. このリポジトリを ZIP でダウンロード、または `git clone`
2. Chrome で `chrome://extensions` を開く
3. 右上の「デベロッパーモード」を ON にする
4. 「パッケージ化されていない拡張機能を読み込む」をクリック
5. ダウンロードしたフォルダ (`spotifydighelper/`) を選択
6. `https://open.spotify.com/` を開くとボタンが表示される

---

## ファイル構成

```
spotifydighelper/
├── manifest.json     # MV3 設定
├── constants.js      # DOM セレクタ・ストア URL・ボタン定義
├── utils.js          # ユーティリティ (ログ / 正規化 / リンク生成)
├── spotify.js        # Sxxxxfy DOM からトラック情報を抽出
├── ui.js             # ボタンバーの生成・注入
├── content.js        # エントリポイント + MutationObserver
├── background.js     # service worker
├── cache.js          # chrome.storage.local キャッシュ (未接続)
├── discogs.js        # Discogs API スタブ (feature/discogs-api ブランチで実装)
├── itunes.js         # iTunes API スタブ
├── styles.css        # スタイル
└── favicons/         # 各ストアのアイコン
```

---

## DOM セレクタのメンテナンス

Sxxxxfy の DOM は定期的に変更されます。ボタンが表示されなくなった場合は `constants.js` の `SDH.SELECTORS` を修正してください。DevTools Console で `[SDH]` プレフィックスのログが確認できます (`SDH.CONFIG.ENABLE_DEBUG = true`)。

---

## ブランチ

| ブランチ | 内容 |
|---|---|
| `main` | ストアリンクボタン (API 呼び出しなし) |
| `feature/discogs-api` | Discogs API で Label / Cat# を取得する実装 |

`feature/discogs-api` を使う場合は `background.js` の `DISCOGS_TOKEN` に [Discogs Personal Access Token](https://www.discogs.com/settings/developers) を設定してください（**トークンはコミットしないこと**）。

---

## 既知の問題

- **下部プレーヤーのレスポンシブ未対応**: 画面幅が小さい場合、下部プレーヤー横のボタンがあふれる場合があります。

---

## 免責事項

本拡張機能は非公式のツールであり、Spotify AB および各ストアとは一切関係ありません。

本ソフトウェアの使用によって生じたいかなる損害・不利益（アカウント停止、サービス停止、その他あらゆる問題を含む）についても、開発者は一切の責任を負いません。自己責任でご使用ください。

This is an unofficial tool and is not affiliated with or endorsed by Spotify AB or any store service. The developer takes no responsibility for any consequences arising from the use of this software.

---

## ライセンス

MIT
