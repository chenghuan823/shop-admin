import service from '~/axios'

//菜单权限列表
export function getRuleList(page){
    return service.get(`/admin/rule/${page}`)
}

//增加权限
export function addRule(data){
    return service.post(`/admin/rule`,data)
}

//修改权限
export function updateRule(id,data){
    return service.post(`/admin/rule/${id}`,data)
}