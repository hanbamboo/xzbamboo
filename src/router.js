import {createRouter, createWebHistory} from "vue-router";

import Home from '@/pages/index.vue'


const routes = [
    {
        path: '/',
        name: '首页',
        component: Home,
        meta:{title:'首页', isLeaf: false}
    }
]

export default createRouter({
    history: createWebHistory(),
    routes
});


