import service from '~/axios'
import {queryParams} from '~/composables/util'

//商品列表
export function getGoodsList(page,query={}){
    let r=queryParams(query)
    return service.get(`/admin/goods/${page}${r}`)
}
//修改商品上架/下架状态
export function updateGoodsStatus(ids,status){
    return service.post(`/admin/goods/changestatus`,{
        ids,status
    })
}

//增加商品
export function createGoods(data){
    return service.post(`/admin/goods`,data)
}

//修改商品
export function updateGoods(id,data){
    return service.post(`/admin/goods/${id}`,data)
}

//删除商品
export function deleteGoods(ids){
    return service.post(`/admin/goods/delete_all`,{
        ids
    })
} 

//查看商品资料
export function readGoods(id){
    return service.get(`/admin/goods/read/${id}`)
}

//设置商品轮播图
export function setGoodsBanner(id,data){
    return service.post(`/admin/goods/banners/${id}`,data)
}