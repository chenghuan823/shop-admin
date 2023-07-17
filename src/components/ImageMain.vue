<script setup>

</script>

<template>
    <el-main class="image-main">
        <div class="top">
            <div v-for="i in 100" :key="i">{{ i }}</div>
        </div>
        <div class="bottom">
            分页区域
        </div>
    </el-main>
</template>

<style scoped>
.image-main .top{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 50px;
    left: 0;
    overflow-y: auto;
}
.image-main .bottom{
@apply flex items-center justify-center ;
position: absolute;
bottom: 0;
height: 50px;
left: 0;
right: 0;
}
.image-main{
position: relative;
}
</style>
