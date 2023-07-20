<script setup>
import {ref} from 'vue'
import ListHeader from '~/components/ListHeader.vue'
import {getRuleList,addRule,updateRule} from '~/api/rule'
import {useInitTable,useInitForm}from '~/composables/useCommon'
import FormDrawer from '~/components/FormDrawer.vue'
const options=ref([])
const defaultEexpandedKeys=ref([])
const {
    loading,
    tableData,
    getData,

} =useInitTable({
    getList:getRuleList,
    onGetListSuccess:(res)=>{
        tableData.value=res.list
        defaultEexpandedKeys.value=res.list.map(o=>o.id)
        options.value=res.rules
    }
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
        rule_id: 0,
        menu: 0,
        name:'',
        condition:'',
        method:'GET',
        status:1,
        order:50,
        icon:'',
        frontpath:''
    },
    rules: {
    },
    getData,
    update: updateRule,
    create: addRule
})
</script>

<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增 | 刷新 -->
        <ListHeader @create="openDrawer" @refresh="getData" />
        <!-- 树型控件 -->
        <el-tree :data="tableData" :props="{label:'name',children:'child'}" v-loading="loading" node-key="id" :default-expanded-keys="defaultEexpandedKeys" >
            <template #default="{ node, data }">
                <div class="custom-tree-node">
                    <el-tag size="small" :type="data.menu?'':'info'">{{ data.menu?'菜单':'权限' }}</el-tag>
                    <el-icon v-if="data.icon" :size="16" class="ml-2">
                        <component :is="data.icon"/>
                    </el-icon>
                    <span>
                        {{ data.name }}
                    </span>
                    <div class="ml-auto">
                        <el-switch :modelValue="data.status" :active-value="1" :inactive-value="0"></el-switch>
                        <el-button type="primary" size="small" @click.stop="handleEdit(data)" text>修改</el-button>
                        <el-button type="primary" size="small" @click="" text>增加</el-button>
                        <el-button type="primary" size="small" @click="" text>删除</el-button>
                    </div>
                </div>
            </template>
        </el-tree>
        <FormDrawer :title="drawerTitle" ref="formDrawerRef" @submit="handeSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item prop="rule_id" label="上级菜单">
                    <el-cascader v-model="form.rule_id" :options="options" :props="{label:'name',children:'child',checkStrictly:true,emitPath:false}" placeholder="请选择上级菜单"/>
                </el-form-item>
                <el-form-item prop="menu" label="菜单/规则">
                    <el-input v-model="form.menu"></el-input>
                </el-form-item>
                <el-form-item prop="name" label="菜单/权限名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item prop="icon" label="菜单图标">
                    <el-input v-model="form.icon"></el-input>
                </el-form-item>
                <el-form-item prop="frontpath" label="前端路由">
                    <el-input v-model="form.frontpath"></el-input>
                </el-form-item>
                <el-form-item prop="condition" label="后端规则">
                    <el-input v-model="form.condition"></el-input>
                </el-form-item>
                <el-form-item prop="method" label="请求方式">
                    <el-input v-model="form.method"></el-input>
                </el-form-item>
                <el-form-item prop="order" label="排序">
                    <el-input v-model="form.order"></el-input>
                </el-form-item>
            </el-form>

        </FormDrawer>
    </el-card>
</template>

<style scoped>
.custom-tree-node{
    flex:1;
    @apply flex justify-center items-center ;
    font-size: 14px;
    padding-right: 8px;
}
:deep(.el-tree-node__content){
    padding: 20px 0;
}
</style>