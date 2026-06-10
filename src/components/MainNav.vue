<template>
  <nav class="main-nav">
    <button
      v-for="item in items"
      :key="item.key"
      :class="['main-nav__item', { 'is-active': item.key === activeKey }]"
      type="button"
      @click="$emit('change', item.key)"
    >
      {{ item.label }}
    </button>
  </nav>
</template>

<script setup lang="ts">
import type { NavItem } from '../types/dashboard'

defineProps<{
  items: NavItem[]
  activeKey: string
}>()

defineEmits<{
  change: [key: string]
}>()
</script>

<style scoped lang="scss">
.main-nav {
  display: flex;
  justify-content: center;
  gap: 34px;
  padding: 10px 20px 8px;
  background: linear-gradient(180deg, rgba(17, 35, 88, 0.66), rgba(14, 29, 75, 0.12));
}

.main-nav__item {
  position: relative;
  padding: 0 4px 8px;
  border: 0;
  background: transparent;
  color: rgba(236, 244, 255, 0.9);
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: color 180ms ease, text-shadow 180ms ease;
}

.main-nav__item:hover,
.main-nav__item.is-active {
  color: #ffffff;
  text-shadow: 0 0 14px rgba(86, 189, 255, 0.45);
}

.main-nav__item.is-active::after {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 52px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, #5bd7ff, transparent);
  transform: translateX(-50%);
  box-shadow: 0 0 16px rgba(91, 215, 255, 0.55);
  content: '';
}
</style>
