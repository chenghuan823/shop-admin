import service from '~/axios'

//首页统计1
export function getStatistics1(username,password){
    return service.get("/admin/statistics1")
}

//首页统计2
export function getStatistics2(){
    return service.get('/admin/statistics2')
}

//首页统计3
export function getStatistics3(type){
    return service.get("/admin/statistics3?type="+type)
}
