import { createStore } from 'vuex'

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
  }
})

export default store