const { merge } = require("webpack-merge")
const path = require("path")
//	汎用設定をインポート
const common = require("./webpack.common.js")

//	common設定とマージする
module.exports = merge(common, {
	mode: "production",					//	本番モード
	devtool: "source-map",
})
