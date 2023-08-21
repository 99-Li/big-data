<script setup>
// 中英文
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// import en from 'element-plus/dist/locale/en.mjs'
</script>

<template>
  <div>
    <!-- App.vue只需要留一个路由出口 router-view即可 -->
    <el-config-provider :locale="zhCn">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<style scoped></style>
