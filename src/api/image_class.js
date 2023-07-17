import service from '~/axios'

//图库列表
export function getImageList(page){
    return service.get("/admin/image_class/"+page)
}