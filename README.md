> # node.iv

* サンプルページは、[ここ](https://gaku3iwa.github.io/node.iv/)
  * uiは、全く凝っていません🤣

* 面積平均法（別名：平均画素法、積分法）での画像リサイズ（縮小）をウェブアプリとして公開する目的
  * 以前、Windowsアプリで作成したけど…
  * ウェブブラウザさえあれば、どんなOS環境でも動作して欲しかった😅

* イメージ出力先としてもcanvasを使ってたけど…
  * スマホ、タブレットだと保存できないので、最終的にはimgタグへPNGとして流し込んでます

> ## 更新履歴

* バージョン履歴
  | version |     更新日 | メモ                                                       |
  | ------: | ---------: | ---------------------------------------------------------- |
  |   1.0.0 | 2022.01.17 | シンプルに「縮小率」を指定する初期バージョンとしてリリース |

* 開発メモ
  * JavaScriptでの画像処理を実践してみた
  * **webpack**で、モジュールバンドルを図ってみた
  * サーバーサイドでは何もしてないので、処理速度はマシン（ブラウザ）性能に依存

* 開発環境
  * 開発／テスト、iMac(Late 2015) + VS Code + Chrome
  * テスト、iPad mini 5th + Chrome
