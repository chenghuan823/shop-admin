import service from '~/axios'

//指定分类下的图片列表
export function getImagesList(id,page=1){
    return service.get(`/admin/image_class/${id}/image/${page}`)
}

//删除图片
export function deleteImageList(ids){
    return service.post(`/admin/image/delete_all`,{ids})
}

//修改图片名称
export function updateImageList(id,name){
    return service.post(`/admin/image/${id}`,{name})
}

export const uploadImageAction="/api/admin/image/upload"