import service from '~/axios'

//首页统计1
export function getStatistics1(username,password){
    return service.get("/admin/statistics1")
}
