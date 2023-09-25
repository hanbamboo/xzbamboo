import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router";
import axios from 'axios'
import ElementPlus from 'element-plus'
import zhCN from "element-plus/dist/locale/zh-cn.mjs" //引入中文
import 'element-plus/dist/index.css'
import '@/assets/css/element-variables.scss'
import store from "@/core/services/store/store.js";
import gloablComponent from '@/components/components.js';
import 'virtual:svg-icons-register'

const app = createApp(App)

// 将axios挂载到全局
app.config.globalProperties.$axios = axios;
// 将消息提示方法挂载到全局
app.config.globalProperties.$msgSuccess = (msg) => {
    app.config.globalProperties.$message.success({
        message: msg,
        showClose: true,
        center: true,
        grouping: true
    });
};
app.config.globalProperties.$msgError = (msg) => {
    app.config.globalProperties.$message.error({
        message: msg,
        showClose: true,
        center: true,
        grouping: true
    });
};
app.config.globalProperties.$msgInfo = (msg) => {
    app.config.globalProperties.$message.info({
        message: msg,
        showClose: true,
        center: true,
        grouping: true
    });
};
app.use(ElementPlus, {locale: zhCN}).use(router).use(store).use(gloablComponent)

app.mount('#app')
