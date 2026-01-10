<template>
  <div class="timeline-page">
    <div class="page-header">
      <h1>图片时间线</h1>
      <p class="page-description">按时间顺序查看照片</p>
    </div>

    <!-- 时间线主体 -->
    <div class="timeline-container">
      <!-- 时间线年分组 -->
      <div
        v-for="(yearGroup, yearIndex) in groupedPhotos"
        :key="yearIndex"
        class="year-group"
      >
        <div class="year-header">{{ yearGroup.year }}</div>
        
        <!-- 时间线内容 -->
        <div class="timeline">
          <div
            v-for="(photo, index) in yearGroup.photos"
            :key="index"
            class="timeline-item"
            :class="{ 'timeline-item-right': index % 2 === 1 }"
            @click="openPhoto(yearGroup.photos.indexOf(photo) + getOffset(yearGroup.year))"
          >
            <div class="timeline-content">
              <div class="timeline-date">{{ formatDate(photo.date) }}</div>
              <div class="timeline-photo-wrapper">
                <img
                  :src="photo.url"
                  :alt="photo.title"
                  :title="photo.title"
                  class="timeline-photo"
                  loading="lazy"
                />
              </div>
              <h3 class="timeline-title">{{ photo.title }}</h3>
              <p class="timeline-description">{{ photo.description }}</p>
            </div>
            <div class="timeline-dot"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览模态框 -->
    <div v-if="selectedIndex !== null" class="modal-overlay" @click="closePhoto">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closePhoto" aria-label="关闭预览">&times;</button>
        
        <div class="modal-header">
          <h2>{{ timelinePhotos[selectedIndex].title }}</h2>
          <p>{{ formatDate(timelinePhotos[selectedIndex].date) }} | {{ timelinePhotos[selectedIndex].description }}</p>
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
              :src="timelinePhotos[selectedIndex].url"
              :alt="timelinePhotos[selectedIndex].title"
              class="preview-img"
            />
          </div>
          
          <button
            class="nav-btn next-btn"
            @click="nextPhoto"
            :disabled="selectedIndex === timelinePhotos.length - 1"
            aria-label="下一张"
          >
            &gt;
          </button>
        </div>

        <div class="modal-footer">
          <span class="page-info">{{ selectedIndex + 1 }} / {{ timelinePhotos.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 图片类型定义
interface Photo {
  url: string
  title: string
  description: string
}

// 时间线图片类型定义
export interface TimelinePhoto extends Photo {
  date: string // ISO 日期格式 YYYY-MM-DD
}

// 按年份分组的照片类型
interface YearGroup {
  year: string
  photos: TimelinePhoto[]
}

// 时间线图片数据
const timelinePhotos: TimelinePhoto[] = [
  {
    url: 'https://picsum.photos/id/1005/800/600',
    title: '美丽的风景',
    description: '这是一张美丽的风景照片，展示了大自然的壮丽。',
    date: '2025-12-15'
  },
  {
    url: 'https://picsum.photos/id/1015/800/600',
    title: '城市夜景',
    description: '繁华都市的夜景，灯火辉煌。',
    date: '2025-11-20'
  },
  {
    url: 'https://picsum.photos/id/1025/800/600',
    title: '山川河流',
    description: '壮丽的山川和蜿蜒的河流。',
    date: '2025-10-10'
  },
  {
    url: 'https://picsum.photos/id/1035/800/600',
    title: '森林深处',
    description: '神秘的森林深处，充满生机。',
    date: '2025-09-05'
  },
  {
    url: 'https://picsum.photos/id/1045/800/600',
    title: '海滩日落',
    description: '美丽的海滩日落，色彩斑斓。',
    date: '2025-08-18'
  },
  {
    url: 'https://picsum.photos/id/1055/800/600',
    title: '雪山之巅',
    description: '高耸入云的雪山之巅。',
    date: '2025-07-22'
  },
  {
    url: 'https://picsum.photos/id/1065/800/600',
    title: '湖泊倒影',
    description: '平静的湖泊，倒映着周围的景色。',
    date: '2025-06-30'
  },
  {
    url: 'https://picsum.photos/id/1075/800/600',
    title: '田野风光',
    description: '广阔的田野，生机勃勃。',
    date: '2025-05-15'
  },
  {
    url: 'https://picsum.photos/id/1085/800/600',
    title: '瀑布飞流',
    description: '壮观的瀑布，飞流直下。',
    date: '2025-04-10'
  },
  {
    url: 'https://picsum.photos/id/1095/800/600',
    title: '草原风光',
    description: '一望无际的草原，牛羊成群。',
    date: '2025-03-25'
  },
  {
    url: 'https://picsum.photos/id/1105/800/600',
    title: '沙漠奇观',
    description: '浩瀚的沙漠，沙丘起伏。',
    date: '2025-02-14'
  },
  {
    url: 'https://picsum.photos/id/1115/800/600',
    title: '热带雨林',
    description: '茂密的热带雨林，生物多样性丰富。',
    date: '2025-01-05'
  }
]

// 按年份分组照片
const groupedPhotos = computed(() => {
  const sortedPhotos = [...timelinePhotos].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  const groups: YearGroup[] = []
  
  sortedPhotos.forEach(photo => {
    const year = new Date(photo.date).getFullYear().toString()
    const existingGroup = groups.find(group => group.year === year)
    
    if (existingGroup) {
      existingGroup.photos.push(photo)
    } else {
      groups.push({
        year,
        photos: [photo]
      })
    }
  })
  
  return groups
})

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
  if (selectedIndex.value !== null && selectedIndex.value < timelinePhotos.length - 1) {
    selectedIndex.value++
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 获取年份偏移量
const getOffset = (year: string) => {
  let offset = 0
  groupedPhotos.value.forEach(group => {
    if (group.year === year) return
    offset += group.photos.length
  })
  return offset
}
</script>

<style scoped>
.timeline-page {
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

/* 时间线容器 */
.timeline-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 年份分组 */
.year-group {
  margin-bottom: 3rem;
}

.year-header {
  color: var(--color-accentPrimary);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  padding-left: 1rem;
  position: relative;
}

.year-header::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 100%;
  background-color: var(--color-accentPrimary);
}

/* 时间线 */
.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: var(--color-timelineLine);
}

/* 时间线项 */
.timeline-item {
  position: relative;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: transform 0.3s ease;
  width: calc(50% - 1rem);
}

.timeline-item:hover {
  transform: translateY(-5px);
}

/* 交替布局 */
.timeline-item-right {
  margin-left: calc(50% + 1rem);
}

.timeline-content {
  background-color: var(--color-backgroundCard);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px var(--color-shadowColor);
  transition: box-shadow 0.3s ease;
}

.timeline-item:hover .timeline-content {
  box-shadow: 0 8px 20px var(--color-shadowColor);
}

/* 时间点 */
.timeline-dot {
  position: absolute;
  left: calc(-2rem - 6px);
  top: 1.5rem;
  width: 14px;
  height: 14px;
  background-color: var(--color-timelineDot);
  border-radius: 50%;
  border: 3px solid var(--color-background);
  z-index: 1;
  transition: transform 0.3s ease;
}

.timeline-item-right .timeline-dot {
  left: auto;
  right: calc(-2rem - 6px);
}

.timeline-item:hover .timeline-dot {
  transform: scale(1.3);
}

/* 日期 */
.timeline-date {
  color: var(--color-accentPrimary);
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background-color: var(--color-accentLight);
  border-radius: 12px;
}

/* 图片 */
.timeline-photo-wrapper {
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
}

.timeline-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.timeline-item:hover .timeline-photo {
  transform: scale(1.05);
}

/* 标题和描述 */
.timeline-title {
  color: var(--color-textPrimary);
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.timeline-description {
  color: var(--color-textDescription);
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
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
  .timeline-item,
  .timeline-item-right {
    width: 100%;
    margin-left: 0;
  }

  .timeline-item-right {
    margin-left: 0;
  }

  .timeline-dot,
  .timeline-item-right .timeline-dot {
    left: calc(-2rem - 6px);
    right: auto;
  }
}

@media (max-width: 768px) {
  .timeline-page {
    padding: 1.5rem 1rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .year-header {
    font-size: 1.5rem;
  }

  .timeline {
    padding-left: 1.5rem;
  }

  .timeline-dot {
    left: calc(-1.5rem - 5px);
    width: 12px;
    height: 12px;
  }

  .timeline-content {
    padding: 1.2rem;
  }

  .timeline-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .page-header {
    margin-bottom: 2rem;
  }

  .year-group {
    margin-bottom: 2rem;
  }

  .timeline-item {
    margin-bottom: 1.5rem;
  }

  .timeline-content {
    padding: 1rem;
  }

  .timeline-date {
    font-size: 0.8rem;
  }

  .timeline-description {
    display: none;
  }
}
</style>