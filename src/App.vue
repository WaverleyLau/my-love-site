<template>
  <div class="app">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="navbar-container">
        <router-link to="/" class="navbar-brand">
          📸 电子相册
        </router-link>
        <div class="navbar-nav">
          <router-link
            to="/"
            class="nav-link"
            :class="{ active: $route.name === 'Home' }"
          >
            主页
          </router-link>
          <router-link
            to="/grid"
            class="nav-link"
            :class="{ active: $route.name === 'Grid' }"
          >
            图片平铺
          </router-link>
          <router-link
            to="/timeline"
            class="nav-link"
            :class="{ active: $route.name === 'Timeline' }"
          >
            时间线
          </router-link>
        </div>
        
        <!-- 主题切换器 -->
        <div class="theme-container">
          <ThemeSwitcher />
        </div>
      </div>
    </nav>

    <!-- 路由视图 -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// App.vue 现在作为布局容器，路由视图会根据当前路由显示对应的组件
import ThemeSwitcher from './components/ThemeSwitcher.vue'
</script>

<style scoped>
.app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
}

/* 导航栏样式 */
.navbar {
  background-color: var(--color-backgroundNavbar);
  box-shadow: 0 2px 8px var(--color-shadowColor);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.navbar-brand {
  color: var(--color-textPrimary);
  font-size: 1.3rem;
  font-weight: 700;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.navbar-nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: var(--color-textDescription);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--color-textPrimary);
}

.nav-link.active {
  color: var(--color-accentPrimary);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-accentPrimary);
  border-radius: 2px;
}

/* 主题切换器容器 */
.theme-container {
  display: flex;
  align-items: center;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 1rem;
  }

  .navbar-brand {
    font-size: 1.1rem;
  }

  .navbar-nav {
    gap: 1rem;
  }

  .nav-link {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .navbar-container {
    padding: 0 0.5rem;
  }

  .navbar-brand {
    font-size: 1rem;
  }

  .navbar-nav {
    gap: 0.8rem;
  }
}
</style>