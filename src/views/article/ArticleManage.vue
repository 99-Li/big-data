<!-- 文章分类 -->
<script setup>
import PageContainer from '@/components/PageContainer.vue'
</script>
<template>
  <PageContainer title="文章管理">
    <template #extra>
      <el-button type="primary" plain>添加文章</el-button>
    </template>
    主体部分，是表格 + 分页
  </PageContainer>
</template>

<style lang="scss" scoped></style>
