<script setup>
import {ref,reactive} from 'vue'
import {getImagesList,updateImageList,deleteImageList} from '~/api/image'
import {showPrompt,toast} from '~/composables/util'
import UploadFile from '~/components/UploadFile.vue'

//上传图片
const drawer=ref(false)
const openUploadFile=()=>{
    drawer.value=true
}

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

//图片上传成功
const handleUploadSuccess=()=>{
    GetImagesList()
}

defineExpose({
    loadData,
    openUploadFile
})
//点击重命名
const handleEdit=(item)=>{
    const {name,id}=item
    showPrompt('重命名',name)
    .then(({value})=>{
        console.log(value);
        loading.value=true
        updateImageList(id,value)
        .then(
            res=>{
                toast('修改成功')
                GetImagesList()
            }
        )
        .finally(()=>{
            loading.value=false
        })
    })
}
//点击删除
const handleDelete=(id)=>{
    loading.value=true
    deleteImageList([id])
    .then(res=>{
        toast('删除成功')
        GetImagesList()
    })
    .finally(()=>{
        loading.value=false
    })
}
</script>

<template>
    <el-main class="image-main" v-loading="loading">
        <div class="top p-3">
            <el-row :gutter="10">
                <el-col v-for="(item,index) in imageList" :key="index" :span="6" :offset="0">
                    <el-card shadow="hover"  class="relative mb-3" :body-style="{padding:0}">
                        <el-image :preview-src-list="[item.url]" :initial-index="0" :src="item.url" fit="cover" class="w-full h-[150px]"></el-image>
                        <div class="image-title">{{ item.name }}</div>
                        <div class="flex justify-center px-2">
                            <el-button type="primary" size="small" @click="handleEdit(item)" text>重命名</el-button>
                            <el-popconfirm title="是否要删除此图片?" confirm-button-text="确认" cancel-button-text="取消" @confirm="handleDelete(item.id)" >
                                <template #reference>
                                    <el-button type="primary" size="small" text>删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div class="bottom">
            <el-pagination background layout="prev,pager,next" :total="state.total" :current-page="state.page" :page-size="state.limit" @current-change="GetImagesList"/>
        </div>
    </el-main>

    <el-drawer :close-on-click-modal="false" v-model="drawer" title="上传图片">
        <UploadFile :data="{image_class_id}" @success="handleUploadSuccess"/>
    </el-drawer>

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
