<script setup>
import { ref } from 'vue'
import { useRoute,useRouter,onBeforeRouteUpdate } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
const cookies = useCookies()

const route =useRoute()
const router =useRouter()
const activeTab = ref(route.path)
const tabList = ref([
  {
    title: '后台首页',
    path:'/'
  },
])

//初始化标签导航列表
const initTabList=()=>{
    let tbs=cookies.get('tabList')
    if(tbs){
        tabList.value=tbs
    }
}
initTabList()
const addTab=(data)=>{
    let noTab=tabList.value.findIndex(t=>t.path==data.path)==-1
    if(noTab){
        tabList.value.push(data)
    }
    cookies.set('tabList',tabList.value)
}
onBeforeRouteUpdate((to,from)=>{
    activeTab.value=to.path
    addTab({
        title:to.meta.title,
        path:to.path
    })
})

const changeTab=(path)=>{
    activeTab.value=path
    router.push(path)
}

const removeTab=()=>{

}

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
            <el-dropdown>
                <span class="el-dropdown-link">
                <el-icon>
                    <arrow-down />
                </el-icon>
                </span>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>Action 1</el-dropdown-item>
                    <el-dropdown-item>Action 2</el-dropdown-item>
                    <el-dropdown-item>Action 3</el-dropdown-item>
                    <el-dropdown-item disabled>Action 4</el-dropdown-item>
                    <el-dropdown-item divided>Action 5</el-dropdown-item>
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