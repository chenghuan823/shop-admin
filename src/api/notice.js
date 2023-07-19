import service from '~/axios'

export function getNoticeList(page){
    return service.get(`/admin/notice/${page}`)
}