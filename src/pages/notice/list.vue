<script setup>
import {ref} from 'vue'
import {getNoticeList} from '~/api/notice'
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
</script>

<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增 | 刷新 -->
        <div class="flex items-center justify-between mb-4">
            <el-button type="primary" size="small" @click="">新增</el-button>
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
    </el-card>
    
</template>

<style scoped>

</style>