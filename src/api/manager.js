import service from '~/axios'
import {queryParams} from '~/composables/util'

//登录
export function login(username,password){
    return service.post("/admin/login",{
        username,
        password
    })
}

//获取管理员信息和权限菜单
export function getInfo(){
    return service.post("/admin/getinfo")
}

//退出登录
export function logout(){
    return service.post("/admin/logout")
}

//修改登录
export function updatepassword(data){
    return service.post("/admin/updatepassword",data)
}

//管理员列表
export function getManagerList(page,query={}){
    let r=queryParams(query)
    return service.get(`/admin/manager/${page}${r}`)
}

//修改管理员状态
export function updateManageStatus(id,status){
    return service.post(`/admin/manager/${id}/update_status`,{
        status
    })
}

//增加管理员
export function createManager(data){
    return service.post(`/admin/manager`,data)
}

//修改管理员
export function updateManager(id,data){
    return service.post(`/admin/manager/${id}`,data)
}

//删除管理员
export function deleteManager(id){
    return service.post(`/admin/manager/${id}/delete`)
} 