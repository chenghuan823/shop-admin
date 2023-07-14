<script setup>
import {ref,reactive, toDisplayString} from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import {showModal} from '~/composables/util'
import { ElMessage } from 'element-plus'
import {logout,updatepassword} from '~/api/manager'
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

//修改密码
const drawer = ref(false)

const handleCommand = (command) => {
  switch (command) {
    case 'a':
        drawer.value=true;
        break;
    case 'b':
        open();
        break;
  }
}

const form = reactive({
    oldpassword:'',
    repassword: '',
    password: '',
})
const loading=ref(false)

const onSubmit = async() => {
    formRef.value.validate(async(valid)=>{
        if(!valid){
            return
        }
        loading.value=true
        // await store.dispatch("login",form)
        // toast('登录成功')
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
            loading.value=false               
        }

        // router.push('/')
    })
}

const formRef=ref(null)

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
    <el-drawer :close-on-click-modal="false" size="45%" v-model="drawer" title="修改密码" >
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
            <el-form-item>
                <el-button  type="primary" @click="onSubmit" :loading="loading">提交</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
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