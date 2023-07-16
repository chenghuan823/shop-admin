import {router,addRoutes} from '~/router'
import {getToken} from "~/composables/auth"
import {toast,showFullLoading,hideFullLoading} from '~/composables/util'
import store from './store'

let hasGetInfo=false
router.beforeEach(async(to, from,next) => {
    //显示loading
    showFullLoading()
    const token=getToken()

    if(!token && to.path !="/login"){
        toast("请先登录",'error')
        return next({path:"/login"})
    }

    //重复登录
    if(token && to.path==="/login"){
        toast("请勿重复登录",'error')
        return next({path:(from.path ?from.path : "/")})
    }

    //用户登录，调接口获取user信息，存到vuex
    let hasNewRoutes=false
    if(token && !hasGetInfo){
        const res=await store.dispatch("getInfo")
        hasGetInfo=true
        hasNewRoutes=addRoutes(res.menus)
    }

    //设置页面标题
    let title=(to.meta.title ? to.meta.title : '') + '^v^shop管理后台'
    document.title=title

    hasNewRoutes ? next(to.fullPath) : next()
  })

  //路由后置守卫
  router.afterEach((to, from) => {
    hideFullLoading()
  })