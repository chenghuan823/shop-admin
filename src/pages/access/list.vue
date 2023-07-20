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
        <el-tree :data="tableData" :props="{label:'name',children:'child'}" v-loading="loading" node-key="id" :default-expanded-keys="defaultEexpandedKeys" />
    </el-card>
    
</template>

<style scoped>

</style>