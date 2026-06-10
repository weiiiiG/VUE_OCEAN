<template>
  <section :class="['stage', { 'is-fullscreen': viewport.isFullscreen }]">
    <div
      ref="dragLayerRef"
      class="stage__drag-layer"
      :class="{ 'is-draggable': canDrag, 'is-dragging': dragging }"
      @pointerdown="handlePointerDown"
    ></div>

    <div
      class="stage__viewport"
      :class="{ 'is-dragging': dragging }"
      :style="{
        transform: `translate(${viewport.offsetX}px, ${viewport.offsetY}px) scale(${viewport.scale})`,
      }"
    >
      <img class="stage__image" :src="mapBackgroundSrc" alt="海洋底图背景" />
      <div class="stage__shade"></div>
      <div
        v-if="filterState.showCurrent"
        class="stage__currents"
        :style="{
          '--accent': detail.mapAccent,
          '--flow-opacity': String(Math.max(0.16, filterState.intensity / 100)),
        }"
      ></div>
      <div
        v-if="filterState.showWindField"
        class="stage__wind-layer"
        :style="{
          '--wind-opacity': String(Math.max(0.12, filterState.intensity / 120)),
        }"
      ></div>
      <div class="stage__scan"></div>
      <div class="stage__focus-ring"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import mapBackgroundSrc from '../assets/map-resources/world.topo.bathy.200401.3x5400x2700.jpg'
import type { FilterState, MapViewportState, TopicDetail } from '../types/dashboard'

const props = defineProps<{
  detail: TopicDetail
  viewport: MapViewportState
  filterState: FilterState
  canDrag: boolean
}>()

const emit = defineEmits<{
  'viewport-change': [viewport: MapViewportState]
}>()

const dragLayerRef = ref<HTMLElement | null>(null)

let dragging = false
let dragStartX = 0
let dragStartY = 0
let startOffsetX = 0
let startOffsetY = 0

function clampOffset(offset: number, size: number, scale: number) {
  const max = Math.max(0, ((scale - 1) * size) / 2)
  return Math.min(max, Math.max(-max, offset))
}

function handlePointerDown(event: PointerEvent) {
  if (!props.canDrag || !dragLayerRef.value) {
    return
  }

  dragging = true
  dragStartX = event.clientX
  dragStartY = event.clientY
  startOffsetX = props.viewport.offsetX
  startOffsetY = props.viewport.offsetY
  dragLayerRef.value.setPointerCapture(event.pointerId)
  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', handlePointerUp)
}

function handlePointerMove(event: PointerEvent) {
  if (!dragging || !dragLayerRef.value) {
    return
  }

  const rect = dragLayerRef.value.getBoundingClientRect()
  const nextOffsetX = clampOffset(startOffsetX + event.clientX - dragStartX, rect.width, props.viewport.scale)
  const nextOffsetY = clampOffset(startOffsetY + event.clientY - dragStartY, rect.height, props.viewport.scale)

  emit('viewport-change', {
    ...props.viewport,
    offsetX: Math.round(nextOffsetX),
    offsetY: Math.round(nextOffsetY),
  })
}

function handlePointerUp() {
  dragging = false
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', handlePointerUp)
}

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', handlePointerUp)
})
</script>

<style scoped lang="scss">
.stage {
  position: relative;
  height: 100%;
  min-height: 594px;
  overflow: hidden;
  background: #020918;
}

.stage.is-fullscreen {
  min-height: 642px;
}

.stage__drag-layer {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: auto;
}

.stage__drag-layer.is-draggable {
  cursor: grab;
}

.stage__drag-layer.is-dragging {
  cursor: grabbing;
}

.stage__viewport {
  position: absolute;
  inset: 0;
  transform-origin: center center;
  transition: transform 200ms ease;
}

.stage__viewport.is-dragging {
  transition: none;
}

.stage__image,
.stage__shade,
.stage__currents,
.stage__wind-layer,
.stage__scan,
.stage__focus-ring {
  position: absolute;
  inset: 0;
}

.stage__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 44%;
  transform: scale(1.08);
  filter: saturate(1.22) contrast(1.05) brightness(0.84);
}

.stage__shade {
  background:
    linear-gradient(180deg, rgba(2, 8, 28, 0.6), rgba(0, 0, 0, 0) 18%, rgba(3, 8, 26, 0.18) 42%, rgba(3, 7, 23, 0.24)),
    radial-gradient(circle at 50% 4%, rgba(155, 227, 255, 0.34), transparent 22%),
    radial-gradient(circle at 50% 78%, rgba(7, 24, 61, 0.22), transparent 26%);
}

.stage__currents {
  opacity: var(--flow-opacity);
  background:
    radial-gradient(circle at 18% 72%, rgba(255, 242, 179, 0.14), transparent 18%),
    radial-gradient(circle at 82% 54%, rgba(255, 231, 132, 0.13), transparent 16%),
    repeating-radial-gradient(circle at 22% 74%, rgba(255, 255, 255, 0.18) 0 2px, transparent 2px 11px),
    repeating-radial-gradient(circle at 64% 42%, rgba(255, 255, 255, 0.14) 0 2px, transparent 2px 13px),
    repeating-radial-gradient(circle at 82% 58%, rgba(255, 255, 255, 0.14) 0 2px, transparent 2px 12px),
    repeating-linear-gradient(132deg, color-mix(in srgb, var(--accent) 34%, transparent) 0 2px, transparent 2px 12px),
    repeating-linear-gradient(42deg, rgba(226, 255, 255, 0.18) 0 1px, transparent 1px 10px);
  mix-blend-mode: screen;
}

.stage__wind-layer {
  opacity: var(--wind-opacity);
  background:
    radial-gradient(circle at 30% 28%, rgba(132, 210, 255, 0.22), transparent 13%),
    radial-gradient(circle at 70% 36%, rgba(132, 210, 255, 0.18), transparent 12%),
    repeating-linear-gradient(15deg, rgba(255, 255, 255, 0.18) 0 1px, transparent 1px 18px),
    repeating-linear-gradient(15deg, rgba(112, 206, 255, 0.18) 0 1px, transparent 1px 28px);
  mix-blend-mode: screen;
}

.stage__scan {
  background:
    radial-gradient(circle at 56% 44%, rgba(255, 217, 118, 0.08), transparent 18%),
    radial-gradient(circle at 33% 72%, rgba(255, 217, 118, 0.08), transparent 18%);
}

.stage__focus-ring {
  inset: 10px;
  border: 1px solid rgba(122, 216, 255, 0.14);
  box-shadow: inset 0 0 22px rgba(32, 142, 255, 0.1);
  pointer-events: none;
}
</style>
