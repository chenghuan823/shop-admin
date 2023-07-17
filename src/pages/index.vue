<script setup>
import {reactive,ref} from 'vue'
import { getStatistics1,getStatistics2 } from '~/api/index.js'
import CountTo from '~/components/CountTo.vue'
import IndexNavs from '~/components/IndexNavs.vue';
import IndexChart from '~/components/IndexChart.vue';
import IndexCard from '~/components/IndexCard.vue';

const state=reactive({
    goods:[],
    order:[]
})

const panels=ref([])

const GetStatistics1=async ()=>{
    const res= await getStatistics1()
    panels.value=res.panels
}
GetStatistics1()

const GetStatistics2=async ()=>{
    const res= await getStatistics2()
    if(res){
        const {goods,order}=res
        state.goods=goods
        state.order=order
    }
}
GetStatistics2()

</script>

<template>
    <div>
        <el-row :gutter="20" v-permission="['getStatistics1,GET']">
            <!-- 骨架屏 -->
            <template v-if="panels.length===0">
                <el-col :span="6" v-for="i in 4" :key="i">
                    <el-skeleton style="width: 100%" animated loading>
                        <template #template>
                            <el-card shadow="hover" class="border-0">
                                <template #header>
                                    <div class="flex justify-between">
                                        <el-skeleton-item variant="text" style="width: 50%;" />
                                        <el-skeleton-item variant="text" style="width: 10%;" />
                                    </div>
                                </template>
                                <!-- card body -->
                                <el-skeleton-item variant="h3" style="width: 80%;" />
                                <el-divider/>
                                <div class="flex justify-between text-sm text-gray-500">
                                    <el-skeleton-item variant="text" style="width: 50%;" />
                                    <el-skeleton-item variant="text" style="width: 10%;" />
                                </div>
                            </el-card>
                            
                        </template>
                    </el-skeleton>
                </el-col>
            </template>
            <el-col :span="6" :offset="0" v-for="(item,index) in panels" :key="index">
                <el-card shadow="hover" class="border-0">
                    <template #header>
                    <div class="flex justify-between">
                        <span class="text-sm">{{ item.title }}</span>
                        <el-tag :type="item.unitColor">{{ item.unit }}</el-tag>
                    </div>
                    </template>
                    <!-- card body -->
                    <span class="text-3xl font-bold text-gray-500"><CountTo :value="item.value"/></span>
                    <el-divider/>
                    <div class="flex justify-between text-sm text-gray-500">
                        <span>{{ item.subTitle }}</span>
                        <span><CountTo :value="item.subValue"/></span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <!-- 分类图标组件 -->
        <IndexNavs/>
        <!-- 订单统计 -->
        <el-row  class="mt-5" :gutter="20">
            <el-col :span="12" :offset="0">
                <IndexChart v-permission="['getStatistics3,GET']"/>
            </el-col>
            <el-col :span="12" :offset="0" v-permission="['getStatistics2,GET']">
                <IndexCard class="mb-4" title="店铺及商品提示" tip="店铺及商品提示" :btns="state.goods"/>
                <IndexCard title="交易提示" tip="需要立即处理的交易提示" :btns="state.order" />
            </el-col>
        </el-row>
        
    </div>
</template>

<style scoped>

</style>