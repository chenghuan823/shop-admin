import service from '~/axios'

//商品规格列表
export function getSkusList(page){
    return service.get(`/admin/skus/${page}`)
}

//增加商品规格
export function addSkus(data){
    return service.post(`/admin/skus`,data)
}

//修改商品规格
export function updateSkus(id,data){
    return service.post(`/admin/skus/${id}`,data)
}

//删除商品规格
export function deleteSkus(ids){
    ids=!Array.isArray(ids)?[ids]:ids
    return service.post(`/admin/skus/delete_all`,{ids})
}

//更新商品规格状态
export function updateSkusStatus(id,status){
    return service.post(`/admin/skus/${id}/update_status`,{
        status
    })
}
