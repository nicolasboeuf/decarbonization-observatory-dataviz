const webpack = require('webpack')
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      })
    ]
  },
  filenameHashing: false,
  productionSourceMap: false,
  //publicPath: '/myFolder/',
  chainWebpack:
    config => {
      config.optimization.delete('splitChunks')
    }
}
