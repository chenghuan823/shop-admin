import service from '~/axios'

//公告列表
export function getRoleList(page){
    return service.get(`/admin/role/${page}`)
}

//增加公告
export function addRole(data){
    return service.post(`/admin/role`,data)
}

//修改公告
export function updateRole(id,data){
    return service.post(`/admin/role/${id}`,data)
}

//删除公告
export function deleteRole(id){
    return service.post(`/admin/role/${id}/delete`)
}

//更新角色状态
export function updateRoleStatus(id,status){
    return service.post(`/admin/role/${id}/update_status`,{
        status
    })
}