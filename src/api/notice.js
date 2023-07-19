import service from '~/axios'

//公告列表
export function getNoticeList(page){
    return service.get(`/admin/notice/${page}`)
}

//增加公告
export function addNotice(data){
    return service.post(`/admin/notice`,data)
}

//修改公告
export function updateNotice(id,data){
    return service.post(`/admin/notice/${id}`,data)
}

//删除公告
export function deleteNotice(id,data){
    return service.post(`/admin/notice/${id}/delete`)
}