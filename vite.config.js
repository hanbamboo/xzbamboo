import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import {loadEnv} from 'vite'
import {createHtmlPlugin} from 'vite-plugin-html'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'


export default ({command, mode}) => {
    return defineConfig({
        plugins: [
            vue(),
            createSvgIconsPlugin({
                // Specify the icon folder to be cached
                iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
                // Specify symbolId format
                symbolId: 'icon-[dir]-[name]',
            }),
            createHtmlPlugin({
                inject: {
                    data: {
                        //获取标题变量
                        title: loadEnv(mode, process.cwd()).VITE_APP_TITLE
                    },
                },
            }),],
        server: {
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
            hmr: {
                overlay: false // 屏蔽服务器报错
            }
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src')
            }
        },

    })
}

