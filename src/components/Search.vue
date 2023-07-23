<script setup>
import {ref,useSlots} from 'vue'

defineEmits(['search','reset'])
defineProps({
    searchForm:Object
})
const showSearch=ref(false)
//插槽信息
const slots=useSlots()
const hasShow=ref(!!slots.show)
</script>

<template>
        <!-- 搜索 -->
        <el-form :model="searchForm" label-width="80px" class="mb-3" size="small">
            <el-row :gutter="20">
                <slot></slot>
                <template v-if="showSearch">
                    <slot name="show" />
                </template>
                <el-col :span="8" :offset="showSearch ?0: 8">
                        <div class="flex items-center justify-end">
                            <el-button type="primary" @click="$emit('search')">搜索</el-button>
                            <el-button @click="$emit('reset')">重置</el-button>
                            <el-button v-if="hasShow" type="primary" size="small" text @click="showSearch=!showSearch">
                                {{ showSearch?'收起':'展开' }}
                                <el-icon ><ArrowUp v-if="showSearch"/><ArrowDown v-else/></el-icon>
                            </el-button>
                            
                        </div>
                </el-col>
            </el-row>
        </el-form>
</template>

<style scoped>

</style>