// ----------------------------------------------------------------------------
// 初期化本体
const client_body = () => {
  let src_dropzone = document.getElementById("dropzone");
  let src_select = document.getElementById("select_file");

  src_dropzone.addEventListener(
    "dragover",
    function (e) {
      e.stopPropagation();
      e.preventDefault();
      this.style.background = "#eff";
    },
    false
  );

  src_dropzone.addEventListener(
    "dragleave",
    function (e) {
      e.stopPropagation();
      e.preventDefault();
      this.style.background = "#fff";
    },
    false
  );

  src_dropzone.addEventListener(
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
      src_select.files = dropFiles;
      src_image_path = dropFiles[0];

      // ファイルの読み込み
      onFileSelected();
    },
    false
  );

  onSizeReset();
};

// ----------------------------------------------------------------------------
// ファイル選択
const onFileSelected = (input = null) => {
  if (input !== null) {
    src_image_path = input.files[0];
  }
  onSizeReset();
  let reader = new FileReader();
  reader.onload = onFileLoaded;
  reader.readAsDataURL(src_image_path);
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
  let img_data = createImageData(e.target);
  canvas.width = img_data.width;
  canvas.height = img_data.height;
  canvas.getContext("2d").putImageData(img_data, 0, 0);
  canvas.img_data = img_data;
  if (callback_func !== null) callback_func();
};

// ----------------------------------------------------------------------------
// プレビュー領域サイズ初期化
const onSizeReset = () => {
  const defSize = 100;

  // 非表示のcanvasタグのリサイズ
  {
    let cv = document.getElementById("canvas_src");
    cv.setAttribute("width", defSize.toString());
    cv.setAttribute("height", defSize.toString());
  }

  // 非表示のcanvasタグのリサイズ
  {
    let cv = document.getElementById("canvas_dst");
    cv.setAttribute("width", defSize.toString());
    cv.setAttribute("height", defSize.toString());
  }

  // imgタグには、PNG（1x1）を突っ込む
  {
    let cv = document.getElementById("output_image");
    cv.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=";
    cv.setAttribute("width", defSize.toString());
    cv.setAttribute("height", defSize.toString());
  }
};

// ----------------------------------------------------------------------------
// イメージバッファ生成
const createImageData = (img) => {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);
  let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return data;
};

// ----------------------------------------------------------------------------
// canvasからのイメージダウンロード処理
const saveImageData = (mime, qty = null) => {
  const dst_cv = document.getElementById("canvas_dst");
  const img = dst_cv.img_data;
  if (!img) {
    alert("no small image");
    return;
  }

  const filename = src_image_path.name.split("/").reverse()[0].split(".")[0];
  console.log("filename = " + filename);

  const downloadLink = document.getElementById("download_link");
  if (qty !== null) {
    downloadLink.href = dst_cv.toDataURL(mime, qty);
  } else {
    downloadLink.href = dst_cv.toDataURL(mime);
  }
  downloadLink.download = filename + "_small";
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
