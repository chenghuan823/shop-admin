<script setup>
import FHeader from './components/FHeader.vue'
import FMenu from './components/FMenu.vue'
import FTagList from './components/FTagList.vue'
</script>

<template>
    <el-container>
        <el-header>
            <FHeader></FHeader>
        </el-header>
        <el-container>
            <el-aside :width="$store.state.asideWidth">
                <FMenu></FMenu>
            </el-aside>
            <el-main>
                <FTagList></FTagList>
                <router-view v-slot="{ Component }">
                    <transition name="fade">
                        <keep-alive :max="10">
                            <component :is="Component"></component>
                        </keep-alive>
                    </transition>
                </router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<style scoped>
.el-aside {
    transition: all .2s;
}

.fade-enter-from {
    opacity: 0;
}

.fade-enter-to {
    opacity: 1;
}

.fade-leave-from {
    opacity: 1;
}

.fade-leave-to {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: all .3s;
}
.fade-enter-active{
    transition-delay: .3s;
}
</style>