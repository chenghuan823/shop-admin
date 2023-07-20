<script setup>
import {computed,ref } from 'vue'
import { useRouter,useRoute,onBeforeRouteUpdate } from 'vue-router'
import {useStore} from 'vuex'
const store=useStore()
const router =useRouter()
const route =useRoute()

//默认激活菜单
const defaultActive=ref(route.path)
//监听路由变化
onBeforeRouteUpdate((to,from)=>{
    defaultActive.value=to.path
})
const asideMenus = computed(()=>store.state.menus)

const handleSelect=(path)=>{
    router.push(path)
}

const isCollapse=computed(()=>store.state.asideWidth==='64px')

</script>

<template>
    <div class="f-menu" :style="{width:$store.state.asideWidth}">
        <el-menu :default-active="defaultActive" unique-opened :collapse="isCollapse" :collapse-transition="false" default-active="2" class="border-0" @select="handleSelect">
            <template v-for="(item,index) in asideMenus" :key="index">
                <el-sub-menu v-if="item.child && item.child.length>0" :index="item.name">
                    <template #title>
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <span>{{ item.name }}</span>
                    </template>
                    <el-menu-item v-for="(item2,index2) in item.child" :key="index2" :index="item2.frontpath">
                        <el-icon>
                            <component :is="item2.icon"></component>
                        </el-icon>
                        <span>{{ item2.name }}</span>    
                    </el-menu-item>
                </el-sub-menu>

                <el-menu-item v-else :index="item.frontpath">
                    <component :is="item.icon"></component>
                    <span>{{ item.name }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>



<style scoped>
.f-menu {
    transition:all .2s;
    top: 64px;
    bottom: 0;
    left: 0;
    overflow-y: auto;
    overflow-x: hidden;
    @apply shadow-md bg-light-50 fixed;
}
.f-menu::-webkit-scrollbar{
    width:0px
}
</style>