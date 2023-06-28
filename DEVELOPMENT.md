# How to development

## 動作確認

cd example
npm run reinstall
そしてVSCodeで確認

## Release

バージョンアップしたいコミットをしたら、その後に git tag vX.X.X でタグ付け
そしてプッシュしてmainにマージしておく
そしてnpm publish ./

そしてgithubで登録
<https://github.com/lainNao/markdownlint-rule-trace-template-headers/releases>
Draft a new release
Choose a tag > 先程のタグ
Target > main
タイトル入力
リリースノート入力
Set as the latest releaseにチェックを入れている状態で Publish Release

## TODO

- delete semantic release（使いづらい）
- other
