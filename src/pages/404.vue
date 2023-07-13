<template>
    <el-result
        icon="success"
        title="404"
        sub-title="你找的页面不存在~"
      >
        <template #extra>
          <el-button type="primary" @click="$router.push('/')">Back</el-button>
        </template>
      </el-result>
</template>