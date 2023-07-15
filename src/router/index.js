import {
    createRouter,
    createWebHashHistory
} from 'vue-router'

import Index from '~/pages/index.vue'
import NotFound from '~/pages/404.vue'
import Login from '~/pages/login.vue'
import Admin from '~/layouts/admin.vue'
import GoodList from '~/pages/goods/list.vue'
import CategoryList from '~/pages/category/list.vue'

//默认路由，所有用户共享
const routes=[
    {
        path:'/',
        name:'admin',
        component:Admin,
    },
    {
        path:'/:pathMatch(.*)*',
        component:NotFound,
        meta:{
            title:'404'
        }
    },
    {
        path:'/login',
        component:Login,
        meta:{
            title:'登录页'
        }
    }
]

//动态路由,用于匹配菜单动态添加路由
const asyncRoutes=[
    {
        path:"/",
        component:Index,
        name:'/',
        meta:{
            title:'后台首页'
        }
    },
    {
        path:"/goods/list",
        component:GoodList,
        name:'/goods/list',
        meta:{
            title:'商品管理'
        }
    },
    {
        path:"/category/list",
        component:CategoryList,
        name:'/category/list',
        meta:{
            title:'分类列表'
        }
    },
]


export const router=createRouter({
    history: createWebHashHistory(),
    routes, 
})

export function addRoutes(menus){
    //是否有新路由
    let hasNewRoutes=false
    const findAndAddRoutesByMenus=(arr)=>{
        arr.forEach(e=>{
            debugger
            let item=asyncRoutes.find(o=>o.path===e.frontpath)
            if(item && !router.hasRoute(item.path)){
                router.addRoute('admin',item)
                hasNewRoutes=true
            } 
            if(e.child && e.child.length>0){
                findAndAddRoutesByMenus(e.child)
            }
        })
    }
    findAndAddRoutesByMenus(menus)
    return hasNewRoutes
}