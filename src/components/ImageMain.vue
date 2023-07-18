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
// GetImagesList(state.page)

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
        <div class="top">
            <div v-for="(item,index) in imageList" :key="index">{{ item.url }}</div>
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
</style>
