import { createStore } from 'vuex'
import { getInfo,login } from '~/api/manager'
import { setToken } from '~/composables/auth'

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      user:{}//用户信息
    }
  },
  mutations: {
    SET_USERUNFO(state,user){
        state.user=user
    }
  },
  actions:{
    async getInfo({commit}){
      const res=await getInfo()
      commit("SET_USERUNFO",res)
    },
    //登录
    async login({commit},{username,password}){
      const res=await login(username,password)
      if(res){
        setToken(res.token)
      }

    }
  }
})

export default store