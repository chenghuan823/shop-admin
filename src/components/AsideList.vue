<script setup>
defineProps({
    active:{
        type:Boolean,
        default:false
    }

})

defineEmits(['edit','delete'])
</script>

<template>
    <div :class="{'aside-item':true,active:active}">
        <span class="truncate"><slot></slot></span>
        <el-button class="ml-auto px-1" text type="primary" size="small" @click.stop="$emit('edit')">
            <el-icon :size="12"><Edit/></el-icon>
        </el-button>  
        <el-popconfirm title="是否要删除此分类?" confirm-button-text="确认" cancel-button-text="取消" @confirm="$emit('delete')" >
            <template #reference>
                <el-button class="px-1" text type="primary" size="small" >
                    <el-icon :size="12"><close/></el-icon>
                </el-button>  
            </template>
        </el-popconfirm>
    </div>
</template>

<style scoped>
.aside-item{
    border-bottom: 1px solid #f4f4f4;
    @apply flex items-center px-3 py-2 text-sm text-gray-600 ;
    cursor: pointer;
}
.aside-item:hover{
@apply bg-blue-50;
}
.aside-item.active{
@apply bg-blue-50;

}
</style>