/*------------------------------------------------------------------------------
electron.iv : event.js
--------------------------------------------------------------------------------
イベント定義
------------------------------------------------------------------------------*/
//	----------------------------------------------------------------------------
//	グローバル変数定義 - 画面制御関連
const $link = document.getElementById(`link`)
const $conf = document.getElementById(`conf`)
const $result = document.getElementById(`result_image`)
const $cvs_src = document.getElementById(`canvas_src`)
const $cvs_dst = document.getElementById(`canvas_dst`)
const $loading = document.getElementById(`loading`)
const $dropzone = document.getElementById(`dropzone`)
const $select_file = document.getElementById(`select_file`)
const $select_file_label = document.getElementById(`select_file_label`)
const $myOffcanvas = document.getElementById(`offcanvasNavbar`)
const $bsOffcanvas = new bootstrap.Offcanvas($myOffcanvas)
let $callback_func = null
let isOpenOffcanvas = false
let oldParams = { f: ``, x: ``, y: ``, z: ``, }
let img_src_path = ``

//	----------------------------------------------------------------------------
//	グローバル変数定義 - 入力パラメータ
const $r = document.getElementsByName(`param_group`)
const $c = document.getElementById(`param_center`)
const $s = document.getElementById(`param_link`)
const $x = document.getElementById(`param_sizex`)
const $y = document.getElementById(`param_sizey`)
const $z = document.getElementById(`param_sizez`)

//	----------------------------------------------------------------------------
//	スリープ関数
const sleep = (time) => new Promise((r) => setTimeout(r, time))

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
//	初期化処理
const initializeImageViewer = () => {
	//	イベントハンドラー dropzone dragover
	$dropzone.addEventListener(
		`dragover`,
		(e) => {
			e.stopPropagation()
			e.preventDefault()
			document.body.style.background = `#eff`
		},
		false
	)
	//	イベントハンドラー dropzone dragleave
	$dropzone.addEventListener(
		`dragleave`,
		(e) => {
			e.stopPropagation()
			e.preventDefault()
			document.body.style.background = `#cccccc`
		},
		false
	)
	//	イベントハンドラー dropzone drop
	$dropzone.addEventListener(
		`drop`,
		(e) => {
			e.stopPropagation()
			e.preventDefault()
			document.body.style.background = `#cccccc`	//	背景色を白に戻す
			const dropFiles = e.dataTransfer.files		//	ドロップファイルを取得
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
	resetSize()
}

const resetSize = () => {
	const size_def = 1
	//	処理前canvas リサイズ
	$cvs_src.setAttribute(`width`, size_def.toString())
	$cvs_src.setAttribute(`height`, size_def.toString())
	//	処理後canvas リサイズ
	$cvs_dst.setAttribute(`width`, size_def.toString())
	$cvs_dst.setAttribute(`height`, size_def.toString())
	//	imgタグ Bootstrap 非表示クラスの追加
	$loading.classList.add(`d-none`)
	$result.classList.add(`d-none`)
}

//	----------------------------------------------------------------------------
//	ファイル選択＆読み込み
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

const onFileSelectedBody = () => {
	//	サイズ初期化
	resetSize()
	//	読み込み実処理部
	const reader = new FileReader()
	reader.onload = (e1) => {
		const src = e1.target.result
		const img = new Image()
		img.onload = (e2) => {
			const img = createImageBuffer(e2.target)
			$cvs_src.width = img.width
			$cvs_src.height = img.height
			$cvs_src.getContext(`2d`).putImageData(img, 0, 0)
			$cvs_src.img_data = img
			$cvs_dst.img_data = null
			if ($callback_func !== null) {
				$callback_func()
			}
			oldParams.f = img_src_path
		}
		img.src = src
	}
	reader.readAsDataURL(img_src_path)
	//	ファイル名の表示
	$select_file_label.innerText = `${img_src_path.name}`
}

//	----------------------------------------------------------------------------
//	イメージ変換処理
const resizeImage = async (sender = ``) => {
	try {
		await resizeImageBody(sender)
	} finally {
		$result.classList.remove(`d-none`)
		$loading.classList.add(`d-none`)
	}
}

const judgeParamChange = () => {
	let result = { img: false, xy: false, z: false }
	const dst = $cvs_dst.img_data
	if (oldParams.f === img_src_path) {
		result.img = true
	}
	if (dst &&
		oldParams.x == $x.value &&
		oldParams.y == $y.value) {
		result.xy = true
	}
	if (dst &&
		oldParams.z == $z.value) {
		result.z = true
	}
	//	倍率指定＆同一縦横サイズ＆同一倍率
	if ($r[0].checked && result.xy && result.z) {
		const src = $cvs_src.img_data
		const w = src.width
		const h = src.height
		const zoom_z = ($z.value ?? 100.0) / 100.0
		const zoom_w = Math.ceil(zoom_z * w)
		const zoom_h = Math.ceil(zoom_z * h)
		//	縦横サイズを検査
		if (!($x.value == zoom_w && $y.value == zoom_h)) {
			result.z = false
		}
	}
	return result
}

const resizeImageBody = async (sender = ``) => {
	//	処理前イメージの検査
	const img = $cvs_src.img_data
	if (!img) {
		alert(`no image`)
		return
	}
	//	前回処理結果とのパラメータ比較検査
	let IsSame = judgeParamChange()
	//	処理後イメージとのサイズ比較検査
	const IsJudge = !$r[0].checked ? IsSame.xy : IsSame.z
	const dst = $cvs_dst.img_data
	if (dst && IsSame.img && IsJudge) {
		//	処理後イメージを準備
		result = {
			height: dst.height,
			width: dst.width,
			image: dst
		}
	} else {
		//	処理後イメージを準備
		result = {
			height: img.height,
			width: img.width,
			image: img
		}
		//	倍率指定？ or サイズ指定？
		switch ($r[0].checked) {
			case false:
				//	縦横比連動する場合
				if ($s.checked) {
					switch (sender) {
						case `x`:
							$y.value = Math.ceil(img.height * (($x.value ?? img.width) / img.width))
							$z.value = Math.floor(($x.value ?? img.width) * 10000 / img.width) / 100
							break
						case `y`:
							$x.value = Math.ceil(img.width * (($y.value ?? img.height) / img.height))
							$z.value = Math.floor(($y.value ?? img.height) * 10000 / img.height) / 100
							break
					}
				}
				//	縦横比連動後に再評価
				IsSame = judgeParamChange()
				//	処理前イメージとのサイズ比較
				if (!(IsSame.img && IsSame.xy)) {
					if (!IsSame.img) {
						$loading.classList.remove(`d-none`)
						$result.classList.add(`d-none`)
						await sleep(300)
					}
					//	パラメータ情報＆処理実行（bundle.js）
					sizex = $x.value ?? img.width
					sizey = $y.value ?? img.height
					result = await node_iv.exec_size(img, sizex, sizey)
				}
				break
			default:
				//	処理前イメージとの倍率比較
				if (!(IsSame.img && IsSame.z)) {
					if (!IsSame.img) {
						$loading.classList.remove(`d-none`)
						$result.classList.add(`d-none`)
						await sleep(300)
					}
					//	パラメータ情報＆処理実行（bundle.js）
					sizez = ($z.value ?? 100.0) / 100.0
					result = await node_iv.exec_zoom(img, sizez)
					oldParams = { ...oldParams, z: $z.value }
				}
				break
		}
	}
	//	処理後イメージをcanvasへ出力
	$cvs_dst.setAttribute(`width`, result.width)
	$cvs_dst.setAttribute(`height`, result.height)
	$cvs_dst.getContext(`2d`).putImageData(result.image, 0, 0)
	$cvs_dst.img_data = result.image
	oldParams = { ...oldParams, x: result.width, y: result.height }
	//	処理後イメージをクリップボードへ転送
	$cvs_dst.toBlob(blob => navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]))
	//	canvasからimgタグへ出力
	$result.setAttribute(`width`, result.width)
	$result.setAttribute(`height`, result.height)
	$result.src = $cvs_dst.toDataURL()
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
	const img = $cvs_dst.img_data
	if (!img) {
		alert(`no image`)
		return
	}
	//	ファイル名の編集
	const filename = img_src_path.name.split(`/`).reverse()[0].split(`.`)[0]
	console.log(`filename = ${filename}`)
	//	ダウンロードリンクの編集
	$link.href = (qty !== null)
		? $cvs_dst.toDataURL(mime, qty)
		: $cvs_dst.toDataURL(mime)
	$link.download = `${filename}_${$cvs_dst.width}x${$cvs_dst.height}`
	$link.click()
}

const $nav_png = document.getElementById(`btn_png`)
$nav_png.addEventListener(`click`, () => {
	saveImageData(`image/png`)
})

const $nav_jpg = document.getElementById(`btn_jpg`)
$nav_jpg.addEventListener(`click`, () => {
	saveImageData(`image/jpeg`, 1.0)
})

//	----------------------------------------------------------------------------
//	select_file onchangeイベント
$select_file.addEventListener(`change`, () => {
	onFileSelected($select_file)
})

//	----------------------------------------------------------------------------
//	radioButton onchangeイベント
//	textBox onchangeイベント
$r.forEach(x => x.addEventListener(`change`, () => { resizeImage() }))
$x.addEventListener(`change`, () => { resizeImage(`x`) })
$y.addEventListener(`change`, () => { resizeImage(`y`) })
$z.addEventListener(`change`, () => { resizeImage(`z`) })

//	----------------------------------------------------------------------------
//	checkBox onchangeイベント
$c.addEventListener(`change`, () => { $c_onchange() })
const $c_onchange = () => {
	if ($c.checked) {
		if (!$result.classList.replace(`display-normal`, `offcanvas-center`)) {
			$result.classList.add(`offcanvas-center`)
		}
	} else {
		if (!$result.classList.replace(`offcanvas-center`, `display-normal`)) {
			$result.classList.add(`display-normal`)
		}
	}
}

//	----------------------------------------------------------------------------
//	offcanvasイベント
$myOffcanvas.addEventListener(`show.bs.offcanvas`, () => {
	isOpenOffcanvas = true

	if (!$loading.classList.replace(`display-center`, `offcanvas-center`)) {
		$loading.classList.add(`offcanvas-center`)
	}
	if (!$result.classList.contains("display-normal")) {
		if (!$result.classList.replace(`display-center`, `offcanvas-center`)) {
			$result.classList.add(`offcanvas-center`)
		}
	}
})
$myOffcanvas.addEventListener(`hide.bs.offcanvas`, () => {
	isOpenOffcanvas = false

	if (!$loading.classList.replace(`offcanvas-center`, `display-center`)) {
		$loading.classList.add(`display-center`)
	}
	if (!$result.classList.contains("display-normal")) {
		if (!$result.classList.remove(`offcanvas-center`, `display-center`)) {
			$result.classList.add(`display-center`)
		}
	}
})

//	****************************************************************************

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
	document.title = `electron.iv`
} else {
	//	Web titlebar, btn_tool, nav_label → 非表示
	document.getElementById(`titlebar`).classList.add(`d-none`)
	document.getElementById(`btn_tool`).classList.add(`d-none`)
	document.getElementById(`nav_label`).innerHTML = `For Web Environments`
	document.title = `iv for web`

	//	for web style
	document.getElementsByClassName(`offcanvas-header`)[0].style.setProperty(`align-items`, `start`)
	$conf.classList.remove(`fa-xs`)
}

//	----------------------------------------------------------------------------
//	起動直後にchechBox = ON、navbarを開く
$s.checked = true
$c.checked = true
$c_onchange()
$bsOffcanvas.show()
