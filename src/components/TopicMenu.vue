<template>
  <aside class="topic-menu">
    <button
      v-for="item in items"
      :key="item.key"
      :class="['topic-menu__item', { 'is-active': item.key === activeKey }]"
      type="button"
      @click="$emit('change', item.key)"
    >
      {{ item.label }}
    </button>
  </aside>
</template>

<script setup lang="ts">
import type { TopicItem } from '../types/dashboard'

defineProps<{
  items: TopicItem[]
  activeKey: string
}>()

defineEmits<{
  change: [key: string]
}>()
</script>

<style scoped lang="scss">
.topic-menu {
  display: grid;
  gap: 10px;
  padding-top: 2px;
}

.topic-menu__item {
  min-height: 42px;
  padding: 10px 10px;
  border: 2px solid #6bd2ff;
  border-radius: 7px;
  background: linear-gradient(180deg, rgba(40, 100, 192, 0.96), rgba(28, 79, 164, 0.96));
  box-shadow:
    inset 0 0 0 1px rgba(199, 238, 255, 0.14),
    0 0 0 1px rgba(38, 121, 214, 0.22);
  color: #f4fbff;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  cursor: pointer;
  transition: box-shadow 180ms ease, border-color 180ms ease, transform 180ms ease;
}

.topic-menu__item:hover {
  transform: translateX(1px);
}

.topic-menu__item.is-active {
  border-color: #ffd25a;
  box-shadow:
    inset 0 0 0 1px rgba(255, 245, 191, 0.18),
    0 0 0 1px rgba(255, 213, 102, 0.24);
}
</style>
