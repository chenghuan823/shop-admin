import service from '~/axios'

//角色列表
export function getRoleList(page){
    return service.get(`/admin/role/${page}`)
}

//增加角色
export function addRole(data){
    return service.post(`/admin/role`,data)
}

//修改角色
export function updateRole(id,data){
    return service.post(`/admin/role/${id}`,data)
}

//删除角色
export function deleteRole(id){
    return service.post(`/admin/role/${id}/delete`)
}

//更新角色状态
export function updateRoleStatus(id,status){
    return service.post(`/admin/role/${id}/update_status`,{
        status
    })
}

//配置角色权限
export function setRole(id,rule_ids){
    return service.post(`/admin/role/set_rules`,{
        id,rule_ids
    })
}