import axios from 'axios'
import { ElNotification } from 'element-plus'
import { useCookies } from '@vueuse/integrations/useCookies'

const service = axios.create({
    baseURL: '/api',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
  });

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    const cookies=useCookies()
    const token=cookies.get('admin-token')
    if(token){
      config.headers["token"]=token
    }
    return config;
  }, 
  function (error) {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    return response.data.data;
  }, 
  function (error) {
    ElNotification({
      message: error.response.data.msg || '请求失败',
      type: 'error',
      duration:3000
    })
    return Promise.reject(error);
  }
);

export default service