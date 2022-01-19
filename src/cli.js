// ----------------------------------------------------------------------------
// イメージ縮小処理
// ----------------------------------------------------------------------------
// 参照先:https://nodamushi.hatenablog.com/entry/20111015/1318686459
// 面積平均法をJavaScriptへ移植
exports.exec = (img, zoom = 0.25) => {
  let result = { w: 0, h: 0, img: null };

  let src = img;
  let w = img.width;
  let h = img.height;

  let length = 1 / zoom;
  let zoomw = Math.ceil(zoom * w);
  let zoomh = Math.ceil(zoom * h);

  // 中間画像の準備
  let canvas = document.createElement("canvas");
  let dst = canvas.getContext("2d").createImageData(zoomw, zoomh);

  for (let i = 0; i < zoomw * zoomh; i++) {
    let x = i % zoomw >> 0;
    let y = (i / zoomw) >> 0;

    let imgx = x / zoom;
    let imgy = y / zoom;
    let s = 0,
      r = 0,
      g = 0,
      b = 0,
      a = 0;

    for (let dy = imgy; dy < imgy + length; ) {
      let Y = dy >> 0;
      if (Y >= h) break;

      let nextdy = Y + 1;
      if (nextdy > imgy + length) nextdy = imgy + length;
      let ry = nextdy - dy;

      for (let dx = imgx; dx < imgx + length; ) {
        let X = dx >> 0;
        if (X >= w) break;

        let nextdx = X + 1;
        if (nextdx > imgx + length) nextdx = imgx + length;
        let rx = nextdx - dx;

        // 該当するピクセルが入っている面積
        let S = rx * ry;
        let src_idx = (X + Y * w) * 4;
        let rc = src.data[src_idx + 0]; //赤
        let gc = src.data[src_idx + 1]; //緑
        let bc = src.data[src_idx + 2]; //青
        let ac = src.data[src_idx + 3]; //透明度

        // 面積の重みを掛けて総和を算出
        r += rc * S;
        g += gc * S;
        b += bc * S;
        a += ac * S;
        s += S;

        dx = nextdx;
      }
      dy = nextdy;
    }

    // 面積で平均化
    r /= s;
    g /= s;
    b /= s;
    a /= s;

    // 整数化
    r = r >> 0;
    g = g >> 0;
    b = b >> 0;
    a = a >> 0;

    // 面積平均化したピクセルを出力先へ
    let dst_idx = (x + y * zoomw) * 4;
    dst.data[dst_idx + 0] = r;
    dst.data[dst_idx + 1] = g;
    dst.data[dst_idx + 2] = b;
    dst.data[dst_idx + 3] = a;
  }

  // 処理結果の戻り値
  result.w = zoomw;
  result.h = zoomh;
  result.img = dst;

  return result;
};
