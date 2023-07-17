<script setup>
import {} from 'vue'

const props=defineProps({
    title:{
        type:String,
        default:''
    },
    tip:{
        type:String,
        default:''
    },
    btns:{
        type:Array,
        default:[]
    }
})

</script>

<template>
    <el-card shadow="never">
        <template #header>
        <div>
            <div class="flex justify-between">
                        <span class="text-sm">{{ props.title }}</span>
                        <el-tag type="danger">{{ props.tip }}</el-tag>
                    </div>
        </div>
        </template>
        <!-- card body -->
        <el-row class="flex" :gutter="20">
            <el-col v-for="(item,index) in btns" :index="index" :span="6" :offset="0">
                <el-card shadow="hover" class="border-0 bg-light-400">
                    <div class="flex flex-col items-center justify-center">
                        <span class="text-xl mb-2">{{ item.value }}</span>
                        <span class="text-xs text-gray-500">{{ item.label }}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        
    </el-card>
    

</template>