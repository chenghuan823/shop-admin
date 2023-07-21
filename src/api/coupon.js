import service from '~/axios'

//优惠券列表
export function getCouponList(page){
    return service.get(`/admin/coupon/${page}`)
}

//增加优惠券
export function addCoupon(data){
    return service.post(`/admin/coupon`,data)
}

//修改优惠券
export function updateCoupon(id,data){
    return service.post(`/admin/coupon/${id}`,data)
}

//删除优惠券
export function deleteCoupon(id){
    return service.post(`/admin/coupon/${id}/delete`)
}

//失效优惠券
export function updateCouponStatus(id){
    return service.post(`/admin/coupon/${id}/update_status`,{status:0})
}