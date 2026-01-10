<template>
  <div class="theme-switcher">
    <button
      class="theme-toggle-btn"
      @click="toggleMenu"
      :aria-expanded="isMenuOpen"
      aria-haspopup="true"
      aria-label="切换主题"
    >
      {{ currentTheme.label }}
      <span class="theme-icon">🎨</span>
    </button>

    <div
      v-if="isMenuOpen"
      class="theme-menu"
      @click.stop
    >
      <div
        v-for="theme in themes"
        :key="theme.name"
        class="theme-option"
        :class="{ active: theme.name === currentTheme.name }"
        @click="selectTheme(theme)"
      >
        <div class="theme-preview">
          <div
            class="theme-color"
            :style="{
              backgroundColor: theme.colors.background,
              border: `2px solid ${theme.colors.accentPrimary}`
            }"
          ></div>
          <div
            class="theme-color"
            :style="{
              backgroundColor: theme.colors.backgroundCard,
              border: `2px solid ${theme.colors.accentPrimary}`
            }"
          ></div>
          <div
            class="theme-color"
            :style="{
              backgroundColor: theme.colors.accentPrimary,
              border: `2px solid ${theme.colors.background}`
            }"
          ></div>
        </div>
        <div class="theme-info">
          <div class="theme-label">{{ theme.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { themes, Theme, loadTheme, saveTheme } from '../theme/themes';

// 状态管理
const isMenuOpen = ref(false);
const currentThemeName = ref(loadTheme());

// 计算属性
const currentTheme = computed(() => {
  return themes.find(theme => theme.name === currentThemeName.value) || themes[0];
});

// 应用主题
const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  
  // 设置CSS变量
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
};

// 选择主题
const selectTheme = (theme: Theme) => {
  currentThemeName.value = theme.name;
  saveTheme(theme.name);
  applyTheme(theme);
  toggleMenu();
};

// 切换菜单
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// 点击外部关闭菜单
const handleClickOutside = (event: MouseEvent) => {
  const themeSwitcher = document.querySelector('.theme-switcher');
  if (themeSwitcher && !themeSwitcher.contains(event.target as Node)) {
    isMenuOpen.value = false;
  }
};

// 生命周期钩子
onMounted(() => {
  applyTheme(currentTheme.value);
  document.addEventListener('click', handleClickOutside);
});

// 清理事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// 监听主题变化
watch(currentThemeName, (newThemeName) => {
  const newTheme = themes.find(theme => theme.name === newThemeName) || themes[0];
  applyTheme(newTheme);
});
</script>

<style scoped>
.theme-switcher {
  position: relative;
  display: inline-block;
}

.theme-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-backgroundCard);
  color: var(--color-textPrimary);
  border: 1px solid var(--color-borderColor);
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px var(--color-shadowColor);
}

.theme-toggle-btn:hover {
  background-color: var(--color-buttonHover);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px var(--color-shadowColor);
}

.theme-icon {
  font-size: 1.2rem;
}

.theme-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: var(--color-backgroundCard);
  border-radius: 12px;
  box-shadow: 0 8px 25px var(--color-shadowColor);
  padding: 0.8rem;
  min-width: 250px;
  z-index: 1000;
  border: 1px solid var(--color-borderColor);
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.4rem;
}

.theme-option:last-child {
  margin-bottom: 0;
}

.theme-option:hover {
  background-color: var(--color-buttonHover);
  transform: translateX(5px);
}

.theme-option.active {
  background-color: var(--color-accentLight);
  border-left: 3px solid var(--color-accentPrimary);
}

.theme-preview {
  display: flex;
  gap: 0.3rem;
}

.theme-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.theme-info {
  flex: 1;
}

.theme-label {
  font-weight: 600;
  color: var(--color-textPrimary);
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .theme-toggle-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  .theme-icon {
    font-size: 1rem;
  }

  .theme-menu {
    min-width: 200px;
    padding: 0.6rem;
  }

  .theme-option {
    padding: 0.6rem;
  }

  .theme-color {
    width: 16px;
    height: 16px;
  }

  .theme-label {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .theme-toggle-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
  }

  .theme-menu {
    min-width: 180px;
  }

  .theme-option {
    gap: 0.5rem;
  }
}
</style>