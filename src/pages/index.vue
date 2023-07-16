<script setup>
import {reactive,ref} from 'vue'
import { getStatistics1 } from '~/api/index.js'

const panels=ref([])

const GetStatistics1=async ()=>{
    const res= await getStatistics1()
    panels.value=res.panels
}
GetStatistics1()

// {
// 				"title": "支付订单",
// 				"value": 49,
// 				"unit": "年",
// 				"unitColor": "success",
// 				"subTitle": "总支付订单",
// 				"subValue": 49,
// 				"subUnit": ""
// 			},
</script>

<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="6" :offset="0" v-for="(item,index) in panels" :key="index">
            <el-card shadow="hover" class="border-0">
                <template #header>
                <div class="flex justify-between">
                    <span class="text-sm">{{ item.title }}</span>
                    <el-tag :type="unitColor">{{ item.unit }}</el-tag>
                </div>
                </template>
                <!-- card body -->
                <span class="text-3xl font-bold text-gray-500">{{ item.value }}</span>
                <el-divider/>
                <div class="flex justify-between text-sm text-gray-500">
                    <span>{{ item.subTitle }}</span>
                    <span>{{ item.subValue }}</span>
                </div>
            </el-card>
            </el-col>
        </el-row>
        
    </div>
</template>

<style scoped>

</style>