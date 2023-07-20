import service from '~/axios'

//菜单权限
export function getRuleList(page){
    return service.get(`/admin/rule/${page}`)
}