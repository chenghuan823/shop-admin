<script setup>
import {ref,reactive} from 'vue'
import AsideList from '~/components/AsideList.vue'
import {getImageList} from '~/api/image_class'

const imageList=ref([])
const loading=ref(false)
const activeId=ref(0)

const state=reactive({
    page:1,
    total:0,
    limit:10,
})

const GetImageList=async(page)=>{
    loading.value=true
    const res=await getImageList(page)
    if(res){
        imageList.value=res.list
        let item=imageList.value[0]
        if(item){
            activeId.value=item.id
        }
    }
    loading.value=false
}
GetImageList(state.page)

</script>

<template>
    <el-aside  width="220px" class="image-aside" v-loading="loading">
        <div class="top">
            <AsideList v-for="item in imageList" :key="item.id" :active="activeId===item.id">{{ item.name }}</AsideList>
        </div>
        <div class="bottom">
            <el-pagination background layout="prev,next" :total="1000" />
        </div>
    </el-aside>
</template>

<style scoped>

.image-aside{
    border-right: 1px solid #eee;
    position: relative;
}
.image-aside .top{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 50px;
    left: 0;
    overflow-y: auto;
}
.image-aside .bottom{
@apply flex items-center justify-center ;
position: absolute;
bottom: 0;
height: 50px;
left: 0;
right: 0;
}
</style>
