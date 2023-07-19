<script setup>
import {ref,reactive,computed} from 'vue'
import {getNoticeList,addNotice,updateNotice,deleteNotice} from '~/api/notice'
import {getManagerList,updateManageStatus} from '~/api/manager'
import FormDrawer from '~/components/FormDrawer.vue'
import {toast} from '~/composables/util'

//搜索
const searchForm=reactive({
    keyword:''
})
const resetSearchForm=()=>{
    searchForm.keyword=''
    getData()
}

// 表格数据
const tableData = ref([])

//加载动画
const loading=ref(false)

//分页
const currentPage=ref(1)
const total=ref(10)
const limit=ref(10)

//获取数据
const getData=(page=null)=>{
    if(typeof page=='number'){
        currentPage.value=page
    }
    loading.value=true
    getManagerList(currentPage.value,searchForm)
    .then(res=>{
        total.value=res.totalCount
        tableData.value=res.list.map(o=>{
            o.statusLoading=false
            return o
        })
    })
    .finally(()=>{
        loading.value=false
    })
}
getData()

const form=reactive({
    title:'',
    content:''
})

const formDrawerRef=ref(null)
const formRef=ref(null)
//修改公告
    //修改和新增打开抽屉显示不同的title
const editId=ref(0)
const drawerTitle=computed(()=>editId.value ? '修改' : '新增')
    //重置表单
function resetForm(row=false){
    if(formRef.value){
        formRef.value.clearValidate()
    }
    if(row){
        for(const key in form){
            form[key]=row[key]
        }
    }
}
const handleEdit=(item)=>{
    editId.value=item.id
    resetForm(item)
    formDrawerRef.value.open()
}

//修改管理员状态
const handleStatusChange=(status,row)=>{
    row.statusLoading=true
    updateManageStatus(row.id,status)
    .then(res=>{
        toast('修改状态成功')
        row.status=status
    })
    .finally(()=>{
        row.statusLoading=false
    })
}

//删除公告
const handleDelete=(id)=>{
    loading.value=true
    deleteNotice(id)
    .then(res=>{
        toast('删除成功')
        getData()
    })
    .finally(()=>{
        loading.value=false
    })
}

//新增公告相关

const openDrawer=()=>{
    editId.value=0
    resetForm({
        title:'',
        content:''
    })
    formDrawerRef.value.open()
}

const handeSubmit=()=>{
    formRef.value.validate((valid)=>{
        if(!valid){
            return
        }
        formDrawerRef.value.showLoading()
        const fun=editId.value ? updateNotice(editId.value,form) : addNotice(form)
        fun
        .then(res=>{
            toast(drawerTitle.value+'成功')
            getData(editId.value ? false : 1)
            formDrawerRef.value.close()
        })
        .finally(()=>{
            formDrawerRef.value.hideLoading()
        })
    })
}

const rules={
    title:[{
        required:true,
        message:'公告标题不能为空',
        trigger:'blur'
    }],
    content:[{
        required:true,
        message:'公告内容不能为空',
        trigger:'blur'
    }]
}

</script>

<template>
    <el-card shadow="never" class="border-0">
        <!-- 搜索 -->
        <el-form :model="searchForm" label-width="80px" class="mb-3" size="small">
            <el-row :gutter="20">
                <el-col :span="8" :offset="0">
                    <el-form-item label="关键词">
                        <el-input v-model="searchForm.keyword" placeholder="管理员昵称" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" :offset="8">
                        <div class="flex items-center justify-end">
                            <el-button type="primary" @click="getData()">搜索</el-button>
                            <el-button @click="resetSearchForm">重置</el-button>
                        </div>
                </el-col>
            </el-row>
        </el-form>
        
        <!-- 新增 | 刷新 -->
        <div class="flex items-center justify-between mb-4">
            <el-button type="primary" size="small" @click="openDrawer">新增</el-button>
            <el-tooltip content="刷新数据" placement="bottom" effect="dark">
                <el-button @click="getData()" type="primary" text>
                    <el-icon :size="20"><Refresh/></el-icon>
                </el-button>
            </el-tooltip>
        </div>
        <!-- 表格区域 -->
        <el-table :data="tableData" stripe style="width:100%" v-loading="loading">
            <el-table-column label="管理员" width="200" >
                <template #default="{row}">
                    <div class="flex items-center">
                        <el-avatar icon="el-icon-user-solid" :size="40" :src="row.avatar" ></el-avatar>
                        <div class="ml-3">
                            <h6>{{ row.username }}</h6>
                            <small>ID:{{ row.id }}</small>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="所属管理员" align="center" >
                <template #default="{row}">
                    {{ row.role?.name || '-' }}
                </template>
            </el-table-column>
            <el-table-column label="状态" width="120" >
                <template #default="{row}">
                    <el-switch @change="handleStatusChange($event,row)" :modelValue="row.status" :active-value="1" :inactive-value="0" :loading="row.statusLoading" :disabled="row.super==1">
                    </el-switch>
                    
                </template> 
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <small v-if="scope.row.super==1" class="text-sm text-gray-500">暂无操作</small>
                    <div v-else>
                        <el-button size="small" text type="primary" @click="handleEdit(scope.row)"
                        >修改</el-button>
                        <el-popconfirm title="是否要删除此管理员?" confirm-button-text="确认" cancel-button-text="取消" @confirm="handleDelete(scope.row.id)" >
                            <template #reference>
                                <el-button text type="primary" size="small">删除</el-button>  
                            </template>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="flex items-center justify-center mt-5">
            <el-pagination
                @current-change="getData" :page-size="limit" layout=" prev, pager, next"
                :total="total" :current-page="currentPage" background/>
        </div>
        <!-- 抽屉 -->
        <FormDrawer :title="drawerTitle" ref="formDrawerRef" @submit="handeSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item prop="title" label="公告标题">
                    <el-input v-model="form.title" placeholder="公告标题"></el-input>
                </el-form-item>
                <el-form-item prop="content" label="公告内容">
                    <el-input v-model="form.content" type="textarea" :rows="5" placeholder="公告内容"></el-input>
                </el-form-item>
            </el-form>
            
        </FormDrawer>
    </el-card>
    
</template>

<style scoped>

</style>