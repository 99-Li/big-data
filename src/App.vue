<script setup>
import { useRouter, useRoute } from 'vue-router'
import demoTest from './components/demoTest.vue'

import { useUserStore, useCountStore } from '@/stores'
const router = useRouter()
const route = useRoute()

console.log(router, route)

const goList = () => {
  router.push('/list')
}

const userStore = useUserStore()
const countStore = useCountStore()
</script>

<template>
  <div>
    <hr />
    <router-view></router-view>
    <hr />
    <hr />
    <hr />

    我是APP
    <demoTest></demoTest>
    <el-button type="primary" plain @click="$router.push('/home')"
      >跳转home页</el-button
    >
    <el-button type="success" round @click="goList">跳转list页</el-button>

    <p>{{ userStore.token }}</p>
    <el-button @click="userStore.setToken">登录</el-button>
    <el-button @click="userStore.removeToken">退出</el-button>
    <hr />
    <p>{{ countStore.count }}</p>
    <el-button @click="countStore.add(2)">加2</el-button>
  </div>
</template>

<style scoped></style>
