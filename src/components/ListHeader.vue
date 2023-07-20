<script setup>
defineEmits(['create','refresh'])
</script>

<template>
    <!-- 新增 | 刷新 -->
    <div class="flex items-center justify-between mb-4">
        <el-button type="primary" size="small" @click="$emit('create')">新增</el-button>
        <el-tooltip content="刷新数据" placement="bottom" effect="dark">
            <el-button @click="$emit('refresh')" type="primary" text>
                <el-icon :size="20"><Refresh/></el-icon>
            </el-button>
        </el-tooltip>
    </div>
</template>

<style scoped>

</style>