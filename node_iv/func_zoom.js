//	----------------------------------------------------------------------------
//	イメージ拡縮処理
//	----------------------------------------------------------------------------
//	参照先:https://nodamushi.hatenablog.com/entry/20111015/1318686459
//	面積平均法をJavaScriptへ移植
exports.exec_zoom = (img, sizez = 0.25) => {
	//	元イメージ
	const src = img
	const w = img.width
	const h = img.height

	//	実行パラメータ
	const zoom_x = sizez
	const zoom_y = sizez
	const zoom_w = Math.ceil(zoom_x * w)
	const zoom_h = Math.ceil(zoom_y * h)
	const length_x = 1 / zoom_x
	const length_y = 1 / zoom_y

	//	中間画像の準備
	const canvas = document.createElement("canvas")
	const dst = canvas.getContext("2d").createImageData(zoom_w, zoom_h)

	for (let i = 0; i < zoom_w * zoom_h; i++) {

		const x = (i % zoom_w) >> 0
		const y = (i / zoom_w) >> 0
		const img_x = x / zoom_x
		const img_y = y / zoom_y
		let s = r = g = b = a = 0

		for (let dy = img_y; dy < img_y + length_y;) {
			const YY = dy >> 0
			if (YY >= h) break

			let nextdy = YY + 1
			if (nextdy > img_y + length_y) nextdy = img_y + length_y
			const ry = nextdy - dy

			for (let dx = img_x; dx < img_x + length_x;) {
				const XX = dx >> 0
				if (XX >= w) break

				let nextdx = XX + 1
				if (nextdx > img_x + length_x) nextdx = img_x + length_x
				const rx = nextdx - dx

				//	該当するピクセルが入っている面積
				const S = rx * ry
				const src_idx = (XX + YY * w) * 4
				const rc = src.data[src_idx + 0]	//	赤
				const gc = src.data[src_idx + 1]	//	緑
				const bc = src.data[src_idx + 2]	//	青
				const ac = src.data[src_idx + 3]	//	透明度

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
	return {
		height: zoom_h,
		width: zoom_w,
		image: dst
	}
}
