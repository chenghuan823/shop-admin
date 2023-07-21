<script setup>
import {ref} from 'vue'
import { getRoleList, addRole, updateRole, deleteRole,updateRoleStatus } from '~/api/role'
import {getRuleList} from '~/api/rule'
import FormDrawer from '~/components/FormDrawer.vue'
import { useInitTable, useInitForm } from '~/composables/useCommon'
import ListHeader from '~/components/ListHeader.vue'

const {
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange
} = useInitTable({
    getList: getRoleList,
    delete:deleteRole,
    updateStatus:updateRoleStatus
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
} = useInitForm({
    form: {
        desc: '',
        name: '',
        status:1
    },
    rules: {
        desc: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
        }],
        name: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
        }]
    },
    getData,
    update: updateRole,
    create: addRole
})

const setRoleFormDrawerRef=ref(null)
const ruleList=ref([])
const treeHeight=ref(0)
const roleId=ref(0)
const defaultExpandedKeys=ref([])
const elTreeRef=ref(null)
const ruleIds=ref([])
//当前角色拥有的权限ID
const openSetRole=(row)=>{
    roleId.value=row.id
    treeHeight.value=window.innerHeight -180
    getRuleList(1)
    .then(res=>{
        ruleList.value=res.list
        defaultExpandedKeys.value=res.list.map(o=>o.id)
        setRoleFormDrawerRef.value.open()
        //当前角色拥有的权限ID
        ruleIds.value=row.rules.map(o=>o.id)
        setTimeout(()=>{
            elTreeRef.value.setCheckedKeys(ruleIds.value)
        },150)
    })
}
const handeSetRoleSubmit=()=>{

}

</script>

<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增 | 刷新 -->
        <ListHeader @create="openDrawer" @refresh="getData" />
        <!-- 表格区域 -->
        <el-table :data="tableData" stripe style="width:100%" v-loading="loading">
            <el-table-column prop="name" label="角色名称" width="180" />
            <el-table-column prop="desc" label="角色描述" width="380" />
            <el-table-column label="状态" width="120" >
                <template #default="{row}">
                    <el-switch @change="handleStatusChange($event,row)" :modelValue="row.status" :active-value="1" :inactive-value="0" :loading="row.statusLoading" :disabled="row.super==1">
                    </el-switch>
                </template> 
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <el-button size="small" text type="primary" @click="openSetRole(scope.row)">配置权限</el-button>
                    <el-button size="small" text type="primary" @click="handleEdit(scope.row)">修改</el-button>

                    <el-popconfirm title="是否要删除此公告?" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button text type="primary" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="flex items-center justify-center mt-5">
            <el-pagination @current-change="getData" :page-size="limit" layout=" prev, pager, next" :total="total"
                :current-page="currentPage" background />
        </div>
        <!-- 抽屉 -->
        <FormDrawer :title="drawerTitle" ref="formDrawerRef" @submit="handeSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item prop="name" label="角色名称">
                    <el-input v-model="form.name" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item prop="desc" label="角色描述">
                    <el-input v-model="form.desc" type="textarea" :rows="5" placeholder="角色描述"></el-input>
                </el-form-item>
                <el-form-item prop="status" label="状态">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0" >
                    </el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>
        <!-- 权限配置树形 -->
        <FormDrawer title="权限配置" ref="setRoleFormDrawerRef" @submit="handeSetRoleSubmit">
            <el-tree node-key="id" :default-expanded-keys="defaultExpandedKeys" :data="ruleList" :props="{label:'name',children:'child'}" :height="treeHeight" ref="elTreeRef" show-checkbox>
                <template #default="{node,data}">
                    <div class="flex items-center"> 
                        <el-tag :type="data.menu?'':'info'" size="small">
                            {{ data.menu?'菜单':'权限' }}
                        </el-tag>
                        <span class="ml-2 text-sm">
                            {{ data.name }}
                        </span>
                    </div>
                </template>
            </el-tree>
        </FormDrawer>
    </el-card>
</template>

<style scoped></style>