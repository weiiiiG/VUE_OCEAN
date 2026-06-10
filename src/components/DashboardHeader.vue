<template>
  <header class="header">
    <div class="header__top-line"></div>
    <div class="header__glow-band"></div>

    <div class="header__ornament">
      <svg class="header__ornament-svg" viewBox="0 0 1600 88" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="traceFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="rgba(170,225,255,0)" />
            <stop offset="12%" stop-color="rgba(170,225,255,0.28)" />
            <stop offset="28%" stop-color="rgba(196,239,255,0.82)" />
            <stop offset="50%" stop-color="rgba(240,251,255,0.95)" />
            <stop offset="72%" stop-color="rgba(196,239,255,0.82)" />
            <stop offset="88%" stop-color="rgba(170,225,255,0.28)" />
            <stop offset="100%" stop-color="rgba(170,225,255,0)" />
          </linearGradient>
          <linearGradient id="traceGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="rgba(79,180,255,0)" />
            <stop offset="18%" stop-color="rgba(79,180,255,0.14)" />
            <stop offset="38%" stop-color="rgba(79,180,255,0.34)" />
            <stop offset="50%" stop-color="rgba(101,205,255,0.46)" />
            <stop offset="62%" stop-color="rgba(79,180,255,0.34)" />
            <stop offset="82%" stop-color="rgba(79,180,255,0.14)" />
            <stop offset="100%" stop-color="rgba(79,180,255,0)" />
          </linearGradient>
        </defs>

        <path class="trace trace--glow" stroke="url(#traceGlow)" d="M0 50 C110 50 190 42 270 42 C345 42 397 47 442 63 C480 76 519 80 604 80 H996 C1081 80 1120 76 1158 63 C1203 47 1255 42 1330 42 C1410 42 1490 50 1600 50" />
        <path class="trace trace--mid" stroke="url(#traceFade)" d="M0 48 C108 48 188 41 268 41 C343 41 395 46 440 61 C477 74 517 78 604 78 H996 C1083 78 1123 74 1160 61 C1205 46 1257 41 1332 41 C1412 41 1492 48 1600 48" />
        <path class="trace trace--fine" stroke="url(#traceFade)" d="M0 46 C106 46 186 40 266 40 C341 40 393 45 438 59 C474 71 515 74 604 74 H996 C1085 74 1126 71 1162 59 C1207 45 1259 40 1334 40 C1414 40 1494 46 1600 46" />

        <circle class="trace__dot" cx="166" cy="40" r="2.1" />
        <circle class="trace__dot trace__dot--dim" cx="178" cy="41.5" r="1.7" />
        <circle class="trace__dot trace__dot--dim" cx="190" cy="43" r="1.4" />
        <circle class="trace__dot" cx="1434" cy="40" r="2.1" />
        <circle class="trace__dot trace__dot--dim" cx="1422" cy="41.5" r="1.7" />
        <circle class="trace__dot trace__dot--dim" cx="1410" cy="43" r="1.4" />
      </svg>
    </div>

    <div class="header__row header__row--main">
      <div class="header__left">
        <div class="header__info-chip header__info-chip--location">
          <span class="header__pin"></span>
          <strong>{{ weather.location }}</strong>
        </div>
        <div class="header__info-chip">{{ weather.condition }}</div>
        <div class="header__info-chip metric-value">{{ weather.temperature }}</div>
      </div>

      <div class="header__center">
        <div class="header__title-shell">
          <div class="header__title-wrap">
            <div class="header__title-glow"></div>
            <div class="header__title-dot-group header__title-dot-group--left"></div>
            <div class="header__title-dot-group header__title-dot-group--right"></div>
            <h1>海洋要素可视化系统</h1>
          </div>
        </div>
      </div>

      <div class="header__right">
        <button class="header__action" type="button" @click="$emit('manage')">系统管理</button>
        <button class="header__user" type="button" @click="$emit('auth-click')">
          <span class="header__avatar"></span>
          <strong>{{ session.user.name }}</strong>
        </button>
        <button class="header__action" type="button" @click="$emit('logout')">
          {{ session.isLoggedIn ? '退出登录' : '点击登录' }}
        </button>
      </div>
    </div>

    <div class="header__row header__row--nav">
      <nav class="header__nav">
        <button
          v-for="item in navItems"
          :key="item.key"
          :class="['header__nav-item', { 'is-active': item.key === activeNavKey }]"
          type="button"
          @click="$emit('nav-change', item.key)"
        >
          {{ item.label }}
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { AuthSession } from '../types/app'
import type { NavItem, WeatherInfo } from '../types/dashboard'

defineProps<{
  weather: WeatherInfo
  session: AuthSession
  navItems: NavItem[]
  activeNavKey: string
}>()

defineEmits<{
  manage: []
  logout: []
  'auth-click': []
  'nav-change': [key: string]
}>()
</script>

<style scoped lang="scss">
.header {
  position: relative;
  min-height: 118px;
  padding: 0 20px;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(42, 95, 196, 0.28), rgba(18, 38, 98, 0.08) 24%, rgba(14, 28, 75, 0) 48%),
    linear-gradient(180deg, #1a3d93 0%, #153272 46%, #122758 100%);
  border-bottom: 1px solid rgba(95, 190, 255, 0.18);
  box-shadow:
    inset 0 1px 0 rgba(193, 232, 255, 0.14),
    inset 0 -18px 30px rgba(7, 18, 45, 0.22);
}

.header__top-line {
  position: absolute;
  inset: 4px 0 auto;
  height: 2px;
  background: linear-gradient(90deg, rgba(154, 213, 255, 0) 0%, rgba(154, 213, 255, 0.36) 12%, rgba(236, 248, 255, 0.92) 50%, rgba(154, 213, 255, 0.36) 88%, rgba(154, 213, 255, 0) 100%);
  box-shadow: 0 0 12px rgba(120, 201, 255, 0.28);
}

.header__glow-band {
  position: absolute;
  left: 0;
  right: 0;
  top: 11px;
  height: 20px;
  background: linear-gradient(180deg, rgba(117, 194, 255, 0.14), rgba(117, 194, 255, 0));
  filter: blur(5px);
}

.header__ornament {
  position: absolute;
  inset: -8px 0 auto;
  height: 72px;
  pointer-events: none;
}

.header__ornament-svg {
  width: 100%;
  height: 100%;
}

.trace {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.trace--glow {
  stroke-width: 8;
}

.trace--mid {
  stroke-width: 2.4;
}

.trace--fine {
  stroke-width: 1.2;
}

.trace__dot {
  fill: rgba(229, 248, 255, 0.88);
}

.trace__dot--dim {
  fill: rgba(185, 228, 255, 0.66);
}

.header__row {
  position: relative;
  z-index: 2;
}

.header__row--main {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: start;
  padding-top: 10px;
}

.header__row--nav {
  display: flex;
  justify-content: center;
  margin-top: 4px;
}

.header__left,
.header__right {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-top: 18px;
}

.header__right {
  justify-self: end;
}

.header__info-chip,
.header__action,
.header__user {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 28px;
  padding: 0 10px;
  border: 0;
  background: transparent;
  color: rgba(241, 247, 255, 0.96);
  font-size: 12px;
}

.header__action,
.header__user {
  cursor: pointer;
}

.header__action:hover,
.header__user:hover {
  color: #ffffff;
  text-shadow: 0 0 12px rgba(120, 211, 255, 0.32);
}

.header__pin,
.header__avatar {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle, #d4f2ff 0 36%, #67c8ff 37% 100%);
  box-shadow: 0 0 10px rgba(91, 192, 255, 0.5);
}

.header__avatar {
  width: 16px;
  height: 16px;
}

.header__center {
  justify-self: center;
}

.header__title-shell {
  display: flex;
  justify-content: center;
}

.header__title-wrap {
  position: relative;
  min-width: 508px;
  padding: 4px 86px 14px;
  text-align: center;
}

.header__title-glow {
  position: absolute;
  left: 50%;
  top: -4px;
  width: 420px;
  height: 62px;
  background: radial-gradient(circle at center, rgba(74, 174, 255, 0.2), transparent 66%);
  transform: translateX(-50%);
}

.header__title-dot-group {
  position: absolute;
  top: 24px;
  width: 30px;
  height: 7px;
  background: radial-gradient(circle, rgba(195, 239, 255, 0.82) 0 1.2px, transparent 1.3px);
  background-size: 7px 7px;
  opacity: 0.86;
}

.header__title-dot-group--left {
  left: 26px;
}

.header__title-dot-group--right {
  right: 26px;
}

h1 {
  position: relative;
  margin: 0;
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #fbfdff;
  text-shadow: 0 0 14px rgba(104, 204, 255, 0.3), 0 2px 0 rgba(8, 22, 68, 0.7);
}

.header__nav {
  display: flex;
  gap: 40px;
  align-items: center;
}

.header__nav-item {
  position: relative;
  padding: 0 2px 8px;
  border: 0;
  background: transparent;
  color: rgba(239, 245, 255, 0.96);
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
}

.header__nav-item.is-active::after {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 54px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, #5bd7ff, transparent);
  transform: translateX(-50%);
  box-shadow: 0 0 16px rgba(91, 215, 255, 0.55);
  content: '';
}
</style>
