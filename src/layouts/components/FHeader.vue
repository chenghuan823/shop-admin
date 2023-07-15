<script setup>
import { useFullscreen } from '@vueuse/core'
import FormDrawer from '~/components/FormDrawer.vue'
import { useRepassword } from '~/composables/useManager'
import { useLogout } from '~/composables/useManager'

const {
    form,
    formDrawerRef,
    formRef,
    onSubmit,
    rules,
    openRepasswordForm
}=useRepassword()

const {openLogoutModal}=useLogout()

const { isFullscreen,toggle } = useFullscreen()

const handleRefresh=()=>location.reload()

//触发头部下拉框内的事件
const handleCommand = (command) => {
  switch (command) {
    case 'a':
        openRepasswordForm()
        break;
    case 'b':
        openLogoutModal();
        break;
  }
}
</script>

<template>
    <div class="f-header">
        <span class="logo">
            <el-icon class="mr-1"><eleme-filled/></el-icon>
            盒马鲜生
        </span>
        <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')"><fold v-if="$store.state.asideWidth==='250px'" /><Expand v-else/></el-icon>
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
    <FormDrawer ref="formDrawerRef" title="修改密码" destoryOnClose confirmText="提交" @submit="onSubmit" >
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