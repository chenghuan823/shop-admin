<script setup>
import {ref} from 'vue'
import {getGoodsList,updateGoodsStatus,createGoods,updateGoods,deleteGoods} from '~/api/goods'
import {getCategoryList} from '~/api/category'
import FormDrawer from '~/components/FormDrawer.vue'
import ListHeader from '~/components/ListHeader.vue'
import ChooseImage from '~/components/ChooseImage.vue'
import {useInitTable,useInitForm} from '~/composables/useCommon'
import Search from '~/components/Search.vue'
import SearchItem from '~/components/SearchItem.vue'

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
    handleSelectionChange,
    multipleTableRef,
    handleMutiDelete,
    handleMutiStatusChange
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
        "title":null,	 		
        "category_id":null,
        "cover":null,
        "desc":null, 
        "unit":"件",
        "stock":100,
        "min_stock":10,
        "status":1,
        "stock_display":1,
        "min_price":0,
        "min_oprice":0
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
//商品分类
const category_list=ref([])

getCategoryList().then(res=>{
    category_list.value=res
})

const showSearch=ref(false)
</script>

<template>
    <div>
        <el-tabs v-model="searchForm.tab" @tab-change="getData">
            <el-tab-pane v-for="(item,index) in tabbars" :label="item.name" :key="index" :name="item.key"></el-tab-pane>
        </el-tabs>
        <el-card shadow="never" class="border-0">
        <!-- 搜索 -->
        <Search :searchForm="searchForm" @search="getData" @reset="resetSearchForm">
            <SearchItem label="关键词" >
                <el-input v-model="searchForm.title" placeholder="商品名称" clearable></el-input>
            </SearchItem>
            <template #show>
                <SearchItem label="商品分类">
                    <el-select v-model="searchForm.category_id"  placeholder="请选择商品分类" clearable>
                        <el-option v-for="item in category_list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </SearchItem>
            </template>
        </Search>
        <!-- 新增|刷新 -->
        <ListHeader layout="create,delete,refresh" @create="openDrawer" @refresh="getData" @delete="handleMutiDelete" >
            <el-button v-if="searchForm.tab=='all'||searchForm.tab=='off'" size="small" @click="handleMutiStatusChange(1)">上架</el-button>
            <el-button v-if="searchForm.tab=='all'||searchForm.tab=='saling'" size="small" @click="handleMutiStatusChange(0)">下架</el-button>
        </ListHeader>
        <!-- 表格区域 -->
        <el-table ref="multipleTableRef" @selection-change="handleSelectionChange" :data="tableData" stripe style="width:100%" v-loading="loading">
            <el-table-column type="selection" width="55" />

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
            <el-table-column label="总库存"  prop="stock" align="center"/> 
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
                <el-form-item prop="title" label="商品名称">
                    <el-input v-model="form.title" placeholder="请输入商品名称，不能超过60个字符"></el-input>
                </el-form-item>
                <el-form-item prop="cover" label="封面">
                    <ChooseImage v-model="form.cover"/>
                </el-form-item>
                <el-form-item prop="category_id" label="商品分类">
                    <el-select v-model="form.category_id" placeholder="请选择商品分类">
                        <el-option v-for="item in category_list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="desc" label="商品描述">
                    <el-input v-model="form.desc" type="textarea" placeholder="选填，商品卖点"></el-input>
                </el-form-item>
                <el-form-item prop="unit" label="商品单位">
                    <el-input v-model="form.unit" style="width:50%" placeholder="请选择商品单位"></el-input>
                </el-form-item>
                <el-form-item prop="stock" label="总库存">
                    <el-input v-model="form.stock" style="width:40%" type="number">
                        <template #append>件</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="min_stock" label="库存预警">
                    <el-input v-model="form.min_stock" style="width:40%" type="number">
                        <template #append>件</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="min_price" label="最低销售价">
                    <el-input v-model="form.min_price" style="width:40%" type="number">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="min_oprice" label="最低原价">
                    <el-input v-model="form.min_oprice" style="width:40%" type="number">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="stock_display" label="库存显示">
                    <el-radio-group v-model="form.stock_display" size="small">
                        <el-radio :label="0" border>是</el-radio>
                        <el-radio :label="1" border>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="status" label="是否上架">
                    <el-radio-group v-model="form.status" size="small">
                        <el-radio :label="0" border>放入仓库</el-radio>
                        <el-radio :label="1" border>立即上架</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
    </div>
</template>

<style scoped>

</style>