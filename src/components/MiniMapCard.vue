<template>
  <section class="mini-map" @click="handleClick">
    <div class="mini-map__image">
      <img :src="mapBackgroundSrc" alt="缩略图底图" />
      <div class="mini-map__shade"></div>
      <div
        class="mini-map__frame"
        :style="{
          width: `${frameWidth}%`,
          height: `${frameHeight}%`,
          left: `${frameLeft}%`,
          top: `${frameTop}%`,
        }"
      ></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import mapBackgroundSrc from '../assets/map-resources/world.topo.bathy.200401.3x5400x2700.jpg'
import type { MapViewportState } from '../types/dashboard'

const props = defineProps<{
  viewport: MapViewportState
}>()

const emit = defineEmits<{
  navigate: [ratioX: number, ratioY: number]
}>()

const frameWidth = computed(() => Math.max(18, 30 / props.viewport.scale))
const frameHeight = computed(() => Math.max(14, 24 / props.viewport.scale))
const frameLeft = computed(() => {
  const max = 100 - frameWidth.value - 4
  const offsetRatio = props.viewport.offsetX / 16
  return Math.min(max, Math.max(4, 50 - frameWidth.value / 2 - offsetRatio))
})
const frameTop = computed(() => {
  const max = 100 - frameHeight.value - 4
  const offsetRatio = props.viewport.offsetY / 14
  return Math.min(max, Math.max(4, 50 - frameHeight.value / 2 - offsetRatio))
})

function handleClick(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const ratioX = (event.clientX - rect.left) / rect.width
  const ratioY = (event.clientY - rect.top) / rect.height
  emit('navigate', ratioX, ratioY)
}
</script>

<style scoped lang="scss">
.mini-map {
  width: 96px;
  height: 70px;
  padding: 2px;
  border: 2px solid #7fe9ff;
  border-radius: 4px;
  background: rgba(10, 28, 66, 0.94);
  box-shadow: 0 0 18px rgba(127, 233, 255, 0.24);
  cursor: pointer;
}

.mini-map__image {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.mini-map__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(1.18) brightness(0.88);
}

.mini-map__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(13, 28, 63, 0.1), rgba(4, 14, 36, 0.36));
}

.mini-map__frame {
  position: absolute;
  border: 1px solid #98f1ff;
  box-shadow: 0 0 10px rgba(152, 241, 255, 0.4);
}
</style>
