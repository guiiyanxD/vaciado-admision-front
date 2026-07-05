const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Admisión — Censo Hospitalario';
      return args;
    });
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://admision-vaciado-backend.test:1809',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})
