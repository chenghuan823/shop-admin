<script setup>
import {ref,onBeforeUnmount} from 'vue'
import ImageAside from '~/components/ImageAside.vue'
import ImageMain from '~/components/ImageMain.vue'

const ImageAsideRef=ref(null)
const ImageMainRef=ref(null)

const handleOpenCreate=()=>{
    ImageAsideRef.value.handleCreate()
}

const handleAsideChange=(ClassId)=>{
ImageMainRef.value.loadData(ClassId)
}

//点击上传图片
const handleOpenUpload=()=>{
    ImageMainRef.value.openUploadFile()
}

const dialogVisiable=ref(false)

const open=()=>{
    dialogVisiable.value=true
}
const close=()=>{
    dialogVisiable.value=false
}

const props=defineProps({
    modelValue:[String,Array]
})

const emit=defineEmits(["update:modelValue"])

let urls=[]
const handleChoose=(e)=>{
    urls=e.map(o=>o.url)
}

const submit=()=>{
    if(urls.length){
        emit("update:modelValue",urls[0])
        urls[0]
    }
    close()
}

const removeImage=(url)=>{
    emit("update:modelValue",props.modelValue.filter(u=>u!=url))
}
</script>

<template>
    <div v-if="modelValue"> 
        <el-image v-if="(typeof modelValue==='string')" :src="modelValue" fit="cover" class="w-[100px] h-[100px] rounded border mr-2"></el-image>
        <div v-else class="flex flex-wrap">
            <div class="relative mx-1 mb-2 w-[100px] h-[100px]" v-for="(url,index) in modelValue" :key="index" >
                <el-icon @click="removeImage(url)" style=" z-index:10" class="absolute bg-white rounded-full right-[5px] top-[5px] cursor-pointer "><CircleClose /></el-icon>
                <el-image :src="url" fit="cover" class="w-[100px] h-[100px] rounded border mr-2"></el-image>
            </div>
        </div>
        
    </div>
    <div class="choose-image-btn" @click="open">
        <el-icon class="text-gray-500" :size="25"><Plus/></el-icon>
    </div>
    <el-dialog title="选择图片" v-model="dialogVisiable" width="80%" top="5vh">
        <el-container class="bg-white rounded" style="height:70vh;">
            <el-header class="image-header">
                <el-button type="primary" size="small" @click="handleOpenCreate">新增图片分类</el-button>
                <el-button type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>
            </el-header>
            <el-container>
                <ImageAside ref="ImageAsideRef" @change="handleAsideChange"/>
                <ImageMain :openChoose="true" @choose="handleChoose" ref="ImageMainRef"/>
            </el-container>
        </el-container>
        <template #footer>
        <span>
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
        </span>
        </template>
    </el-dialog>
    
</template>

<style scoped>
.choose-image-btn{
    @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100) ;
}
.image-header{
    @apply flex items-center  ;
    border-bottom: 1px solid #eee;
}

</style>