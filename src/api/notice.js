import service from '~/axios'

//公告列表
export function getNoticeList(page){
    return service.get(`/admin/notice/${page}`)
}

//增加公告
export function addNotice(data){
    return service.post(`/admin/notice`,data)
}