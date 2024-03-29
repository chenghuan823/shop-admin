<script setup>
import {computed} from 'vue'
import { getCouponList, addCoupon, updateCoupon, deleteCoupon,updateCouponStatus } from '~/api/coupon'
import FormDrawer from '~/components/FormDrawer.vue'
import { useInitTable, useInitForm } from '~/composables/useCommon'
import ListHeader from '~/components/ListHeader.vue'

function formatStatus(row){
    let s='领取中'
    let start_time=(new Date(row.start_time)).getTime()
    let now=(new Date()).getTime()
    let end_time=(new Date(row.end_time)).getTime()
    if(start_time>now){
        s='未开始'

    }else if(end_time<now){
        s='已结束'
    }else if(row.status==0){
        s='已失效'
    }
    return s
}

const {
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange
} = useInitTable({
    getList: getCouponList,
    delete:deleteCoupon,
    updateStatus:updateCouponStatus,
    onGetListSuccess:(res)=>{
        tableData.value=res.list.map(o=>{
            //转化优惠券状态
            o.statusText=formatStatus(o)
            return o
        })
        total.value=res.totalCount
        
    }
})

const {
    form,
    formDrawerRef,
    formRef,
    rules,
    drawerTitle,
    handeSubmit,
    openDrawer,
    handleEdit
} = useInitForm({
    form: {
        name:'',
        type:0,
        value:0,
        total:100,
        min_price:0,
        start_time:'',
        end_time:'',
        order:50
    },
    rules: {
    },
    getData,
    update: updateCoupon,
    create: addCoupon,
    beforeSubmit:(f)=>{
        if(typeof f.start_time!='number'){
            f.start_time=(new Date(f.start_time)).getTime()
        }
        if(typeof f.end_time!='number'){
            f.end_time=(new Date(f.end_time)).getTime()
        }
        return f
    }
})

const timerange=computed({
    get(){
        return form.start_time && form.end_time ? [form.start_time,form.end_time] : []
    },
    set(val){
        form.start_time=val[0]
        form.end_time=val[1]
    }
})
</script>

<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增 | 刷新 -->
        <ListHeader @create="openDrawer" @refresh="getData" />
        <!-- 表格区域 -->
        <el-table :data="tableData" stripe style="width:100%" v-loading="loading">
            <el-table-column prop="title" label="优惠券名称" width="350" >
                <template #default="{row}">
                    <div class="border border-dashed py-2 px-4 rounded" :class="row.statusText==='领取中' ?'active':'inactive'">{{ row.statusText }}
                        <h5 class="font-bold text-md">{{ row.name }}</h5>
                        <small>{{ row.start_time }} ~ {{ row.end_time }}</small>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="statusText" label="状态" width="100"  align="center"/>
            <el-table-column prop="statusText" label="优惠" align="center">
                <template #default="{row}">
                    {{ row.type==0 ? '满减' : '折扣' }}{{ row.type ? ('￥'+row.value) : (row.value+'折') }}
                </template>
            </el-table-column>
            <el-table-column prop="total" label="发放数量" align="center" />
            <el-table-column prop="used" label="已使用" align="center" />
            <el-table-column label="操作">
                <template #default="scope">
                    <div>
                        <el-button v-if="scope.row.statusText==='未开始'" size="small" text type="primary" @click="handleEdit(scope.row)">修改</el-button>
                        <el-popconfirm v-if="scope.row.statusText!='领取中'" title="是否要删除此优惠券?" confirm-button-text="确认" cancel-button-text="取消"
                            @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button text type="primary" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                        <el-popconfirm v-if="scope.row.statusText==='领取中'" title="是否要让此优惠券失效?" confirm-button-text="失效" cancel-button-text="取消"
                            @confirm="handleStatusChange(0,scope.row)">
                            <template #reference>
                                <el-button type="danger" size="small">失效</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="flex items-center justify-center mt-5">
            <el-pagination @current-change="getData" :page-size="limit" layout=" prev, pager, next" :total="total"
                :current-page="currentPage" background />
        </div>
        <!-- 抽屉 -->
        <FormDrawer :title="drawerTitle" ref="formDrawerRef" @submit="handeSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item prop="title" label="优惠券名称">
                    <el-input v-model="form.name" placeholder="优惠券名称" style="width:50%"></el-input>
                </el-form-item>
                <el-form-item prop="type" label="类型">
                    <el-radio-group v-model="form.type">
                        <el-radio :label="0">满减</el-radio>
                        <el-radio :label="1">折扣</el-radio>
                    </el-radio-group>
                    
                </el-form-item>
                <el-form-item prop="value" label="面值">
                    <el-input v-model="form.value" placeholder="面值" style="width:50%">
                        <template #append>
                            {{ form.type ? '折':'元' }}
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="total" label="发行量">
                    <el-input-number v-model="form.total"  placeholder="发行量"   style="width:50%" :min="0" :max="10000"></el-input-number>
                </el-form-item>
                <el-form-item prop="min_price" label="最低使用价格">
                    <el-input type="number" v-model="form.min_price"  placeholder="最低使用价格"   style="width:50%" ></el-input>
                </el-form-item>
                <el-form-item prop="order" label="排序">
                    <el-input-number :min="0" :max="1000" v-model="form.order" placeholder="排序" style="width:50%"></el-input-number>
                </el-form-item>
                <el-form-item label="活动时间">
                    <el-date-picker
                    :editable="false"
                        v-model="timerange"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        type="datetimerange"
                        range-separator="To"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                    />
                </el-form-item>
                <el-form-item prop="desc" label="描述">
                    <el-input type="textarea" v-model="form.desc" placeholder="描述" style="width:50%"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
</template>

<style scoped>
.active{
    @apply border-rose-200 bg-rose-50 text-red-400;
}
.inactive{
    @apply border-gray-200 bg-gray-50 text-gray-400;
}
</style>