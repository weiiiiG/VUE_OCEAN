<template>
  <section :class="['legend', { 'legend--compact': compact }]">
    <div v-for="item in items" :key="item.label" class="legend__item">
      <span class="legend__bar" :style="{ background: item.color }"></span>
      <span class="legend__label">{{ item.label }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { LegendItem } from '../types/dashboard'

defineProps<{
  items: LegendItem[]
  compact?: boolean
}>()
</script>

<style scoped lang="scss">
.legend {
  display: grid;
  gap: 6px;
  min-width: 98px;
  padding: 8px 9px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.2);
}

.legend--compact {
  min-width: 90px;
  padding: 7px 8px;
}

.legend__item {
  display: grid;
  grid-template-columns: 30px 1fr;
  gap: 6px;
  align-items: center;
}

.legend__bar {
  height: 9px;
  border-radius: 999px;
}

.legend__label {
  font-size: 10px;
  color: #26355c;
  white-space: nowrap;
}
</style>
