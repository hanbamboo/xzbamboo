import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router";

import ElementPlus from 'element-plus'
import zhCN from "element-plus/dist/locale/zh-cn.mjs" //引入中文
import 'element-plus/dist/index.css'
import '@/assets/css/element-variables.scss'

const app = createApp(App)

app.use(ElementPlus, {locale: zhCN}).use(router)

app.mount('#app')
