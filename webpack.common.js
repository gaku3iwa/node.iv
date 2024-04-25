const path = require("path")
const nodeExternals = require("webpack-node-externals")

module.exports = {
	entry: {
		main: path.join(__dirname, "node_iv", "bundle_main.js"),
	},
	target: "node",
	output: {
		path: path.join(__dirname, "docs", "js"),
		filename: "node_iv_bundle.js",
		library: "node_iv",
		libraryTarget: "umd",
		globalObject: "this",
	},
	externals: [nodeExternals()],
}
