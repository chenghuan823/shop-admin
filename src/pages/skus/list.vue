<script setup>
import {ref} from 'vue'
import { getSkusList, addSkus, updateSkus, deleteSkus,updateSkusStatus } from '~/api/skus'
import FormDrawer from '~/components/FormDrawer.vue'
import TagInput from '~/components/TagInput.vue'
import { useInitTable, useInitForm } from '~/composables/useCommon'
import ListHeader from '~/components/ListHeader.vue'
import {toast} from '~/composables/util'

const {
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange,
    handleSelectionChange,
    multipleTableRef,
    handleMutiDelete
} = useInitTable({
    getList: getSkusList,
    delete:deleteSkus,
    updateStatus:updateSkusStatus
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
        default:'',
        name:'',
        status:1,
        order:50
    },
    rules: {
        default: [{
            required: true,
            message: '规格名称不能为空',
            trigger: 'blur'
        }],
        name: [{
            required: true,
            message: '规格值不能为空',
            trigger: 'blur'
        }]
    },
    getData,
    update: updateSkus,
    create: addSkus
})

</script>

<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增 | 刷新 -->
        <ListHeader layout="create,delete,refresh" @delete="handleMutiDelete" @create="openDrawer" @refresh="getData" />
        <!-- 表格区域 -->
        <el-table ref="multipleTableRef" :data="tableData" stripe style="width:100%" v-loading="loading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="规格名称" width="180" />
            <el-table-column prop="default" label="规格值" width="380" />
            <el-table-column prop="order" label="排序" />
            <el-table-column label="状态" width="120" >
                <template #default="{row}">
                    <el-switch @change="handleStatusChange($event,row)" :modelValue="row.status" :active-value="1" :inactive-value="0" :loading="row.statusLoading" :disabled="row.super==1">
                    </el-switch>
                </template> 
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <div class="flex">
                        <el-button size="small" text type="primary" @click="handleEdit(scope.row)">修改</el-button>
                        <el-popconfirm title="是否要删除此规格?" confirm-button-text="确认" cancel-button-text="取消"
                            @confirm="handleDelete(scope.row.id)">
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
            <el-pagination @current-change="getData" :page-size="limit" layout=" prev, pager, next" :total="total"
                :current-page="currentPage" background />
        </div>
        <!-- 抽屉 -->
        <FormDrawer destroyOnClose :title="drawerTitle" ref="formDrawerRef" @submit="handeSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item prop="name" style="width:50%" label="规格名称">
                    <el-input v-model="form.name" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item prop="order" label="排序">
                    <el-input-number v-model="form.order" size="small" :min="0" :max="1000">
                    </el-input-number>
                </el-form-item>
                <el-form-item prop="status" label="状态">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0" >
                    </el-switch>
                </el-form-item>
                <el-form-item prop="default" label="规格值">
                    <TagInput v-model="form.default" />
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
</template>

<style scoped></style>