<script setup>
import {ref,onMounted,onBeforeUnmount,computed} from 'vue'
import ImageAside from '~/components/ImageAside.vue'
import ImageMain from '~/components/ImageMain.vue'
let windowHeight= ref(window.innerHeight || document.body.clientHeight)

const getHeight=()=>{
    windowHeight.value= window.innerHeight || document.body.clientHeight
}

let h=computed(()=>{
    return windowHeight.value - 64 - 44 - 40
})

const ImageAsideRef=ref(null)
const ImageMainRef=ref(null)

const handleOpenCreate=()=>{
    ImageAsideRef.value.handleCreate()
}

const handleAsideChange=(ClassId)=>{
ImageMainRef.value.loadData(ClassId)
}

window.addEventListener("resize",getHeight)

onBeforeUnmount(() => {
    window.removeEventListener("resize",getHeight)
})

</script>
<template>
    <el-container class="bg-white rounded" :style="{height:h+'px'}">
        <el-header class="image-header">
            <el-button type="primary" size="small" @click="handleOpenCreate">新增图片分类</el-button>
            
        </el-header>
        <el-container>
            <ImageAside ref="ImageAsideRef" @change="handleAsideChange"/>
            <ImageMain ref="ImageMainRef"/>
        </el-container>
    </el-container>
</template>

<style scoped>
.image-header{
    @apply flex items-center  ;
    border-bottom: 1px solid #eee;
}


</style>