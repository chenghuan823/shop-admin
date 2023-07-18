<script setup>
import {ref,reactive,computed} from 'vue'
import AsideList from '~/components/AsideList.vue'
import {getImageList,createImageClass,updateImageClass,deleteImageClass} from '~/api/image_class'
import FormDrawer from '~/components/FormDrawer.vue'
import {toast} from '~/composables/util'

const emit=defineEmits(['change'])

const imageList=ref([])

const loading=ref(false)
const activeId=ref(0)

const handleChangeActiveId=(id)=>{
    activeId.value=id
    emit('change',id)
}

const state=reactive({
    page:1,
    total:0,
    limit:10,
})

const form=reactive({
    name:'',
    order:50,
})

const editId=ref(0)

const GetImageList=async(page=1)=>{
    state.page=page
    loading.value=true
    const res=await getImageList(page)
    if(res){
        state.total=res.totalCount
        imageList.value=res.list
        let item=imageList.value[0]
        if(item){
            activeId.value=item.id
            handleChangeActiveId(item.id)
        }
    }
    loading.value=false
}
GetImageList(state.page)

// ******新增图片分类
const drawerTitle=computed(()=>{
    return editId.value ? '修改' : '新增'
})

const formDrawerRef=ref(null)

const handleCreate=()=>{
    editId.value=0
    form.name=''
    form.order=50
    formDrawerRef.value.open()
}
defineExpose({
    handleCreate
})

const handleEdit=(item)=>{
editId.value=item.id
form.name=item.name
form.order=item.order
formDrawerRef.value.open()
}

const handleDelete=(item)=>{
    DeleteImageClass(item.id)
}
// 新增图库api
const CreateImageClass=async(data)=>{
    const res=await createImageClass(data)
    if(res){
        toast(drawerTitle.value+'成功')
        GetImageList()
        formDrawerRef.value.close()
    }
}
// 修改图库api
const UpdateImageClass=async(id,data)=>{
    const res=await updateImageClass(id,data)
    if(res){
        toast(drawerTitle.value+'成功')
        GetImageList(state.page)
        formDrawerRef.value.close()
    }
}
// 删除图库api
const DeleteImageClass=async(id)=>{
    loading.value=true
    const res=await deleteImageClass(id).finally(()=>{
        loading.value=false
    })
    if(res.data){
        GetImageList(state.page)
        formDrawerRef.value.close()
        toast('删除成功')
    }
}

// 提交表单
const formRef=ref(null)

const handleSubmit=()=>{
    formRef.value.validate((valid)=>{
        if(!valid){
            return
        }
        formDrawerRef.value.showLoading()
        if(editId.value==0){
            CreateImageClass(form)
        }else{
            UpdateImageClass(editId.value,form)
        }
        formDrawerRef.value.hideLoading()

    })
}

const rules={
    name:[
        {
            required:true,
            message:'相册名称不能为空',
            trigger:'blur'
        }
    ]
}

</script>

<template>
    <el-aside  width="220px" class="image-aside" v-loading="loading">
        <div class="top">
            <AsideList v-for="item in imageList" :key="item.id" :active="activeId===item.id" @delete="handleDelete(item)" @edit="handleEdit(item)" @click="handleChangeActiveId(item.id)">{{ item.name }}</AsideList>
        </div>
        <div class="bottom">
            <el-pagination background layout="prev,next" :total="state.total" :current-page="state.page" :page-size="state.limit" @current-change="GetImageList"/>
        </div>
    </el-aside>

    <FormDrawer :title="drawerTitle" ref="formDrawerRef" @submit="handleSubmit">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
            <el-form-item label="相册名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input-number v-model="form.order" :min="0" :max="1000"></el-input-number>
            </el-form-item>
        </el-form>
    </FormDrawer>
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
