import { createRouter, createWebHistory } from 'vue-router'

// createRouter 创建路由实例
// 配置 history 模式
// 1. history模式： createWebHistory 地址栏不带#
// 2. hash模式：    createWebHashHistory  地址栏带#
// console.log(import.meta.env.DEV)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') }, // 登录页
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'), // 首页架子
      redirect: '/article/manage',
      children: [
        {
          // 文章管理
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          // 文章分类
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          // 基本资料
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          // 更换头像
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          // 重置密码
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

export default router
