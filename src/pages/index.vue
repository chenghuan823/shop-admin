<template>
    <div>
        后台首页{{ $store.state.user.username }}
        <el-button @click="open">退出登录</el-button>
    </div>
</template>

<script setup>
import {showModal} from '~/composables/util'
import { ElMessage } from 'element-plus'
import {logout} from '~/api/manager'
import { removeToken } from '~/composables/auth'
import { useRouter } from 'vue-router'
import {useStore} from 'vuex'
const store=useStore()

const router =useRouter()

const handleLogout= async()=>{
    const res=await logout()
    if(res){
        //移除token
        removeToken()
        //清除vuex
        store.dispatch('logout')
        //登录页面
        router.push('/login')
    }
}

const open=()=>{
    showModal("是否退出登录").then(() => {
        ElMessage({
        type: 'success',
        message: '退出登录',
        })
        handleLogout()
    }).catch(()=>{})
    
}

</script>