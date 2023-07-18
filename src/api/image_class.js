import service from '~/axios'

//图库列表
export function getImageList(page){
    return service.get("/admin/image_class/"+page)
}

//新增图库分类
export function createImageClass(data){
    return service.post("/admin/image_class",data)
}