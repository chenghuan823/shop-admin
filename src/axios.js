import axios from 'axios'
import { getToken } from '~/composables/auth'
import { toast } from '~/composables/util'


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
    toast(error.response.data.msg || "请求失败",'error')
    return Promise.reject(error);
  }
);

export default service