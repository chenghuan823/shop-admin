<script setup>
import {ref,onMounted,onBeforeUnmount} from 'vue'
import * as echarts from 'echarts'
import {getStatistics3} from '~/api/index'
import { useResizeObserver } from '@vueuse/core'

const current=ref("week")

const options=[
    {
        text:"近一个月",
        value:'month'
    },
    {
        text:"近1周",
        value:'week'
    },
    {
        text:"近24小时",
        value:'hour'
    },
]

const handleChoose=(data)=>{
    if(data===current){
        return
    }
    current.value=data
    getData()
}

// **********
var myChart=null;

onMounted(()=>{
    var chartDom = document.getElementById('chart')
    myChart = echarts.init(chartDom)
    getData()
});

// 销毁实例
onBeforeUnmount(()=>{
    if(myChart){
        echarts.dispose()
    }
})

const getData=async()=>{
    let option = {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }
        ]
    };
    myChart.showLoading()
    const res=await getStatistics3(current.value)
    if(res){
        option.xAxis.data=res.x
        option.series[0].data=res.y
        option && myChart.setOption(option);
    }
    myChart.hideLoading()
}

// 图标跟随窗口缩放
const el = ref(null)
useResizeObserver(el, (entries) => {
    myChart.resize()
})

</script>

<template>
<el-card shadow="never">
    <template #header>
    <div class="flex justify-between">
        <span class="text=sm">订单统计</span>
        <div>
            <el-check-tag v-for="(item,index) in options" :key="index" :checked="current===item.value" style="margin-right: 8px" @click="handleChoose(item.value)">{{ item.text }}</el-check-tag>
        </div>
    </div>
    </template>
    <!-- card body -->
    <div ref="el" id="chart" style="width:100%;height:400px">

    </div>
</el-card>

</template>

<style scoped>

</style>