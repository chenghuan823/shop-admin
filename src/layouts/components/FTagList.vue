<script setup>
import { useTabList } from '~/composables/useTabList'

const {
    activeTab,
    tabList,
    changeTab,
    removeTab,
    handleClose
}=useTabList()

</script>

<template>
    <div class="f-tag-list" :style="{left:$store.state.asideWidth}">
        <el-tabs
            v-model="activeTab"
            type="card"
            class="flex-1"
            style="min-width:100px;"
            @tab-change="changeTab"
            @tab-remove="removeTab"
        >
            <el-tab-pane
            v-for="item in tabList"
            :closable="item.path!='/'"
            :key="item.path"
            :label="item.title"
            :name="item.path"
            >
            </el-tab-pane>
        </el-tabs>

        <span class="tag-btn">
            <el-dropdown @command="handleClose">
                <span class="el-dropdown-link">
                <el-icon>
                    <arrow-down />
                </el-icon>
                </span>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="clearOther">关闭其它</el-dropdown-item>
                    <el-dropdown-item command="clearAll">全部关闭</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
    </div>
    <div style="height:44px;"></div>
</template>

<style scoped>
.f-tag-list{
    @apply fixed flex items-center bg-gray-100 px-2;
    top: 64px;
    right: 0;
    height: 44px;
    z-index: 100;
}
.tag-btn{
    @apply bg-white px-2 rounded ml-auto flex items-center justify-center;
    height: 32px;
}
:deep(.el-tabs__header){
    margin: 0!important;
}
:deep(.el-tabs--card>.el-tabs__header .el-tabs__nav){
    border: none!important;
}
:deep(.el-tabs__item){
    border:0!important;
    height: 32px;
    line-height: 32px;
    @apply bg-white mx-1 rounded mt-1;
}
:deep(.is-disabled){
    cursor: not-allowed;
    @apply text-gray-300;
}
:deep(.el-tabs--card>.el-tabs__header){
    border: 0;
}
</style>