<template>
  <div class="image-slider">
    <!-- 轮播容器 -->
    <div class="slider-container" ref="sliderContainer">
      <div
        class="slides-wrapper"
        :style="{
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: `transform ${transitionDuration}ms ease-in-out`
        }"
      >
        <div
          v-for="(photo, index) in photos"
          :key="index"
          class="slide"
        >
          <div class="slide-content">
            <img
              :src="photo.url"
              :alt="photo.title"
              class="slide-image"
              loading="lazy"
            />
            <div class="slide-overlay">
              <h2 class="slide-title">{{ photo.title }}</h2>
              <p class="slide-description">{{ photo.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航按钮 -->
    <button
      class="nav-button prev-button"
      @click="prevSlide"
      aria-label="上一张"
    >
      &lt;
    </button>
    <button
      class="nav-button next-button"
      @click="nextSlide"
      aria-label="下一张"
    >
      &gt;
    </button>

    <!-- 指示器 -->
    <div class="dots-container">
      <button
        v-for="(photo, index) in photos"
        :key="index"
        class="dot"
        :class="{ active: index === currentSlide }"
        @click="goToSlide(index)"
        :aria-label="`前往第 ${index + 1} 张`"
      ></button>
    </div>

    <!-- 播放/暂停按钮 -->
    <button
      class="play-pause-button"
      @click="togglePlay"
      :aria-label="isPlaying ? '暂停轮播' : '开始轮播'"
    >
      {{ isPlaying ? '⏸' : '▶' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, PropType } from 'vue'

// 图片类型定义
interface Photo {
  url: string
  title: string
  description: string
}

// Props
const props = defineProps({
  photos: {
    type: Array as PropType<Photo[]>,
    required: true
  },
  interval: {
    type: Number,
    default: 3000
  },
  transitionDuration: {
    type: Number,
    default: 500
  }
})

// 状态管理
const currentSlide = ref(0)
const isPlaying = ref(true)
const sliderContainer = ref<HTMLElement | null>(null)
let timer: number | null = null

// 自动轮播
const startAutoPlay = () => {
  if (timer) clearInterval(timer)
  timer = window.setInterval(() => {
    nextSlide()
  }, props.interval)
}

// 暂停自动轮播
const stopAutoPlay = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// 切换播放/暂停
const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    startAutoPlay()
  } else {
    stopAutoPlay()
  }
}

// 下一张
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % props.photos.length
}

// 上一张
const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + props.photos.length) % props.photos.length
}

// 跳转到指定幻灯片
const goToSlide = (index: number) => {
  currentSlide.value = index
}

// 生命周期钩子
onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.image-slider {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.slider-container {
  width: 100%;
  height: 60vh;
  max-height: 600px;
  overflow: hidden;
  position: relative;
}

.slides-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
}

.slide {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  position: relative;
}

.slide-content {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.slide:hover .slide-image {
  transform: scale(1.05);
}

.slide-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: #ffffff;
  text-align: left;
}

.slide-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.slide-description {
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* 导航按钮 */
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  color: #ffffff;
  font-size: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  user-select: none;
  z-index: 10;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

.prev-button {
  left: 1rem;
}

.next-button {
  right: 1rem;
}

/* 指示器 */
.dots-container {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.dot:hover {
  background-color: rgba(255, 255, 255, 0.4);
  transform: scale(1.2);
}

.dot.active {
  background-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.3);
}

/* 播放/暂停按钮 */
.play-pause-button {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  user-select: none;
  z-index: 10;
}

.play-pause-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .slider-container {
    height: 50vh;
  }

  .slide-title {
    font-size: 1.5rem;
  }

  .slide-description {
    font-size: 0.9rem;
  }

  .nav-button {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }

  .dot {
    width: 10px;
    height: 10px;
  }
}

@media (max-width: 480px) {
  .slider-container {
    height: 40vh;
  }

  .slide-overlay {
    padding: 1rem;
  }

  .slide-title {
    font-size: 1.2rem;
  }

  .slide-description {
    font-size: 0.8rem;
    display: none;
  }

  .nav-button {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }

  .prev-button {
    left: 0.5rem;
  }

  .next-button {
    right: 0.5rem;
  }

  .dots-container {
    gap: 0.3rem;
  }
}
</style>