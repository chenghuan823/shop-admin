<script setup>
import {ref,reactive} from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import {showModal} from '~/composables/util'
import { ElMessage } from 'element-plus'
import {logout,updatepassword} from '~/api/manager'
import { removeToken } from '~/composables/auth'
import { useRouter } from 'vue-router'
import {useStore} from 'vuex'
import { useFullscreen } from '@vueuse/core'
import FormDrawer from '~/components/FormDrawer.vue'

const store=useStore()
const router =useRouter()

const form = reactive({
    oldpassword:'',
    repassword: '',
    password: '',
})
const formDrawerRef=ref(null)
const formRef=ref(null)

const { isFullscreen,toggle } = useFullscreen()

const handleRefresh=()=>{
    location.reload()
}

const handleLogout= async()=>{
    const res=await logout()
    if(res){
        removeToken()
        store.dispatch('logout')
        router.push('/login')
    }
}

const openLogoutModal=()=>{
    showModal("是否退出登录").then(() => {
        ElMessage({
        type: 'success',
        message: '退出登录',
        })
        handleLogout()
    }).catch(()=>{})
}

const handleCommand = (command) => {
  switch (command) {
    case 'a':
        formDrawerRef.value.open()
        break;
    case 'b':
        openLogoutModal();
        break;
  }
}

const onSubmit = async() => {
    formRef.value.validate(async(valid)=>{
        if(!valid){
            return
        }
        formDrawerRef.value.showLoading()
        try {
            const res= await updatepassword(form)
            if(res){
                toast('修改成功')
                //移除token
                removeToken()
                //清除vuex
                store.dispatch('logout')
                //登录页面
                router.push('/login')
            }
        } catch (error) {
        }
        formDrawerRef.value.hideLoading()            
    })
}

const rules={
    oldpassword:[
        { 
            required: true,
            message: '旧密码不能为空',
            trigger: 'blur' 
        }
    ],
    password:[
        {
            required: true,
            trigger: 'blur',
            message: '新密码不能为空',
        }
    ],
    repassword:[
        {
            required: true,
            trigger: 'blur',
            message: '确认密码不能为空',
        }
    ]
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
            <el-dropdown class="dropdown"  @command="handleCommand">
                <span class="flex items-center justify-center text-light-50 ">
                    <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" />
                    {{ $store.state.user.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="a">修改密码</el-dropdown-item>
                    <el-dropdown-item command="b">退出登录</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
    <FormDrawer ref="formDrawerRef" @submit="onSubmit" title="修改密码" destoryOnClose confirmText="提交">
        <el-form ref="formRef" :model="form" :rules="rules">
            <el-form-item prop="oldpassword" label="旧密码" label-width="80px" size="small">
                <el-input v-model="form.oldpassword" placeholder="请输入旧密码"/>
            </el-form-item>
            <el-form-item prop="password" label="新密码" label-width="80px" size="small">
                <el-input show-password type="password"  v-model="form.password" placeholder="请输入新密码"/>
            </el-form-item>
            <el-form-item prop="repassword" label="确认密码" label-width="80px" size="small">
                <el-input show-password type="password"  v-model="form.repassword" placeholder="请确认密码"/>
            </el-form-item>
        </el-form>
    </FormDrawer>
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