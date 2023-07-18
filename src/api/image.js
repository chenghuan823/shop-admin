import service from '~/axios'

export function getImagesList(id,page=1){
    return service.get(`/admin/image_class/${id}/image/${page}`)
}