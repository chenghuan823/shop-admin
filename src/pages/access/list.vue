<script setup>
import {ref} from 'vue'
import ListHeader from '~/components/ListHeader.vue'
import {getRuleList} from '~/api/rule'
import {useInitTable}from '~/composables/useCommon'
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
    }
})
</script>

<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增 | 刷新 -->
        <ListHeader @create="" @refresh="getData" />
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
                        <el-button type="primary" size="small" @click="" text>修改</el-button>
                        <el-button type="primary" size="small" @click="" text>增加</el-button>
                        <el-button type="primary" size="small" @click="" text>删除</el-button>
                    </div>
                </div>
            </template>
        </el-tree>
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