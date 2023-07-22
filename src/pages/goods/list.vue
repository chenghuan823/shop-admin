<script setup>
import {ref} from 'vue'
import {getGoodsList,updateGoodsStatus,createGoods,updateGoods,deleteGoods} from '~/api/goods'
import FormDrawer from '~/components/FormDrawer.vue'
import ListHeader from '~/components/ListHeader.vue'
import ChooseImage from '~/components/ChooseImage.vue'
import {useInitTable,useInitForm} from '~/composables/useCommon'
const roles=ref([])

const {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange
}= useInitTable({
    searchForm:{
        title:'',
        tab:'all',
        category_id:null
    },
    getList:getGoodsList,
    onGetListSuccess:(res)=>{
        total.value=res.totalCount
        tableData.value=res.list.map(o=>{
            o.statusLoading=false
            return o
        })
        roles.value=res.roles
    },
    delete:deleteGoods,
    updateStatus:updateGoodsStatus
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
}=useInitForm({
    form:{
        username: "",
        password: "",
        role_id: null,
        status: 1,
        avatar: "",
    },
    getData,
    update:updateGoods,
    create:createGoods
})
//all全部，checking审核中，saling出售中，off已下架，min_stock库存预警，delete回收站
const tabbars=[
    {
        key:'all',
        name:'全部'
    },{
        key:'checking',
        name:'审核中'
    },{
        key:'saling',
        name:'出售中'
    },{
        key:'off',
        name:'已下架'
    },{
        key:'min_stock',
        name:'库存预警'
    },{
        key:'delete',
        name:'回收站'
    },
]
</script>

<template>
    <div>
        <el-tabs v-model="searchForm.tab" @tab-change="getData">
            <el-tab-pane v-for="(item,index) in tabbars" :label="item.name" :key="index" :name="item.key"></el-tab-pane>
        </el-tabs>
        <el-card shadow="never" class="border-0">
        <!-- 搜索 -->
        <el-form :model="searchForm" label-width="80px" class="mb-3" size="small">
            <el-row :gutter="20">
                <el-col :span="8" :offset="0">
                    <el-form-item label="关键词">
                        <el-input v-model="searchForm.title" placeholder="商品名称" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" :offset="8">
                        <div class="flex items-center justify-end">
                            <el-button type="primary" @click="getData()">搜索</el-button>
                            <el-button @click="resetSearchForm">重置</el-button>
                        </div>
                </el-col>
            </el-row>
        </el-form>
        <ListHeader @create="openDrawer" @refresh="getData" />
        
        <!-- 表格区域 -->
        <el-table :data="tableData" stripe style="width:100%" v-loading="loading">
            <el-table-column label="商品" width="300" >
                <template #default="{row}">
                    <div class="flex items-center">
                        <el-image class="mr-3 rounded" :src="row.cover" style="height: 50px;width: 50px;" fit="cover" :lazy="true"></el-image>
                        <div class="flex-1">
                            <p>{{ row.title }}</p>
                            <div>
                                <span class="text-rose-500">￥{{ row.min_price }}</span>
                                <el-divider direction="vertical"></el-divider>
                                <span class="text-gray-500 text-xs">￥{{ row.min_oprice }}</span>
                            </div>
                            <p class="text-gray-400 text-xs mb-1">
                                分类:{{ row.category?.name || '未分类' }}
                            </p>
                            <p class="text-gray-400 text-xs mb-0">
                                创建时间:{{ row.create_time }}
                            </p>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="实际销量" width="80" prop="sale_count"  align="center" >
            </el-table-column>
            <el-table-column label="商品状态" width="100"  align="center" >
                <template #default="{row}">
                    <el-tag :type="row.status?'success':'danger'" size="small" >{{ row.status?'上架':'下架' }}</el-tag>
                </template> 
            </el-table-column>
            <el-table-column v-if="searchForm.tab!='delete'" label="审核状态" width="120"  align="center" >
                <template #default="{row}">
                    <div v-if="row.ischeck==0">
                        <el-button type="success" size="small" plain>审核通过</el-button>
                        <el-button class="mt-2 !ml-0" type="danger" size="small" plain>审核拒绝</el-button>
                    </div>
                    <span v-else>{{ row.ischeck==1?'通过': '拒绝'}}</span>
                </template> 
            </el-table-column>
            <el-table-column label="总库存" width="90" prop="stock" align="center"/> 
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <div v-if="searchForm.tab!='delete'">
                        <el-button class="px-1" size="small" text type="primary" @click="handleEdit(scope.row)"
                        >修改</el-button>
                        <el-button class="px-1" size="small" text type="primary">商品规格</el-button>
                        <el-button class="px-1" size="small" text type="primary">设置轮播图</el-button>
                        <el-button class="px-1" size="small" text type="primary">商品详情</el-button>
                        <el-popconfirm title="是否要删除此管理员?" confirm-button-text="确认" cancel-button-text="取消" @confirm="handleDelete(scope.row.id)" >
                            <template #reference>
                                <el-button text type="primary" size="small">删除</el-button>  
                            </template>
                        </el-popconfirm>
                    </div>
                    <span v-else>暂无操作</span>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="flex items-center justify-center mt-5">
            <el-pagination
                @current-change="getData" :page-size="limit" layout=" prev, pager, next"
                :total="total" :current-page="currentPage" background/>
        </div>
        <!-- 抽屉 -->
        <FormDrawer :title="drawerTitle" ref="formDrawerRef" @submit="handeSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item prop="username" label="用户名">
                    <el-input v-model="form.username" placeholder=""></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input v-model="form.password" type="password" :rows="5"></el-input>
                </el-form-item>
                <el-form-item prop="avator" label="头像">
                    <ChooseImage v-model="form.avatar"/>
                </el-form-item>
                <el-form-item prop="role_id" label="所属角色">
                    <el-select v-model="form.role_id" value-key="" placeholder="选择所属角色">
                        <el-option v-for="item in roles"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="status" label="状态">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
    </div>
</template>

<style scoped>

</style>