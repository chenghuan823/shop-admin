<script setup>
import {ref} from 'vue'
import {getManagerList,updateManageStatus,createManager,updateManager,deleteManager} from '~/api/manager'
import FormDrawer from '~/components/FormDrawer.vue'
import ChooseImage from '~/components/ChooseImage.vue'
import {useInitTable,useInitForm} from '~/composables/useCommon'
const roles=ref([])

const {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange
}= useInitTable({
    searchForm:{
        keyword:''
    },
    getList:getManagerList,
    onGetListSuccess:(res)=>{
        total.value=res.totalCount
        tableData.value=res.list.map(o=>{
            o.statusLoading=false
            return o
        })
        roles.value=res.roles
    },
    delete:deleteManager,
    updateStatus:updateManageStatus
})

const {
    form,
    formDrawerRef,
    formRef,
    rules,
    drawerTitle,
    handeSubmit,
    openDrawer,
    handleEdit
}=useInitForm({
    form:{
        username: "",
        password: "",
        role_id: null,
        status: 1,
        avatar: "",
    },
    getData,
    update:updateManager,
    create:createManager
})

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
                        <el-avatar :size="40" :src="row.avatar"></el-avatar>
                        <div class="ml-3">
                            <h6>{{ row.username }}</h6>
                            <small>ID:{{ row.id }}</small>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="所属角色" align="center" >
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
                <el-form-item prop="username" label="用户名">
                    <el-input v-model="form.username" placeholder=""></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input v-model="form.password" type="password" :rows="5"></el-input>
                </el-form-item>
                <el-form-item prop="avator" label="头像">
                    <ChooseImage v-model="form.avatar"/>
                </el-form-item>
                <el-form-item prop="role_id" label="所属角色">
                    <el-select v-model="form.role_id" value-key="" placeholder="选择所属角色">
                        <el-option v-for="item in roles"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="status" label="状态">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
</template>

<style scoped>

</style>