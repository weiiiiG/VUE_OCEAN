<template>
  <section class="system-skeleton">
    <header class="system-skeleton__header">
      <div>
        <p class="system-skeleton__eyebrow">System Management</p>
        <h2>系统管理骨架页</h2>
      </div>
      <button type="button" @click="$emit('back')">返回首页</button>
    </header>

    <div class="system-skeleton__grid">
      <div class="system-skeleton__panel system-skeleton__panel--large">
        <div class="skeleton-bar w-40"></div>
        <div class="skeleton-bar w-70"></div>
        <div class="skeleton-box h-220"></div>
      </div>
      <div class="system-skeleton__panel">
        <div class="skeleton-bar w-55"></div>
        <div class="skeleton-box h-120"></div>
        <div class="skeleton-box h-120"></div>
      </div>
      <div class="system-skeleton__panel">
        <div class="skeleton-bar w-45"></div>
        <div class="skeleton-box h-90"></div>
        <div class="skeleton-bar w-68"></div>
        <div class="skeleton-box h-90"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineEmits<{
  back: []
}>()
</script>

<style scoped lang="scss">
.system-skeleton {
  display: grid;
  gap: 14px;
  height: 100%;
  min-height: 0;
  padding: 14px;
}

.system-skeleton__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border: 1px solid rgba(96, 182, 255, 0.22);
  border-radius: 18px;
  background: rgba(10, 27, 72, 0.56);
}

.system-skeleton__eyebrow {
  margin: 0 0 8px;
  color: rgba(160, 208, 255, 0.7);
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.system-skeleton__header h2 {
  margin: 0;
  color: #f5fbff;
  font-size: 24px;
}

.system-skeleton__header button {
  height: 38px;
  padding: 0 18px;
  border: 1px solid rgba(96, 182, 255, 0.28);
  border-radius: 999px;
  background: rgba(19, 55, 131, 0.56);
  color: #f5fbff;
  cursor: pointer;
}

.system-skeleton__grid {
  display: grid;
  grid-template-columns: 1.35fr 1fr 1fr;
  gap: 14px;
}

.system-skeleton__panel {
  display: grid;
  gap: 14px;
  padding: 16px;
  border: 1px solid rgba(96, 182, 255, 0.18);
  border-radius: 18px;
  background: rgba(10, 27, 72, 0.42);
}

.system-skeleton__panel--large {
  grid-row: span 2;
}

.skeleton-bar,
.skeleton-box {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: rgba(196, 226, 255, 0.08);
}

.skeleton-bar::after,
.skeleton-box::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(176, 214, 255, 0.18), transparent);
  transform: translateX(-100%);
  animation: shimmer 1.8s linear infinite;
  content: '';
}

.skeleton-bar {
  height: 16px;
}

.skeleton-box.h-220 {
  height: 220px;
}

.skeleton-box.h-120 {
  height: 120px;
}

.skeleton-box.h-90 {
  height: 90px;
}

.w-40 {
  width: 40%;
}

.w-45 {
  width: 45%;
}

.w-55 {
  width: 55%;
}

.w-68 {
  width: 68%;
}

.w-70 {
  width: 70%;
}

@keyframes shimmer {
  to {
    transform: translateX(100%);
  }
}
</style>
