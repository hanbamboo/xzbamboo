import axios from "axios";
import errorCode from "./store/errorCode";
// import VueAxios from "vue-axios";
import {getToken} from "./jwt.service";
import store from './store'
import router from '../../router'
import { ElMessage } from 'element-plus';


/**
 * Service to call HTTP request via Axios
 */


axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: "http://123.249.89.1:8090",
    // 超时
    timeout: 5000
})

// request拦截器
service.interceptors.request.use(config => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    if (getToken() && !isToken) {
        config.headers['Authorization'] = 'xzbamboo ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
        let url = config.url + '?';
        for (const propName of Object.keys(config.params)) {
            const value = config.params[propName];
            var part = encodeURIComponent(propName) + "=";
            if (value !== null && typeof (value) !== "undefined") {
                if (typeof value === 'object') {
                    for (const key of Object.keys(value)) {
                        let params = propName + '[' + key + '] ';
                        var subPart = encodeURIComponent(params) + "=";
                        url += subPart + encodeURIComponent(value[key]) + "&";
                    }
                } else {
                    url += part + encodeURIComponent(value) + "&";
                }
            }
        }
        url = url.slice(0, -1);
        config.params = {};
        config.url = url;
    }
    return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
        // 未设置状态码则默认成功状态
        const code = res.data.code || 200;
        // 获取错误信息
        const msg = errorCode[code] || res.data.msg || errorCode['default']
        if (code === 401) {
            // 跳转登录
        } else if (code === 500) {

                ElMessage({
                    message: msg,
                    type: 'error',
                    duration: 3 * 1000,
                    showClose: true,
                });

            return Promise.reject(new Error(msg))
        } else if (code !== 200) {
            Notification.error({
                title: msg
            })
            return Promise.reject('error')
        } else {
            return res.data
        }
    },
    error => {
        console.log('err' + error)
        let {message} = error;
        if (message === "Network Error") {
            message = "后端接口连接异常";
        } else if (message.includes("timeout")) {
            message = "系统接口请求超时";
        } else if (message.includes("Request failed with status code")) {
            message = "系统接口" + message.substr(message.length - 3) + "异常";
        }
        ElMessage({
            message: message,
            type: 'error',
            duration: 3 * 1000,
            showClose: true,
        });
        return Promise.reject(error)
    }
)

export default service


