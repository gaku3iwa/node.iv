//	-----------------------------------------------------------------------------
//	イメージ縮小処理
//	-----------------------------------------------------------------------------
//	参照先:https://nodamushi.hatenablog.com/entry/20111015/1318686459
//	面積平均法をJavaScriptへ移植
exports.exec_zoom = (img, sizez = 0.25) => {
	let result = { width: 0, height: 0, image: null }

	let src = img
	let w = img.width
	let h = img.height

	let zoom_x = sizez
	let zoom_y = sizez
	let zoom_w = Math.ceil(zoom_x * w)
	let zoom_h = Math.ceil(zoom_y * h)
	let length_x = 1 / zoom_x
	let length_y = 1 / zoom_y

	//	中間画像の準備
	let canvas = document.createElement("canvas")
	let dst = canvas.getContext("2d").createImageData(zoom_w, zoom_h)

	for (let i = 0; i < zoom_w * zoom_h; i++) {

		let x = (i % zoom_w) >> 0
		let y = (i / zoom_w) >> 0
		let img_x = x / zoom_x
		let img_y = y / zoom_y
		let s = r = g = b = a = 0

		for (let dy = img_y; dy < img_y + length_y;) {
			let Y = dy >> 0
			if (Y >= h) break

			let nextdy = Y + 1
			if (nextdy > img_y + length_y) nextdy = img_y + length_y
			let ry = nextdy - dy

			for (let dx = img_x; dx < img_x + length_x;) {
				let X = dx >> 0
				if (X >= w) break

				let nextdx = X + 1
				if (nextdx > img_x + length_x) nextdx = img_x + length_x
				let rx = nextdx - dx

				//	該当するピクセルが入っている面積
				let S = rx * ry
				let src_idx = (X + Y * w) * 4
				let rc = src.data[src_idx + 0]	//	赤
				let gc = src.data[src_idx + 1]	//	緑
				let bc = src.data[src_idx + 2]	//	青
				let ac = src.data[src_idx + 3]	//	透明度

				//	面積の重みを掛けて総和を算出
				r += rc * S
				g += gc * S
				b += bc * S
				a += ac * S
				s += S

				dx = nextdx
			}
			dy = nextdy
		}

		//	面積で平均化
		r /= s
		g /= s
		b /= s
		a /= s

		//	整数化
		r = r >> 0
		g = g >> 0
		b = b >> 0
		a = a >> 0

		//	面積平均化したピクセルを出力先へ
		let dst_idx = (x + y * zoom_w) * 4
		dst.data[dst_idx + 0] = r
		dst.data[dst_idx + 1] = g
		dst.data[dst_idx + 2] = b
		dst.data[dst_idx + 3] = a
	}

	//	処理結果の戻り値
	result.width = zoom_w
	result.height = zoom_h
	result.image = dst

	return result
}
