# Font to JSON/JS Converter

フォントファイル（TTF, OTF, WOFF）をJSON/JavaScript形式に変換する無料オンラインツール

🔗 **デモ**: [https://load-opentype-font.vercel.app/](https://load-opentype-font.vercel.app/)

## 特徴

- 🎨 **複数のフォント形式に対応**: TTF, OTF, WOFF形式のフォントファイルを変換可能
- 🔒 **プライバシー重視**: ブラウザ上で完結し、サーバーにファイルをアップロードしません
- ⚡ **高速変換**: opentype.jsを使用した高速なフォント解析
- 📱 **レスポンシブデザイン**: モバイルデバイスでも快適に使用可能

## 技術スタック

- **フレームワーク**: [Next.js 14](https://nextjs.org/) (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **フォント処理**: [opentype.js](https://opentype.js.org/)
- **デプロイ**: Vercel

## セットアップ

### 前提条件

- Node.js 20.x以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd font-converter

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

## 使い方

1. 「フォントファイルを選択」ボタンをクリック
2. TTF、OTF、またはWOFFファイルを選択
3. 出力形式（JSON/JavaScript）を選択
4. 「変換」ボタンをクリック
5. 変換されたデータをコピーまたはダウンロード

## スクリプト

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm start

# Lintチェック
npm run lint
```

### 本番環境の設定

環境変数 `NEXT_PUBLIC_BASE_URL` を設定することで、本番環境のURLを指定できます:

```bash
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## デプロイ

### Vercel（推奨）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<repository-url>)

または、手動でデプロイ:

```bash
# Vercel CLIをインストール
npm install -g vercel

# デプロイ
vercel
```

### その他のプラットフォーム

Next.jsアプリケーションなので、以下のプラットフォームでもデプロイ可能です:

- Netlify
- AWS Amplify
- Google Cloud Platform
- Azure Static Web Apps

## プロジェクト構成

```
.
├── app/
│   ├── layout.tsx          # ルートレイアウト（メタデータ設定）
│   ├── page.tsx            # トップページ
│   ├── sitemap.ts          # サイトマップ生成
│   ├── robots.ts           # robots.txt生成
│   ├── manifest.ts         # PWAマニフェスト
│   ├── opengraph-image.tsx # OGP画像生成
│   └── globals.css         # グローバルスタイル
├── components/
│   └── FontConverter.tsx   # フォント変換コンポーネント
├── lib/
│   └── fontConverter.ts    # フォント変換ロジック
├── public/                 # 静的ファイル
└── README.md              # このファイル
```

## ライセンス

MIT License

## 貢献

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## サポート

問題が発生した場合は、[Issues](../../issues)で報告してください。
