<script setup>
import {ref} from 'vue'

const props=defineProps({
    title:{
        type:String,
        default:"title"
    },
    size:{
        type:String,
        default:"45%"
    },
    destoryOnClose:{
        type:Boolean,
        default:false
    },
    confirmText:{
        type:String,
        default:"提交"
    }
})

const loading=ref(false)
const showDrawer = ref(false)

const emit=defineEmits(["submit"])
const submit=()=>emit("submit")

const open=()=>showDrawer.value=true
const close=()=>showDrawer.value=false

const showLoading=()=>loading.value=true
const hideLoading=()=>loading.value=false

defineExpose({
    open,
    close,
    showLoading,
    hideLoading
})
</script>

<template>
    <el-drawer :close-on-click-modal="false" :size="size" v-model="showDrawer" :title="title" :destory-on-close="destoryOnClose">
        <div class="formDrawer">
            <div class="body">
                <slot></slot>
            </div>
            <div class="actions">
                <el-button  type="primary" @click="submit" :loading="loading">{{ confirmText }}</el-button>
                <el-button  type="default" @click="close">取消</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<style scoped>
.formDrawer{
width: 100%;
height: 100%;
@apply flex flex-col;
position: relative;
}
.body{
    flex: 1;
    overflow-y: auto;
}
.formDrawer .actions{
    height: 35px;
    @apply mt-auto flex items-center;
}
</style>