const path = require("path");
const { defineConfig } = require("@vue/cli-service");
const coverPath = path.join(__dirname, "./src/cover.less");
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === "production" ? "/toutiao/" : "/",
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/action": {
        target: "https://data.mongodb-api.com/app/data-ycnee/endpoint/data/v1",
        changeOrigin: true,
      },
    },
  },
  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          modifyVars: {
            // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
            hack: `true; @import "${coverPath}";`,
          },
        },
      },
    },
  },
});
