<template>
  <div class="toolbar">
    <button
      v-for="action in actions"
      :key="action.key"
      :class="['toolbar__item', { 'is-active': action.key === activeKey }]"
      type="button"
      @click="$emit('change', action.key)"
    >
      <span class="toolbar__icon" aria-hidden="true">
        <svg v-if="action.icon === 'pan'" viewBox="0 0 24 24">
          <path d="M12 3v18M3 12h18M8 8l4-5 4 5M8 16l4 5 4-5M16 8l5 4-5 4M8 8l-5 4 5 4" />
        </svg>
        <svg v-else-if="action.icon === 'zoom-in'" viewBox="0 0 24 24">
          <circle cx="10" cy="10" r="5.5" />
          <path d="M10 7v6M7 10h6M14.5 14.5 20 20" />
        </svg>
        <svg v-else-if="action.icon === 'zoom-out'" viewBox="0 0 24 24">
          <circle cx="10" cy="10" r="5.5" />
          <path d="M7 10h6M14.5 14.5 20 20" />
        </svg>
        <svg v-else-if="action.icon === 'reset'" viewBox="0 0 24 24">
          <path d="M6 8V4m0 0h4M6 4l4 4" />
          <path d="M7 16.5A7 7 0 1 0 7 7.5" />
        </svg>
        <svg v-else-if="action.icon === 'toggle'" viewBox="0 0 24 24">
          <path d="M4 18h16M6 14h12M8 10h8M10 6h4" />
        </svg>
        <svg v-else-if="action.icon === 'fullscreen'" viewBox="0 0 24 24">
          <path d="M8 4H4v4M16 4h4v4M8 20H4v-4M16 20h4v-4" />
        </svg>
      </span>
      <span class="toolbar__label">{{ action.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ToolbarAction } from '../types/dashboard'

defineProps<{
  actions: ToolbarAction[]
  activeKey: string
}>()

defineEmits<{
  change: [key: string]
}>()
</script>

<style scoped lang="scss">
.toolbar {
  display: flex;
  align-items: stretch;
  gap: 0;
  padding: 2px;
  overflow: hidden;
  border: 1px solid rgba(93, 178, 255, 0.42);
  border-radius: 7px;
  background: rgba(247, 252, 255, 0.97);
  box-shadow: 0 10px 18px rgba(4, 17, 48, 0.26);
}

.toolbar__item {
  display: grid;
  justify-items: center;
  gap: 3px;
  min-width: 48px;
  padding: 4px 8px 5px;
  border: 0;
  border-right: 1px solid rgba(88, 161, 232, 0.24);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(239, 248, 255, 0.92));
  color: #1252a8;
  cursor: pointer;
}

.toolbar__item:last-child {
  border-right: 0;
}

.toolbar__item:hover,
.toolbar__item.is-active {
  background: linear-gradient(180deg, rgba(237, 247, 255, 1), rgba(214, 236, 255, 0.94));
}

.toolbar__icon {
  width: 18px;
  height: 18px;
  display: inline-grid;
  place-items: center;
  color: #1560be;
}

.toolbar__icon svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.toolbar__label {
  font-size: 10px;
  line-height: 1;
  white-space: nowrap;
}
</style>
