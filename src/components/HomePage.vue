<template>
  <div class="home-page">
    <div class="header">
      <h1>我的电子相册</h1>
      <p class="slogan">珍藏美好瞬间</p>
    </div>

    <!-- 图片轮播 -->
    <ImageSlider :photos="photos" />

    <!-- 功能介绍 -->
    <div class="features">
      <div class="feature-item">
        <div class="feature-icon">🖼️</div>
        <h3>精美轮播</h3>
        <p>自动播放的图片轮播，展示最美的瞬间</p>
      </div>
      <div class="feature-item">
        <div class="feature-icon">📱</div>
        <h3>响应式设计</h3>
        <p>适配各种设备，随时随地查看相册</p>
      </div>
      <div class="feature-item">
        <div class="feature-icon">🔍</div>
        <h3>预览功能</h3>
        <p>点击图片查看大图和详细信息</p>
      </div>
    </div>

    <!-- 跳转按钮 -->
    <div class="action-section">
      <router-link to="/grid" class="btn-primary">
        查看全部图片
      </router-link>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <p>© 2026 我的电子相册</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import ImageSlider from './ImageSlider.vue'

// 图片类型定义
interface Photo {
  url: string
  title: string
  description: string
}

// 图片数据
const photos: Photo[] = [
  {
    url: 'https://picsum.photos/id/1005/1200/600',
    title: '美丽的风景',
    description: '这是一张美丽的风景照片，展示了大自然的壮丽。'
  },
  {
    url: 'https://picsum.photos/id/1015/1200/600',
    title: '城市夜景',
    description: '繁华都市的夜景，灯火辉煌。'
  },
  {
    url: 'https://picsum.photos/id/1025/1200/600',
    title: '山川河流',
    description: '壮丽的山川和蜿蜒的河流。'
  },
  {
    url: 'https://picsum.photos/id/1035/1200/600',
    title: '森林深处',
    description: '神秘的森林深处，充满生机。'
  },
  {
    url: 'https://picsum.photos/id/1045/1200/600',
    title: '海滩日落',
    description: '美丽的海滩日落，色彩斑斓。'
  },
  {
    url: 'https://picsum.photos/id/1055/1200/600',
    title: '雪山之巅',
    description: '高耸入云的雪山之巅。'
  },
  {
    url: 'https://picsum.photos/id/1065/1200/600',
    title: '湖泊倒影',
    description: '平静的湖泊，倒映着周围的景色。'
  },
  {
    url: 'https://picsum.photos/id/1075/1200/600',
    title: '田野风光',
    description: '广阔的田野，生机勃勃。'
  },
  {
    url: 'https://picsum.photos/id/1085/1200/600',
    title: '瀑布飞流',
    description: '壮观的瀑布，飞流直下。'
  }
]
</script>

<style scoped>
.home-page {
  width: 100%;
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #ffffff;
}

.header {
  text-align: center;
  padding: 3rem 2rem 2rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.slogan {
  font-size: 1.2rem;
  color: #aaa;
  margin: 0;
}

/* 功能介绍 */
.features {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.feature-item {
  text-align: center;
  padding: 2rem;
  background-color: #2a2a2a;
  border-radius: 12px;
  width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-item h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #ffffff;
}

.feature-item p {
  color: #aaa;
  font-size: 0.9rem;
  margin: 0;
}

/* 操作区域 */
.action-section {
  text-align: center;
  padding: 2rem;
  margin-bottom: 3rem;
}

.btn-primary {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #4a9eff;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(74, 158, 255, 0.3);
}

.btn-primary:hover {
  background-color: #3a8eff;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(74, 158, 255, 0.4);
}

/* 页脚 */
.footer {
  text-align: center;
  padding: 2rem;
  background-color: #0f0f0f;
  color: #666;
  font-size: 0.9rem;
}

.footer p {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header h1 {
    font-size: 2.2rem;
  }

  .slogan {
    font-size: 1rem;
  }

  .features {
    gap: 1.5rem;
    padding: 2rem 1rem;
  }

  .feature-item {
    width: 100%;
    max-width: 300px;
    padding: 1.5rem;
  }

  .btn-primary {
    padding: 0.9rem 1.8rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 2rem 1rem 1.5rem;
  }

  .header h1 {
    font-size: 1.8rem;
  }

  .feature-icon {
    font-size: 2.5rem;
  }

  .feature-item h3 {
    font-size: 1.2rem;
  }
}
</style>