# node.iv | electron.iv

* サンプルページは、[ここ](https://gaku3iwa.github.io/node.iv/)
  * ~~uiは、全く凝っていません~~
  * Bootstrap を使って、uiを大幅に改変(v2.0～)

## 更新履歴

* バージョン履歴
  | version |     更新日 |      | メモ                                                                                                                         |
  | ------: | ---------: | ---- | ---------------------------------------------------------------------------------------------------------------------------- |
  |   2.1.0 | 2024.04.29 | html | 「onclick」「onchange」イベント排除、「～.addEventListener」へ統一                                                           |
  |         |            |      | 主に数値入力系inputタグへ「inputmode」属性を追加<br>スマホ、タブレットでの利用を想定                                         |
  |         |            |      | ファイル読み込み、演算処理の際に表示するLoadingアイコンを追加                                                                |
  |         |            |      | 縦横比連動を指定するアイコン(button)追加<br>規定値：true(縦横比連動する)                                                     |
  |         |            |      | 処理結果イメージのセンタリングを指定するcheckBox追加<br>規定値：true(センタリングする)                                       |
  |         |            |      | オフキャンバスのフォントサイズの微調整                                                                                       |
  |         |            | css  | web環境とElectron環境でプロパティを微調整                                                                                    |
  |         |            |      | 処理結果のプロパティ変更(表示位置やサイズの変化)に伴い、アニメーションさせてみた                                             |
  |         |            | js   | 前回処理結果と比較し、毎回演算させない処理を追加                                                                             |
  |         |            |      | Loadingアイコンの追加に伴う、表示・非表示制御を追加                                                                          |
  |         |            |      | 縦横比連動アイコンの追加に伴う、演算処理を追加                                                                               |
  |         |            |      | オフキャンバスの表示・非表示に伴い、見た目のセンタリングを維持する目的としたimgタグ、Loadingアイコンへのクラス置換制御を追加 |
  |   2.0.0 | 2024.04.24 | src  | 「倍率」、「幅/高さ」の２つのバージョンをリリース                                                                            |
  |         |            | docs | Electronでの動作も考慮して公開ページも改変                                                                                   |
  |   1.0.0 | 2022.01.17 |      | シンプルに「縮小率」だけを指定する初期バージョンとしてリリース                                                               |

## 開発メモ

* JavaScriptでの画像処理を実践してみた
* node.ivの部分は、**webpack**でモジュールバンドルを図ってみた
* サーバーサイドでは何もしてないので、処理速度はブラウザ性能に完全依存
* 画像リサイズ(縮小)をwebAppとして公開する目的
  * アルゴリズムには、面積平均法(別名：平均画素法、積分法)を選択
  * モダンブラウザ環境さえあれば、どんなOS環境でも動作して欲しかった
* イメージ出力先は、imgタグへ
  * 開発初期段階ではcanvasへの出力で満足してたけど…
  * スマホ、タブレットだとイメージ保存できなかった😱
  * 試行錯誤の結果、imgタグを追加、src属性へpngとして流し込んで解決
* Electron実行環境の勉強(v2.0～)
  * webAppだけじゃなく、desktopAppとしても、どんなOS環境でも動くプログラム開発を目指した試行
  * レスポンシブデザインなdesktopAppを作りたかった
    * このプログラムでは、全くお世話になってないが…
  * Electron特有のプロセス間通信、BrowserWindow機能など、いろいろと試行錯誤してみた
    * Electron環境で実行している判断とか
  * web環境でもElectron環境でも同じソースで完結させたかったので、特にデザイン(ui)側では”classList”の追加、削除、置換が激しい点が難読
* 次の段階は、**electron-builder**、**vite**を活用した実証実験かな？


## 開発環境

* v2.0～
  * 開発／テスト、WindowsPC + VS Code + Chrome, Edge
  * テスト、iPad mini 5th + Chrome, Android + Chrome
* v1.0
  * 開発／テスト、iMac(Late 2015) + VS Code + Chrome
  * テスト、iPad mini 5th + Chrome
