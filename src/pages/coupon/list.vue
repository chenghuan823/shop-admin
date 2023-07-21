<script setup>
import { getCouponList, addCoupon, updateCoupon, deleteCoupon } from '~/api/coupon'
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
    handleDelete
} = useInitTable({
    getList: getCouponList,
    delete:deleteCoupon
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
        title: '',
        content: ''
    },
    rules: {
        title: [{
            required: true,
            message: '公告标题不能为空',
            trigger: 'blur'
        }],
        content: [{
            required: true,
            message: '公告内容不能为空',
            trigger: 'blur'
        }]
    },
    getData,
    update: updateCoupon,
    create: addCoupon
})
</script>

<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增 | 刷新 -->
        <ListHeader @create="openDrawer" @refresh="getData" />
        <!-- 表格区域 -->
        <el-table :data="tableData" stripe style="width:100%" v-loading="loading">
            <el-table-column prop="title" label="优惠券名称" width="350" >
                <template #default="{row}">
                    <div class="border border-dashed py-2 px-2 rounded">
                        <h5 class="font-bold text-md">{{ row.name }}</h5>
                        <small>{{ row.start_time }} ~ {{ row.end_time }}</small>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="statusText" label="状态"  align="center"/>
            <el-table-column prop="statusText" label="优惠" align="center">
                <template #default="{row}">
                    {{ row.type ? '满减' : '折扣' }}{{ row.type ? ('￥'+row.value) : (row.value+'折') }}
                </template>
            </el-table-column>
            <el-table-column prop="total" label="发放数量" align="center" />
            <el-table-column prop="used" label="已使用" align="center" />
            <el-table-column label="操作" align="center">
                <template #default="scope">
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

<style scoped></style>