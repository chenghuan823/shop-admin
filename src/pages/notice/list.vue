<script setup>
import {ref,reactive} from 'vue'
import {getNoticeList,addNotice} from '~/api/notice'
import FormDrawer from '~/components/FormDrawer.vue'
import {toast} from '~/composables/util'
// 表格数据
const tableData = ref([])

//加载动画
const loading=ref(false)

//分页
const currentPage=ref(0)
const total=ref(10)
const limit=ref(10)

//获取数据
const getData=(page=1)=>{
    currentPage.value=page
    loading.value=true
    getNoticeList(page)
    .then(res=>{
        total.value=res.totalCount
        tableData.value=res.list
    })
    .finally(()=>{
        loading.value=false
    })
}
getData()

const handleDelete=(id)=>{
    console.log(id);
}

//新增公告相关
const form=reactive({
    title:'',
    content:''
})

const formDrawerRef=ref(null)
const formRef=ref(null)

const openDrawer=()=>{
    formDrawerRef.value.open()
}

const handeSubmit=()=>{
    formRef.value.validate((valid)=>{
        if(!valid){
            return
        }
        formDrawerRef.value.showLoading()
        addNotice(form)
        .then(res=>{
            toast('新增成功')
            getData()
        })
        .finally(()=>{
            formDrawerRef.value.hideLoading()
            formDrawerRef.value.close()
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
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="title" label="公告标题" width="180" />
            <el-table-column prop="create_time" label="发布时间" width="380" />
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <el-button size="small" text type="primary" @click="handleEdit(scope.$index, scope.row)"
                    >修改</el-button>

                    <el-popconfirm title="是否要删除此公告?" confirm-button-text="确认" cancel-button-text="取消" @confirm="handleDelete(scope.row.id)" >
                        <template #reference>
                            <el-button text type="primary" size="small">删除</el-button>  
                        </template>
                    </el-popconfirm>
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
        <FormDrawer title="新增公告" ref="formDrawerRef" @submit="handeSubmit">
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