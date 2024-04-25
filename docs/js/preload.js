/*------------------------------------------------------------------------------
electron.iv : preload.js
--------------------------------------------------------------------------------
プリロード
------------------------------------------------------------------------------*/
const { contextBridge, ipcRenderer } = require(`electron`)

//	----------------------------------------------------------------------------
//	contextBridge モジュール プロセス間通信（from ipcRenderer to ipcMain）
contextBridge.exposeInMainWorld(
	`electron`, {

	//	公開API for titlebar
	callWindowMinimize: () => ipcRenderer.send(`win_min`),
	callWindowMaximize: () => ipcRenderer.send(`win_max`),
	callWindowRestore: () => ipcRenderer.send(`win_res`),
	callWindowClose: () => ipcRenderer.send(`win_cls`),

	//	公開API for navbar
	callDevTools: () => ipcRenderer.send(`devtools`),

	//	公開API for contents
	v8: () => process.versions.v8,
	zlib: () => process.versions.zlib,
	node: () => process.versions.node,
	chrome: () => process.versions.chrome,
	openssl: () => process.versions.openssl,
	electron: () => process.versions.electron,
	app_version: async () => {
		const result = await ipcRenderer.invoke(`app_version`)
		return result
	},
})

/*------------------------------------------------------------------------------
contextBridge モジュール プロセス間通信（from ipcMain to ipcRenderer）
------------------------------------------------------------------------------*/
ipcRenderer
	.on(`maximize`, (event, arg) => {
		//	イベント通知：最大化
		//	アイコンボタンの表示／非表示を切り替える
		document.getElementById(`btn_w_max`).classList.add(`d-none`)	//	最大化：非表示
		document.getElementById(`btn_w_res`).classList.remove(`d-none`)	//	戻す　：表示
	})
	.on(`unmaximize`, (event, arg) => {
		//	イベント通知：元のサイズに戻す
		//	アイコンボタンの表示／非表示を切り替える
		document.getElementById(`btn_w_max`).classList.remove(`d-none`)	//	最大化：表示
		document.getElementById(`btn_w_res`).classList.add(`d-none`)	//	戻す　：非表示
	})
