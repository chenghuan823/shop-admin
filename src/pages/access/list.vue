<script setup>
import {ref} from 'vue'
import ListHeader from '~/components/ListHeader.vue'
import {getRuleList,addRule,updateRule} from '~/api/rule'
import {useInitTable,useInitForm}from '~/composables/useCommon'
import FormDrawer from '~/components/FormDrawer.vue'
import IconSelect from '~/components/IconSelect.vue'
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
                    <el-cascader v-model="form.rule_id" :options="options" :props="{label:'name',children:'child',checkStrictly:true,emitPath:false,value:'id'}" placeholder="请选择上级菜单"/>
                </el-form-item>
                <el-form-item prop="menu" label="菜单/规则">
                    <el-radio-group v-model="form.menu">
                        <el-radio :label="1" size="small" border>菜单</el-radio>
                        <el-radio :label="0" size="small" border>规则</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="name" label="名称">
                    <el-input v-model="form.name" style="width:30%" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item prop="icon" label="菜单图标" v-if="form.menu==1">
                    <IconSelect v-model="form.icon"/>
                </el-form-item>
                <el-form-item prop="frontpath" label="前端路由"  v-if="form.menu==1 && form.rule_id>0">
                    <el-input v-model="form.frontpath" placeholder="前端路由"></el-input>
                </el-form-item>
                <el-form-item prop="condition" label="后端规则" v-if="form.menu==0">
                    <el-input v-model="form.condition" placeholder="后端规则"></el-input>
                </el-form-item>
                <el-form-item prop="method" label="请求方式" v-if="form.menu==0">
                    <el-select v-model="form.method" placeholder="请选择请求方式">
                        <el-option v-for="item in ['GET','POST','PUT','DELETE']"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="order" label="排序">
                    <el-input-number :max="1000" :min="0" v-model="form.order"/>
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