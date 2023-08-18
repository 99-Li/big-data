import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia

// import { useUserStore } from './modules/user'
// import { useCountStore } from './modules/count'

// export { useUserStore, useCountStore }

// 下面等价于上面
export * from './modules/user' // 接收 user 模块的所有按需导出
export * from './modules/count'
