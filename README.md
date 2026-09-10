# HatzeLaboratory VPM Listing

VRChat Creator Companion (VCC) 用のパッケージリスティングです。
GitHub Actions が各パッケージリポジトリのリリースを集めて `index.json` を生成し、
GitHub Pages で公開します。

## 構成

```
.
├── .github/workflows/build-listing.yml   リスティング生成とPagesへのデプロイ
├── Website/index.html                    公開ページ（Add to VCC ボタン）
├── source.json                           リスティングの定義
└── .gitignore
```

`Website/index.json` はビルド時に自動生成されるため、リポジトリには含めません。

## セットアップ手順

### 1. リポジトリを作成して push する

```bash
git add .
git commit -m "Add VPM listing"
git remote add origin git@github.com:mtytheone/<リポジトリ名>.git
git push -u origin master
```

### 2. `source.json` の `url` を実際のPages URLに合わせる

```json
"url": "https://mtytheone.github.io/<リポジトリ名>/index.json"
```

**この値がVCCに登録されるリスティングURLそのものです。** 間違っているとVCCが更新を取得できません。

### 3. GitHub Pages を有効化する

リポジトリの **Settings > Pages** を開き、**Source** を **GitHub Actions** に設定します。

### 4. ワークフローを実行する

**Actions > Build Repo Listing > Run workflow** を実行します。
以降は `source.json` を push するたびに自動で走ります。

### 5. 動作確認

`https://mtytheone.github.io/<リポジトリ名>/` を開き、**Add to VCC** を押します。

## パッケージを追加・更新するには

`source.json` の `githubRepos` にリポジトリを並べるだけです。

```json
"githubRepos": [
    "mtytheone/Muchio_Font_Tool"
]
```

各リポジトリの **GitHub Releases** に添付された `package.json` と zip を収集し、
リリースごとにバージョンとして登録します。

パッケージ側で新しいバージョンを出す手順は次の通りです。

1. パッケージリポジトリの `package.json` の `version` を上げてコミット
2. そのリポジトリの **Actions > Build Release** を手動実行
3. こちらのリポジトリで **Actions > Build Repo Listing** を実行（または `source.json` を触って push）

## 収録パッケージ

| パッケージ | リポジトリ |
|---|---|
| `com.hatzelaboratory.muchio.fontatlastool` | [mtytheone/Muchio_Font_Tool](https://github.com/mtytheone/Muchio_Font_Tool) |

## クレジット

`.github/workflows/build-listing.yml` は
[vrchat-community/template-package-listing](https://github.com/vrchat-community/template-package-listing)
のものをそのまま使用しています。
生成処理の本体は [vrchat-community/package-list-action](https://github.com/vrchat-community/package-list-action) です。
