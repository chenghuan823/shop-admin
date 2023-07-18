<script setup>
import {ref,reactive,computed} from 'vue'
import {getImagesList} from '~/api/image'

const imageList=ref([])
const loading=ref(false)
const image_class_id=ref(0)
const state=reactive({
    page:1,
    total:0,
    limit:10,
})

const GetImagesList=async(page=1)=>{
    state.page=page
    loading.value=true
    const res=await getImagesList(image_class_id.value,page)
    if(res){
        state.total=res.totalCount
        imageList.value=res.list    
    }
    loading.value=false
}

//根据分类ID重新加载图片列表
const loadData=(id)=>{
    state.page=1
    image_class_id.value=id
    GetImagesList()
}

defineExpose({
    loadData
})
</script>

<template>
    <el-main class="image-main" v-loading="loading">
        <div class="top p-3">
            <el-row :gutter="10">
                <el-col v-for="(item,index) in imageList" :key="index" :span="6" :offset="0">
                    <el-card shadow="hover"  class="relative mb-3" :body-style="{padding:0}">
                        <el-image :src="item.url" fit="cover" class="w-full h-[150px]"></el-image>
                        <div class="image-title">{{ item.name }}</div>
                        <div class="flex justify-center px-2">
                            <el-button type="primary" size="small" @click="" text>重命名</el-button>
                            <el-button type="primary" size="small" @click="" text>删除</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div class="bottom">
            <el-pagination background layout="prev,pager,next" :total="state.total" :current-page="state.page" :page-size="state.limit" @current-change="GetImagesList"/>
        </div>
    </el-main>
</template>

<style scoped>
.image-main .top{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 50px;
    left: 0;
    overflow-y: auto;
}
.image-main .bottom{
    @apply flex items-center justify-center ;
    position: absolute;
    bottom: 0;
    height: 50px;
    left: 0;
    right: 0;
}
.image-main{
    position: relative;
}
.image-title{
    position: absolute;
    @apply text-sm truncate  text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;
    top: 122px;
    left: -1px;
    right: -1px;
}
</style>
