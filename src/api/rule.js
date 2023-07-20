import service from '~/axios'

//菜单权限列表
export function getRuleList(page){
    return service.get(`/admin/rule/${page}`)
}

//增加菜单权限
export function addRule(data){
    return service.post(`/admin/rule`,data)
}

//修改菜单权限
export function updateRule(id,data){
    return service.post(`/admin/rule/${id}`,data)
}

//删除菜单权限
export function deleteRule(id){
    return service.post(`/admin/rule/${id}/delete`)
}

//修改菜单权限状态
export function updateRuleStatus(id,status){
    return service.post(`/admin/rule/${id}/update_status`,{
        status
    })
}