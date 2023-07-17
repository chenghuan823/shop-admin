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
        <el-button class="ml-auto px-1" text type="primary" size="small" @click="$emit('edit')">
            <el-icon :size="12"><Edit/></el-icon>
        </el-button>    
        <el-button class="px-1" text type="primary" size="small" @click="$emit('delete')">
            <el-icon :size="12"><close/></el-icon>
        </el-button>    
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