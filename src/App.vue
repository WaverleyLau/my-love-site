<template>
  <div class="app-container">
    <h1>我的电子相册</h1>
    <PhotoAlbum />
  </div>
</template>

<script setup lang="ts">
import PhotoAlbum from './components/PhotoAlbum.vue'
</script>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
  background-color: #1a1a1a;
  text-align: center;
}

h1 {
  margin-bottom: 2rem;
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
</style>