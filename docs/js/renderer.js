/*------------------------------------------------------------------------------
electron.iv : renderer.js
--------------------------------------------------------------------------------
レンダラープロセス
------------------------------------------------------------------------------*/
//	----------------------------------------------------------------------------
//	環境変数的なプロパティ
const isRunningElectron = typeof electron !== `undefined`

//	----------------------------------------------------------------------------
//	変数定義
const $win_min = document.getElementById(`btn_w_min`)
const $win_max = document.getElementById(`btn_w_max`)
const $win_res = document.getElementById(`btn_w_res`)
const $win_cls = document.getElementById(`btn_w_cls`)

//	----------------------------------------------------------------------------
//	イベントハンドラー
$win_min.addEventListener(`click`, () => { electron.callWindowMinimize() })
$win_max.addEventListener(`click`, () => { electron.callWindowMaximize() })
$win_res.addEventListener(`click`, () => { electron.callWindowRestore() })
$win_cls.addEventListener(`click`, () => { electron.callWindowClose() })

//	----------------------------------------------------------------------------
//	btn_tool onclickイベント
const $nav_tool = document.getElementById(`btn_tool`)
$nav_tool.addEventListener(`click`, () => { electron.callDevTools() })

//	----------------------------------------------------------------------------
//	btn_tool onclickイベント
const $nav_help = document.getElementById(`btn_help`)
$nav_help.addEventListener(`click`, () => {
	if (typeof electron !== `undefined`) {
		//	Electron環境で実行中
		electron.app_version()
			.then((data) => {
				let msg = [
					`image viewer : v${data}`,
					``,
					`node : v${electron.node()}`,
					`electron : v${electron.electron()}`,
					`chrome : v${electron.chrome()}`,
					`v8 : v${electron.v8()}`,
					`zlib : v${electron.zlib()}`,
					`openssl : v${electron.openssl()}`,
					``,
				]
				alert(`${msg.join(`\n`)}`)
			})
	} else {
		alert(`Now running in development branch\nただいま、開発ブランチで実行中`)
	}
})
