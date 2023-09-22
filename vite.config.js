import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { loadEnv } from 'vite'

export default ({ command, mode }) => {
  return defineConfig({
    plugins: [vue()],
    server:{
      host: '0.0.0.0',
      port: Number(loadEnv(mode, process.cwd()).VITE_APP_PORT),
      strictPort: true, // 端口被占用直接退出
      https: false,
      open: true,// 在开发服务器启动时自动在浏览器中打开应用程序
      proxy: {
        // 选项写法
        // [loadEnv(mode, process.cwd()).VITE_APP_BASE_API]: {
        //    target: 'http://192.168.2.120:8000',
        //    changeOrigin: true,
        //   pathRewrite: {
        //     ['^' + loadEnv(mode, process.cwd()).VITE_APP_BASE_API]: ''
        //   }
        //  }
        '/api': {
          target: 'http://192.168.2.115:8000',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      },
      hmr:{
        overlay: false // 屏蔽服务器报错
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    chainWebpack(config) {
      // set svg-sprite-loader
      config.module
          .rule('svg')
          .exclude.add(resolve('src/assets/icons'))
          .end()
      config.module
          .rule('icons')
          .test(/\.svg$/)
          .include.add(resolve('src/assets/icons'))
          .end()
          .use('svg-sprite-loader')
          .loader('svg-sprite-loader')
          .options({
            symbolId: 'icon-[name]'
          })
          .end()
      config
          .when(process.env.NODE_ENV !== 'development',
              config => {
                config.optimization.runtimeChunk('single'),
                    {
                      from: path.resolve(__dirname, './public/robots.txt'), //防爬虫文件
                      to: './' //到根目录下
                    }
              })
    },

  })
}

