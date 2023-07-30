# How to development

## 一般

- pnpm i 〜 でライブラリインストール

## 動作確認

cd example
npm run reinstall
そしてVSCodeで確認

## Release

バージョンアップしたいコミットをする（package.jsonのversion更新もする）
その後に git tag vX.X.X でタグ付け
そしてプッシュしてmainにマージしておく
タグもプッシュしておく　git push origin --tags
そしてnpm publish

そしてgithubで登録
<https://github.com/lainNao/markdownlint-rule-trace-template-headers/releases>
Draft a new release
Choose a tag > 先程のタグ
Target > main
タイトル入力
リリースノート入力
Set as the latest releaseにチェックを入れている状態で Publish Release

## TODO

- other
- GitHubのPackages部分をnpmと連携 <https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry>
