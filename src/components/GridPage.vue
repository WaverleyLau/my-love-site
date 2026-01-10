<template>
  <div class="grid-page">
    <div class="page-header">
      <h1>图片平铺展示</h1>
      <p class="page-description">共 {{ photos.length }} 张照片</p>
    </div>

    <!-- 图片网格 -->
    <div class="photo-grid">
      <div
        v-for="(photo, index) in photos"
        :key="index"
        class="photo-item"
        @click="openPhoto(index)"
      >
        <div class="photo-wrapper">
          <img
            :src="photo.url"
            :alt="photo.title"
            :title="photo.title"
            class="photo-img"
            loading="lazy"
          />
          <div class="photo-overlay">
            <h3 class="photo-title">{{ photo.title }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览模态框 -->
    <div v-if="selectedIndex !== null" class="modal-overlay" @click="closePhoto">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closePhoto" aria-label="关闭预览">&times;</button>
        
        <div class="modal-header">
          <h2>{{ photos[selectedIndex].title }}</h2>
          <p>{{ photos[selectedIndex].description }}</p>
        </div>

        <div class="modal-body">
          <button
            class="nav-btn prev-btn"
            @click="prevPhoto"
            :disabled="selectedIndex === 0"
            aria-label="上一张"
          >
            &lt;
          </button>
          
          <div class="preview-container">
            <img
              :src="photos[selectedIndex].url"
              :alt="photos[selectedIndex].title"
              class="preview-img"
            />
          </div>
          
          <button
            class="nav-btn next-btn"
            @click="nextPhoto"
            :disabled="selectedIndex === photos.length - 1"
            aria-label="下一张"
          >
            &gt;
          </button>
        </div>

        <div class="modal-footer">
          <span class="page-info">{{ selectedIndex + 1 }} / {{ photos.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 图片类型定义
interface Photo {
  url: string
  title: string
  description: string
}

// 图片数据
const photos: Photo[] = [
  {
    url: 'https://picsum.photos/id/1005/800/600',
    title: '美丽的风景',
    description: '这是一张美丽的风景照片，展示了大自然的壮丽。'
  },
  {
    url: 'https://picsum.photos/id/1015/800/600',
    title: '城市夜景',
    description: '繁华都市的夜景，灯火辉煌。'
  },
  {
    url: 'https://picsum.photos/id/1025/800/600',
    title: '山川河流',
    description: '壮丽的山川和蜿蜒的河流。'
  },
  {
    url: 'https://picsum.photos/id/1035/800/600',
    title: '森林深处',
    description: '神秘的森林深处，充满生机。'
  },
  {
    url: 'https://picsum.photos/id/1045/800/600',
    title: '海滩日落',
    description: '美丽的海滩日落，色彩斑斓。'
  },
  {
    url: 'https://picsum.photos/id/1055/800/600',
    title: '雪山之巅',
    description: '高耸入云的雪山之巅。'
  },
  {
    url: 'https://picsum.photos/id/1065/800/600',
    title: '湖泊倒影',
    description: '平静的湖泊，倒映着周围的景色。'
  },
  {
    url: 'https://picsum.photos/id/1075/800/600',
    title: '田野风光',
    description: '广阔的田野，生机勃勃。'
  },
  {
    url: 'https://picsum.photos/id/1085/800/600',
    title: '瀑布飞流',
    description: '壮观的瀑布，飞流直下。'
  },
  {
    url: 'https://picsum.photos/id/1095/800/600',
    title: '草原风光',
    description: '一望无际的草原，牛羊成群。'
  },
  {
    url: 'https://picsum.photos/id/1105/800/600',
    title: '沙漠奇观',
    description: '浩瀚的沙漠，沙丘起伏。'
  },
  {
    url: 'https://picsum.photos/id/1115/800/600',
    title: '热带雨林',
    description: '茂密的热带雨林，生物多样性丰富。'
  }
]

// 状态管理
const selectedIndex = ref<number | null>(null)

// 打开图片预览
const openPhoto = (index: number) => {
  selectedIndex.value = index
  document.body.style.overflow = 'hidden' // 防止背景滚动
}

// 关闭图片预览
const closePhoto = () => {
  selectedIndex.value = null
  document.body.style.overflow = '' // 恢复背景滚动
}

// 上一张图片
const prevPhoto = () => {
  if (selectedIndex.value !== null && selectedIndex.value > 0) {
    selectedIndex.value--
  }
}

// 下一张图片
const nextPhoto = () => {
  if (selectedIndex.value !== null && selectedIndex.value < photos.length - 1) {
    selectedIndex.value++
  }
}
</script>

<style scoped>
.grid-page {
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--color-background);
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 0 1rem;
}

.page-header h1 {
  color: var(--color-textPrimary);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px var(--color-shadowColor);
}

.page-description {
  color: var(--color-textDescription);
  font-size: 1.1rem;
  margin: 0;
}

/* 图片网格样式 */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.photo-item {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px var(--color-shadowColor);
  transition: all 0.3s ease;
  background-color: var(--color-backgroundCard);
  aspect-ratio: 1;
}

.photo-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px var(--color-shadowColor);
}

.photo-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.photo-item:hover .photo-img {
  transform: scale(1.1);
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 2rem 1rem 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.photo-item:hover .photo-overlay {
  transform: translateY(0);
}

.photo-title {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-modalOverlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background-color: var(--color-backgroundCard);
  border-radius: 12px;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px var(--color-shadowColor);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--color-textPrimary);
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  z-index: 10;
}

.close-btn:hover {
  background-color: var(--color-buttonHover);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-borderColor);
  text-align: center;
  position: relative;
}

.modal-header h2 {
  margin: 0 0 0.5rem 0;
  color: var(--color-textPrimary);
  font-size: 1.5rem;
}

.modal-header p {
  margin: 0;
  color: var(--color-textDescription);
  font-size: 1rem;
}

.modal-body {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  flex: 1;
  overflow: hidden;
  position: relative;
}

.preview-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 60vh;
  overflow: hidden;
}

.preview-img {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
  border-radius: 8px;
}

.nav-btn {
  background-color: var(--color-buttonHover);
  border: 1px solid var(--color-borderColor);
  color: var(--color-textPrimary);
  font-size: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 1rem;
  transition: all 0.2s ease;
  user-select: none;
}

.nav-btn:hover:not(:disabled) {
  background-color: var(--color-accentLight);
  transform: scale(1.1);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-borderColor);
  text-align: center;
}

.page-info {
  color: var(--color-textDescription);
  font-size: 1rem;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .photo-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.2rem;
  }
}

@media (max-width: 768px) {
  .grid-page {
    padding: 1.5rem 1rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .photo-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
  }

  .modal-body {
    flex-direction: column;
  }

  .nav-btn {
    margin: 0.5rem;
  }

  .preview-img {
    max-height: 50vh;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.8rem;
  }

  .photo-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.8rem;
  }

  .photo-title {
    font-size: 0.9rem;
  }
}
</style>