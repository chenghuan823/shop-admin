import { createStore } from 'vuex'
import { getInfo,login } from '~/api/manager'
import { setToken } from '~/composables/auth'

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      user:{},//用户信息，
      asideWidth:"250px",//侧边宽度

    }
  },
  mutations: {
    SET_USERUNFO(state,user){
        state.user=user
    },
    //展开或收起侧边栏
    handleAsideWidth(state){
      state.asideWidth=(state.asideWidth==="250px" ? "64px" : "250px")
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
    },
    //退出登录
    logout({commit}){
      commit("SET_USERUNFO",{})
    }
  }
})

export default store