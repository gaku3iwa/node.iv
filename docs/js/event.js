/*------------------------------------------------------------------------------
electron.iv : event.js
--------------------------------------------------------------------------------
イベント定義
------------------------------------------------------------------------------*/
//	----------------------------------------------------------------------------
//	グローバル変数定義 - 画面制御関連
const $link = document.getElementById(`link`)
const $csrc = document.getElementById(`canvas_src`)
const $cdst = document.getElementById(`canvas_dst`)
const $result = document.getElementById(`result_image`)
const $dropzone = document.getElementById(`dropzone`)
const $select_file = document.getElementById(`select_file`)
const $select_file_label = document.getElementById(`select_file_label`)
let $callback_func = null
let img_src_path = ``

//	----------------------------------------------------------------------------
//	グローバル変数定義 - 入力パラメータ
const $r = document.getElementsByName(`param_group`)
const $x = document.getElementById(`param_sizex`)
const $y = document.getElementById(`param_sizey`)
const $z = document.getElementById(`param_sizez`)

//	----------------------------------------------------------------------------
//	イメージバッファ生成
const createImageBuffer = (img) => {
	const cvs = document.createElement(`canvas`)
	const ctx = cvs.getContext(`2d`)
	cvs.width = img.naturalWidth
	cvs.height = img.naturalHeight
	ctx.drawImage(img, 0, 0)
	const data = ctx.getImageData(0, 0, cvs.width, cvs.height)
	return data
}

//	----------------------------------------------------------------------------
//	初期化 - 処理本体
const initializeImageViewer = () => {
	//	イベントハンドラー dropzone dragover
	$dropzone.addEventListener(
		`dragover`,
		function (e) {
			e.stopPropagation()
			e.preventDefault()
			document.body.style.background = `#eff`
		},
		false
	)
	//	イベントハンドラー dropzone dragleave
	$dropzone.addEventListener(
		`dragleave`,
		function (e) {
			e.stopPropagation()
			e.preventDefault()
			document.body.style.background = `#cccccc`
		},
		false
	)
	//	イベントハンドラー dropzone drop
	$dropzone.addEventListener(
		`drop`,
		function (e) {
			e.stopPropagation()
			e.preventDefault()
			document.body.style.background = `#cccccc`  //	背景色を白に戻す
			const dropFiles = e.dataTransfer.files      //	ドロップファイルを取得
			//	単一ファイル
			if (dropFiles.length > 1) {
				return alert(`ドロップできるファイルは１つだけです`)
			}
			//	input.valueをドロップしたファイルへ置き換え
			$select_file.files = dropFiles
			img_src_path = dropFiles[0]
			onFileSelectedBody()
		},
		false
	)
	//	サイズ初期化
	onSizeReset()
}

//	----------------------------------------------------------------------------
//	プレビュー領域サイズ初期化
const onSizeReset = () => {
	const size_def = 1
	//	処理前canvas リサイズ
	$csrc.setAttribute(`width`, size_def.toString())
	$csrc.setAttribute(`height`, size_def.toString())
	//	処理後canvas リサイズ
	$cdst.setAttribute(`width`, size_def.toString())
	$cdst.setAttribute(`height`, size_def.toString())
	//	imgタグ Bootstrap 非表示クラスの追加
	$result.classList.add(`d-none`)
}

//	----------------------------------------------------------------------------
//	ファイル選択 - イベントハンドラー
const onLoadFromInput = () => {
	onFileSelected($select_file)
}

//	----------------------------------------------------------------------------
//	ファイル選択 - イベント処理本体
const onFileSelected = (input = null) => {
	if (input !== null && 0 < input.files.length) {
		img_src_path = input.files[0]
		onFileSelectedBody()
	} else {
		//	ファイル選択がキャンセルされた時の復帰
		//	→「選択されていません」を回避する目的、あえて再描画しない
		const obj = new DataTransfer()
		obj.items.add(img_src_path)
		$select_file.files = obj.files
	}
}

//	----------------------------------------------------------------------------
//	ファイル読み込み - 処理本体
const onFileSelectedBody = () => {
	//	サイズ初期化
	onSizeReset()
	//	読み込み実処理部
	const reader = new FileReader()
	reader.onload = (e1) => {
		const src = e1.target.result
		const img = new Image()
		img.onload = (e2) => {
			const img = createImageBuffer(e2.target)
			$csrc.width = img.width
			$csrc.height = img.height
			$csrc.getContext(`2d`).putImageData(img, 0, 0)
			$csrc.img_data = img
			if ($callback_func !== null) {
				$callback_func()
			}
		}
		img.src = src
	}
	reader.readAsDataURL(img_src_path)
	//	ファイル名の表示
	$select_file_label.innerText = `${img_src_path.name}`
}

//	----------------------------------------------------------------------------
//	イメージ変換処理
const resizeImage = async () => {
	//	処理前イメージの検査
	const img = $csrc.img_data
	if (!img) {
		alert(`no image`)
		return
	}
	//	パラメータ情報＆処理実行（bundle.js）
	switch ($r[0].checked) {
		case false:
			sizex = $x.value ?? img.width
			sizey = $y.value ?? img.height
			result = await iv.exec_size(img, sizex, sizey)
			break
		default:
			zoom = ($z.value ?? 100.0) / 100.0
			result = await iv.exec_zoom(img, zoom)
			break
	}
	//	処理結果のイメージをcanvasへ出力
	$cdst.setAttribute(`width`, result.width)
	$cdst.setAttribute(`height`, result.height)
	$cdst.getContext(`2d`).putImageData(result.image, 0, 0)
	$cdst.img_data = result.image
	//	処理結果をクリップボードへ自動転送
	$cdst.toBlob(blob => navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]))
	//	canvasからimgタグへ出力
	$result.setAttribute(`width`, result.width)
	$result.setAttribute(`height`, result.height)
	$result.src = $cdst.toDataURL()
	//	imgタグの表示
	$result.classList.remove(`d-none`)
	//	処理結果のイメージサイズを表示
	$x.value = `${result.width}`
	$y.value = `${result.height}`
	//	処理前の画素数、イメージサイズを表示
	document.getElementById(`original_sizep`).innerHTML = `${(img.width * img.height).toLocaleString()}`
	document.getElementById(`original_sizex`).innerHTML = `${img.width.toLocaleString()}`
	document.getElementById(`original_sizey`).innerHTML = `${img.height.toLocaleString()}`
	//	処理後の画素数、イメージサイズを表示
	document.getElementById(`result_sizep`).innerHTML = `${(result.width * result.height).toLocaleString()}`
	document.getElementById(`result_sizex`).innerHTML = `${result.width.toLocaleString()}`
	document.getElementById(`result_sizey`).innerHTML = `${result.height.toLocaleString()}`
}

//	----------------------------------------------------------------------------
//	canvasからのイメージダウンロード - 処理本体
const saveImageData = (mime, qty = null) => {
	//	処理後イメージの検査
	const img = $cdst.img_data
	if (!img) {
		alert(`no image`)
		return
	}
	//	ファイル名の編集
	const filename = img_src_path.name.split(`/`).reverse()[0].split(`.`)[0]
	console.log(`filename = ${filename}`)
	//	ダウンロードリンクの編集
	$link.href = (qty !== null)
		? $cdst.toDataURL(mime, qty)
		: $cdst.toDataURL(mime)
	$link.download = `${filename}_${$cdst.width}x${$cdst.height}`
	$link.click()
}

//	----------------------------------------------------------------------------
//	JPGイメージ wrapper
const saveJPGImageData = () => {
	saveImageData(`image/jpeg`, 1.0)
}

//	----------------------------------------------------------------------------
//	PNGイメージ wrapper
const savePNGImageData = () => {
	saveImageData(`image/png`)
}

//	----------------------------------------------------------------------------
//	select_file onchangeイベント
$select_file.addEventListener(`change`, () => {
	onLoadFromInput()
})

//	----------------------------------------------------------------------------
//	radioButton onchangeイベント
$r.forEach(x => x.addEventListener(`change`, () => { resizeImage() }))

//	----------------------------------------------------------------------------
//	textBox onchangeイベント
$x.addEventListener(`change`, () => { resizeImage() })
$y.addEventListener(`change`, () => { resizeImage() })
$z.addEventListener(`change`, () => { resizeImage() })

//	----------------------------------------------------------------------------
//	コールバック関数を定義
$callback_func = resizeImage
//	初期化実行
initializeImageViewer()
//	Electron実行環境の判定
if (isRunningElectron) {
	//	Electron titlebar, btn_tool, nav_label → 表示
	document.getElementById(`titlebar`).classList.remove(`d-none`)
	document.getElementById(`btn_tool`).classList.remove(`d-none`)
	document.getElementById(`nav_label`).innerHTML = `Powered by Electron`
} else {
	//	Web titlebar, btn_tool, nav_label → 非表示
	document.getElementById(`titlebar`).classList.add(`d-none`)
	document.getElementById(`btn_tool`).classList.add(`d-none`)
	document.getElementById(`nav_label`).innerHTML = `For Web Environments`
}
//	起動直後にnavbarを開く
const myOffcanvas = document.getElementById(`offcanvasNavbar`)
const bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas)
bsOffcanvas.show()
