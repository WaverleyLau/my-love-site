import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import GridPage from '../components/GridPage.vue'
import TimelinePage from '../components/TimelinePage.vue'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: {
      title: '电子相册 - 主页'
    }
  },
  {
    path: '/grid',
    name: 'Grid',
    component: GridPage,
    meta: {
      title: '电子相册 - 图片平铺'
    }
  },
  {
    path: '/timeline',
    name: 'Timeline',
    component: TimelinePage,
    meta: {
      title: '电子相册 - 时间线'
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 导航守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title as string || '电子相册'
  next()
})

export default router