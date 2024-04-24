/*------------------------------------------------------------------------------
electron.iv : main.js
--------------------------------------------------------------------------------
メインプロセス
------------------------------------------------------------------------------*/
const { app, ipcMain, BrowserWindow, Menu } = require(`electron`)
const package = require(`../package.json`)
const path = require(`node:path`)
const url = require(`node:url`)

//	----------------------------------------------------------------------------
//	グローバル変数
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = `1`
let mainWindow = null

//	----------------------------------------------------------------------------
//	ウィンドウ生成
const createWindow = () => {
	//	ウィンドウオプション定義
	let win_option = {
		width: 1000,
		height: 600,
		minWidth: 400,
		minHeight: 75,
		titleBarStyle: 'hidden',
		titleBarOverlay: false,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.join(__dirname, `js/preload.js`)
		}
	}
	//	ウィンドウ生成
	mainWindow = new BrowserWindow(win_option)
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, `index.html`),
		protocol: `file:`,
		slashes: true
	}))
	//	イベントハンドラー定義
	mainWindow
		.on(`closed`, () => { mainWindow = null })
		.on(`maximize`, () => { mainWindow.webContents.send(`maximize`) })
		.on(`unmaximize`, () => { mainWindow.webContents.send(`unmaximize`) })
		.on(`will-move`, () => {
			if (mainWindow.isMaximized()) {
				mainWindow.unmaximize()
			}
		})
		.on(`will-resize`, () => {
			if (mainWindow.isMaximized()) {
				mainWindow.unmaximize()
			}
		})
}

//	----------------------------------------------------------------------------
//	app モジュール すべてのウィンドウが閉じられた
app.on(`window-all-closed`, () => {
	if (process.platform !== `darwin`) {
		app.quit()
	}
})

//	----------------------------------------------------------------------------
//	app モジュール ready イベント発生 - ウィンドウ生成
app.whenReady()
	.then(() => {
		//	ウィンドウ生成
		createWindow()
		app.on(`activate`, () => {
			if (BrowserWindow.getAllWindows().length === 0) {
				createWindow()
			}
		})
		//	プロセス間通信 titlebar イベント
		ipcMain
			.on(`win_cls`, () => { mainWindow.close() })
			.on(`win_min`, () => { mainWindow.minimize() })
			.on(`win_max`, () => { mainWindow.maximize() })
			.on(`win_res`, () => { mainWindow.unmaximize() })
		//	プロセス間通信 navbar イベント
		ipcMain
			.on(`devtools`, () => {
				const bStatus = mainWindow.webContents.isDevToolsOpened()
				switch (bStatus) {
					case true:
						mainWindow.webContents.closeDevTools()
						break
					case false:
						mainWindow.webContents.openDevTools()
						break
				}
			})
		//	プロセス間通信 バージョン情報 イベント
		ipcMain
			.handle(`app_version`, (event, message) => {
				return package.version
			})
	})
