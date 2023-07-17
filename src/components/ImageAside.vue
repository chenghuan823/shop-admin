<script setup>
import AsideList from '~/components/AsideList.vue'

</script>

<template>
    <el-aside  width="220px" class="image-aside">
        <div class="top">
            <AsideList active>化妆品</AsideList>
            <AsideList>智能家电</AsideList>
        </div>
        <div class="bottom">
            分页区域
        </div>
    </el-aside>
</template>

<style scoped>

.image-aside{
    border-right: 1px solid #eee;
    position: relative;
}
.image-aside .top{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 50px;
    left: 0;
    overflow-y: auto;
}
.image-aside .bottom{
@apply flex items-center justify-center ;
position: absolute;
bottom: 0;
height: 50px;
left: 0;
right: 0;
}
</style>
