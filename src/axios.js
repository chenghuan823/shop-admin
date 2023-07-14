import axios from 'axios'
import { getToken } from '~/composables/auth'
import { toast } from '~/composables/util'
import store from './store'

const service = axios.create({
    baseURL: '/api',
  });

// 拦截器
service.interceptors.request.use(
  function (config) {
    const token=getToken()
    if(token){
      config.headers["token"]=token
    }
    return config;
  }, 
  function (error) {
    return Promise.reject(error);
  }
);
service.interceptors.response.use(
  function (response) {
    return response.data.data;
  }, 
  function (error) {
    const msg=error.response.data.msg || "请求失败"
    if(msg==="非法token，请先登录！"){
      store.dispatch("logout").finally(()=>{
        location.reload()
      })
    }
    toast(msg,'error')
    return Promise.reject(error);
  }
);

export default service