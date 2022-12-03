const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: {
    main: path.join(__dirname, "src", "bundle_main.js"),
  },
  target: "node",
  output: {
    path: path.join(__dirname, "docs", "js"),
    filename: "bundle.js",
    library: "iv",
    libraryTarget: "umd",
    globalObject: "this",
  },
  externals: [nodeExternals()],
};
