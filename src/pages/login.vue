<template>
    <el-row class="login-container">
        <el-col :lg="16" :md="12" class="left">
            <div>
                <div class="font-bold text-light-50 text-5xl mb-4">欢迎光临</div>
                <div class="text-gray-200 text-sm">此站点是《vue3 + vite实战商城后台开发》视频课程的演示地址</div>
            </div>
        </el-col>
        <el-col :lg="8" :md="12" class="right">
            <h2 class="font-bold text-3xl text-gray-800 ">欢迎回来</h2>
            <div class="flex items-center justify-center my-5 text-gray-300 space-x-2">
                <span class="h-[1px] w-16 bg-gray-200"></span>
                <span >账户密码登录</span>
                <span class="h-[1px] w-16 bg-gray-200"></span>
            </div>
            <el-form ref="formRef" :model="form" class="w-[250px]" :rules="rules">
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" v-model="form.username" placeholder="请输入用户名"/>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input show-password type="password" :prefix-icon="Lock" v-model="form.password" placeholder="请输入密码"/>
                </el-form-item>
                <el-form-item>
                    <el-button round color="#626aef" class="w-[250px]" type="primary" @click="onSubmit">登录</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script setup>
import { reactive,ref } from 'vue'
import { User,Lock } from '@element-plus/icons-vue'
const form = reactive({
  username: '',
  password: '',
})

const formRef=ref(null)

const onSubmit = () => {
    formRef.value.validate((valid)=>{
        if(!valid){
            return
        }else{
            console.log('验证通过');
        }
    })
}

const rules={
    username:[
        { 
            required: true,
            message: '用户名不能为空',
            trigger: 'blur' 
        },
        { 
            min: 3, 
            max: 5, 
            message: '长度3-5个字符', 
            trigger: 'blur' 
        },
    ],
    password:[
        {
            required: true,
            trigger: 'blur',
            message: '密码不能为空',
        }
    ]
}

</script>

<style scoped>
.login-container{
    @apply bg-indigo-500 min-h-screen;
}
.left{
    @apply flex items-center justify-center;
}
.right{
    @apply bg-light-50 flex flex-col items-center justify-center;
}
</style>