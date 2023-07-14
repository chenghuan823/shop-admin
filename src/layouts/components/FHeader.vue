<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import {showModal} from '~/composables/util'
import { ElMessage } from 'element-plus'
import {logout} from '~/api/manager'
import { removeToken } from '~/composables/auth'
import { useRouter } from 'vue-router'
import {useStore} from 'vuex'
import { useFullscreen } from '@vueuse/core'

const { isFullscreen,toggle } = useFullscreen()
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

const handleRefresh=()=>{
    location.reload()
}

</script>

<template>
    <div class="f-header">
        <span class="logo">
            <el-icon class="mr-1"><eleme-filled/></el-icon>
            盒马鲜生
        </span>
        <el-icon class="icon-btn"><fold/></el-icon>
        <el-tooltip effect="dark" content="刷新" placement="bottom">
            <el-icon  @click="handleRefresh" class="icon-btn"><Refresh/></el-icon>
        </el-tooltip>
        <div class="ml-auto flex items-center">
            <el-tooltip effect="dark" content="全屏" placement="bottom">
                <el-icon class="icon-btn" @click="toggle"><full-screen v-if="!isFullscreen"/><aim v-else/></el-icon>
            </el-tooltip>
            <el-dropdown class="dropdown">
                <span class="flex items-center justify-center text-light-50 ">
                    <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" />
                    {{ $store.state.user.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>修改密码</el-dropdown-item>
                    <el-dropdown-item  @click="open">退出登录</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<style scoped>
.f-header{
    @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 right-0 left-0;
    height:64px;

}
.logo{
    width: 250px;
    @apply flex justify-center items-center text-xl font-thin;
}
.icon-btn{
    @apply flex items-center justify-center;
    width: 42px;
    height: 64px;
    cursor:pointer;
}
.icon-btn:hover{
    @apply bg-indigo-600;
}
.f-header .dropdown{
    height: 64px;
    cursor:pointer;

    @apply flex items-center justify-center mx-5;
}
</style>