// ----------------------------------------------------------------------------
// 初期化本体
const client_body = () => {
  let dropzone_src = document.getElementById("dropzone");
  let select_src = document.getElementById("select_file");

  dropzone_src.addEventListener(
    "dragover",
    function (e) {
      e.stopPropagation();
      e.preventDefault();
      this.style.background = "#eff";
    },
    false
  );

  dropzone_src.addEventListener(
    "dragleave",
    function (e) {
      e.stopPropagation();
      e.preventDefault();
      this.style.background = "#fff";
    },
    false
  );

  dropzone_src.addEventListener(
    "drop",
    function (e) {
      e.stopPropagation();
      e.preventDefault();
      this.style.background = "#fff"; // 背景色を白に戻す
      let dropFiles = e.dataTransfer.files; // ドロップしたファイルを取得

      // 単一ファイル
      if (dropFiles.length > 1) {
        return alert("ドロップできるファイルは１つだけです");
      }

      // inputのvalueをドラッグしたファイルに置き換える
      select_src.files = dropFiles;
      img_src_path = dropFiles[0];

      // ファイルの読み込み
      onFileSelectedSubProc();
    },
    false
  );

  onSizeReset();
};

// ----------------------------------------------------------------------------
// <input type="file"> によるファイル選択
const onFileSelected = (input = null) => {
  if (input !== null && 0 < input.files.length) {
    img_src_path = input.files[0];
    onFileSelectedSubProc();
  } else {
    // ファイル選択がキャンセルされた時の復帰
    //  →「選択されていません」を回避する目的
    //    あえて再描画してません
    let select_src = document.getElementById("select_file");
    const obj = new DataTransfer();
    obj.items.add(img_src_path);
    select_src.files = obj.files;
  }
};

// ----------------------------------------------------------------------------
// drag&drop によるファイル選択
const onFileSelectedSubProc = () => {
    onSizeReset();
    let reader = new FileReader();
    reader.onload = onFileLoaded;
    reader.readAsDataURL(img_src_path);
};

// ----------------------------------------------------------------------------
// ファイル読み込み
const onFileLoaded = (e) => {
  let src = e.target.result;
  let img = new Image();
  img.onload = onImageSetted;
  img.src = src;
};

// ----------------------------------------------------------------------------
// イメージ表示
const onImageSetted = (e) => {
  let canvas = document.getElementById("canvas_src");
  let img_buf = createImageBuffer(e.target);
  canvas.width = img_buf.width;
  canvas.height = img_buf.height;
  canvas.getContext("2d").putImageData(img_buf, 0, 0);
  canvas.img_data = img_buf;
  if (callback_func !== null) callback_func();
};

// ----------------------------------------------------------------------------
// プレビュー領域サイズ初期化
const onSizeReset = () => {
  const sz_def = 100;

  // 非表示のcanvasタグのリサイズ
  {
    let cvs = document.getElementById("canvas_src");
    cvs.setAttribute("width", sz_def.toString());
    cvs.setAttribute("height", sz_def.toString());
  }

  // 非表示のcanvasタグのリサイズ
  {
    let cvs = document.getElementById("canvas_dst");
    cvs.setAttribute("width", sz_def.toString());
    cvs.setAttribute("height", sz_def.toString());
  }

  // imgタグには、PNG（1x1）を突っ込む
  {
    let cvs = document.getElementById("result_image");
    cvs.src = "data:image/png;base64,iVBORw0KGgoAAAANSU"
            + "hEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12"
            + "NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=";
    cvs.setAttribute("width", sz_def.toString());
    cvs.setAttribute("height", sz_def.toString());
  }
};

// ----------------------------------------------------------------------------
// イメージバッファ生成
const createImageBuffer = (img) => {
  let cvs = document.createElement("canvas");
  let ctx = cvs.getContext("2d");
  cvs.width = img.naturalWidth;
  cvs.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);
  let data = ctx.getImageData(0, 0, cvs.width, cvs.height);
  return data;
};

// ----------------------------------------------------------------------------
// canvasからのイメージダウンロード処理
const saveImageData = (mime, qty = null) => {
  const cvs_dst = document.getElementById("canvas_dst");
  const img_dst = cvs_dst.img_data;
  if (!img_dst) {
    alert("no image");
    return;
  }

  const filename = img_src_path.name.split("/").reverse()[0].split(".")[0];
  console.log("filename = " + filename);

  const downloadLink = document.getElementById("download_link");
  if (qty !== null) {
    downloadLink.href = cvs_dst.toDataURL(mime, qty);
  } else {
    downloadLink.href = cvs_dst.toDataURL(mime);
  }
  downloadLink.download = filename + `_${cvs_dst.width}x${cvs_dst.height}`;
  downloadLink.click();
};

// ----------------------------------------------------------------------------
// JPGイメージ wrapper
const saveJPGImageData = () => {
  saveImageData("image/jpeg", 1.0);
};

// ----------------------------------------------------------------------------
// PNGイメージ wrapper
const savePNGImageData = () => {
  saveImageData("image/png");
};
