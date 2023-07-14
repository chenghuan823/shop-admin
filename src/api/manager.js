import service from '~/axios'

export function login(username,password){
    return service.post("/admin/login",{
        username,
        password
    })
}