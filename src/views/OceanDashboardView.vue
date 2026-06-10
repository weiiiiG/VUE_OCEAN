<template>
  <main class="dashboard-view">
    <DashboardHeader
      :weather="currentPage.weather"
      :session="authSession"
      :nav-items="navItems"
      :active-nav-key="activeNavKey"
      @manage="handleSystemManage"
      @logout="handleLogoutClick"
      @auth-click="handleAuthClick"
      @nav-change="handleNavChange"
    />

    <SystemManagementSkeleton v-if="currentScreen === 'management'" @back="currentScreen = 'dashboard'" />

    <section v-else :class="['dashboard-view__shell', { 'is-stage-focus': mapViewport.isFullscreen }]">
      <aside class="dashboard-view__sidebar">
        <TopicMenu :items="currentPage.topicItems" :active-key="currentTopicKey" @change="handleTopicChange" />
      </aside>

      <section class="dashboard-view__stage-wrap">
        <MapStage
          :detail="currentTopicDetail"
          :viewport="mapViewport"
          :filter-state="currentFilterState"
          :can-drag="activeToolKey === 'pan'"
          @viewport-change="handleViewportChange"
        />

        <div class="dashboard-view__toolbar">
          <MapToolbar
            :actions="currentPage.toolbarActions"
            :active-key="activeToolKey"
            @change="handleToolChange"
          />
        </div>

        <div class="dashboard-view__filter">
          <LayerFilterPanel
            :title="currentTopicDetail.title"
            :state="currentDraftFilterState"
            :variable-options="currentTopicDetail.labels"
            @change="handleFilterChange"
            @confirm="handleFilterConfirm"
          />
        </div>

        <div class="dashboard-view__trend">
          <TrendCard
            :title="currentTrendTitle"
            :points="currentTrendPoints"
            :unit="currentTrendUnit"
            :accent-color="currentTopicDetail.mapAccent"
          />
        </div>

        <div v-if="mapViewport.showLegend" class="dashboard-view__legend">
          <MapLegend :items="currentPage.legendItems" :compact="activeNavKey !== 'home'" />
        </div>

        <div class="dashboard-view__mini-map">
          <MiniMapCard :viewport="mapViewport" @navigate="handleMiniMapNavigate" />
        </div>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import DashboardHeader from '../components/DashboardHeader.vue'
import LayerFilterPanel from '../components/LayerFilterPanel.vue'
import MapLegend from '../components/MapLegend.vue'
import MapStage from '../components/MapStage.vue'
import MapToolbar from '../components/MapToolbar.vue'
import MiniMapCard from '../components/MiniMapCard.vue'
import SystemManagementSkeleton from '../components/SystemManagementSkeleton.vue'
import TopicMenu from '../components/TopicMenu.vue'
import TrendCard from '../components/TrendCard.vue'
import { runtimeConfig } from '../config/runtime'
import { navItems, pageDataMap, userProfile } from '../mock/dashboard'
import {
  fetchDashboardPage,
  openSystemManagement,
  syncFilterState,
  syncNavSelection,
  syncTopicSelection,
  syncToolbarAction,
} from '../services/dashboard'
import { initializeAuthSession, loginWithPassword, logoutSession } from '../services/auth'
import type { AuthSession } from '../types/app'
import type { FilterState, MapViewportState, PageData, TrendPoint } from '../types/dashboard'

const STAGE_WIDTH = 1120
const STAGE_HEIGHT = 594
const STAGE_HEIGHT_FOCUS = 642
const BASE_SCALE = 1
const MAX_SCALE = 1.92
const MIN_SCALE = 1

const activeNavKey = ref(navItems[0]?.key ?? 'home')
const currentPageRef = ref<PageData>(pageDataMap[activeNavKey.value])
const currentScreen = ref<'dashboard' | 'management'>('dashboard')

const authSession = reactive<AuthSession>({
  isLoggedIn: false,
  user: userProfile,
  mode: runtimeConfig.autoLoginEnabled ? 'auto' : 'manual',
  message: '',
})

const topicStateMap = reactive(
  Object.fromEntries(
    Object.entries(pageDataMap).map(([key, page]) => [key, page.topicItems[0]?.key ?? '']),
  ) as Record<string, string>,
)

const toolStateMap = reactive(
  Object.fromEntries(
    Object.entries(pageDataMap).map(([key, page]) => [key, page.toolbarActions[0]?.key ?? 'pan']),
  ) as Record<string, string>,
)

const appliedFilterStateMap = reactive(
  Object.fromEntries(
    Object.entries(pageDataMap).map(([key, page]) => [key, { ...page.initialFilterState }]),
  ) as Record<string, FilterState>,
)

const draftFilterStateMap = reactive(
  Object.fromEntries(
    Object.entries(pageDataMap).map(([key, page]) => [key, { ...page.initialFilterState }]),
  ) as Record<string, FilterState>,
)

const mapViewport = reactive<MapViewportState>({
  scale: BASE_SCALE,
  offsetX: 0,
  offsetY: 0,
  showLegend: true,
  isFullscreen: false,
})

const currentPage = computed(() => currentPageRef.value)
const currentTopicKey = computed(() => topicStateMap[activeNavKey.value])
const activeToolKey = computed(() => toolStateMap[activeNavKey.value])
const currentFilterState = computed(() => appliedFilterStateMap[activeNavKey.value])
const currentDraftFilterState = computed(() => draftFilterStateMap[activeNavKey.value])

const currentTopicDetail = computed(() => {
  const page = currentPage.value
  return page.topicDetails[currentTopicKey.value] ?? Object.values(page.topicDetails)[0]
})

const currentTrendPoints = computed<TrendPoint[]>(() => {
  const page = currentPage.value
  const topicSeriesMap =
    page.trendPointsByTopic[currentTopicKey.value] ?? Object.values(page.trendPointsByTopic)[0] ?? {}
  return topicSeriesMap[currentFilterState.value.variable] ?? Object.values(topicSeriesMap)[0] ?? []
})

const currentTrendTitle = computed(() => {
  if (currentFilterState.value.variable === 'Uo') {
    return '洋流Uo时间变化线'
  }

  if (currentFilterState.value.variable === 'Vo') {
    return '洋流Vo时间变化线'
  }

  return currentTopicDetail.value.trendTitle
})

const currentTrendUnit = computed(() => resolveTrendUnit(currentFilterState.value.variable, currentTopicDetail.value.trendUnit))

onMounted(async () => {
  Object.assign(authSession, await initializeAuthSession())
})

async function loadPage(navKey: string) {
  currentPageRef.value = await fetchDashboardPage(navKey)
}

async function handleNavChange(key: string) {
  currentScreen.value = 'dashboard'
  activeNavKey.value = key
  await loadPage(key)
  syncFilterVariableWithTopic(activeNavKey.value, topicStateMap[activeNavKey.value])
  resetViewport()
  await syncNavSelection(key)
}

async function handleTopicChange(key: string) {
  if (topicStateMap[activeNavKey.value] === key) {
    return
  }

  topicStateMap[activeNavKey.value] = key
  syncFilterVariableWithTopic(activeNavKey.value, key)
  await syncTopicSelection(activeNavKey.value, key)
}

async function handleToolChange(key: string) {
  if (key !== 'pan') {
    applyMapAction(key)
  }
  toolStateMap[activeNavKey.value] = key
  await syncToolbarAction(activeNavKey.value, key)
}

function handleFilterChange(state: FilterState) {
  draftFilterStateMap[activeNavKey.value] = normalizeFilterState(state)
}

function handleFilterConfirm() {
  appliedFilterStateMap[activeNavKey.value] = { ...normalizeFilterState(currentDraftFilterState.value) }
  void syncFilterState(activeNavKey.value, appliedFilterStateMap[activeNavKey.value])
}

async function handleSystemManage() {
  currentScreen.value = 'management'
  await openSystemManagement()
}

function handleAuthClick() {
  if (runtimeConfig.autoLoginEnabled || authSession.isLoggedIn) {
    return
  }

  void handleManualLogin()
}

async function handleLogoutClick() {
  const nextSession = await logoutSession(authSession.user.name)
  Object.assign(authSession, nextSession)

  if (runtimeConfig.autoLoginEnabled) {
    ElMessage({
      type: 'info',
      message: '当前已设置保持登录状态',
      customClass: 'dashboard-feedback-message',
    })
    return
  }

  ElMessage({
    type: 'success',
    message: '已退出登录，请手动登录',
    customClass: 'dashboard-feedback-message',
  })
}

async function handleManualLogin() {
  const nextSession = await loginWithPassword({
    username: authSession.user.name,
    password: runtimeConfig.defaultPassword,
  })

  Object.assign(authSession, nextSession)
}

function applyMapAction(actionKey: string) {
  if (actionKey === 'zoom-in') {
    mapViewport.scale = clampScale(mapViewport.scale + 0.12)
    clampViewport()
    return
  }

  if (actionKey === 'zoom-out') {
    mapViewport.scale = clampScale(mapViewport.scale - 0.12)
    clampViewport()
    return
  }

  if (actionKey === 'reset') {
    resetViewport()
    return
  }

  if (actionKey === 'legend') {
    mapViewport.showLegend = !mapViewport.showLegend
    return
  }

  if (actionKey === 'fullscreen') {
    mapViewport.isFullscreen = !mapViewport.isFullscreen
    clampViewport()
  }
}

function handleViewportChange(nextViewport: MapViewportState) {
  mapViewport.offsetX = nextViewport.offsetX
  mapViewport.offsetY = nextViewport.offsetY
  mapViewport.scale = clampScale(nextViewport.scale)
  mapViewport.showLegend = nextViewport.showLegend
  mapViewport.isFullscreen = nextViewport.isFullscreen
  clampViewport()
}

function handleMiniMapNavigate(ratioX: number, ratioY: number) {
  const width = STAGE_WIDTH
  const height = getStageHeight()
  const maxX = Math.max(0, ((mapViewport.scale - 1) * width) / 2)
  const maxY = Math.max(0, ((mapViewport.scale - 1) * height) / 2)
  mapViewport.offsetX = Math.round((0.5 - ratioX) * 2 * maxX)
  mapViewport.offsetY = Math.round((0.5 - ratioY) * 2 * maxY)
  clampViewport()
}

function resetViewport() {
  mapViewport.scale = BASE_SCALE
  mapViewport.offsetX = 0
  mapViewport.offsetY = 0
  mapViewport.isFullscreen = false
  mapViewport.showLegend = true
}

function clampViewport() {
  const width = STAGE_WIDTH
  const height = getStageHeight()
  const maxX = Math.max(0, ((mapViewport.scale - 1) * width) / 2)
  const maxY = Math.max(0, ((mapViewport.scale - 1) * height) / 2)
  mapViewport.offsetX = Math.min(maxX, Math.max(-maxX, mapViewport.offsetX))
  mapViewport.offsetY = Math.min(maxY, Math.max(-maxY, mapViewport.offsetY))
}

function getStageHeight() {
  return mapViewport.isFullscreen ? STAGE_HEIGHT_FOCUS : STAGE_HEIGHT
}

function syncFilterVariableWithTopic(navKey: string, topicKey: string) {
  const page = pageDataMap[navKey]
  const detail = page.topicDetails[topicKey] ?? Object.values(page.topicDetails)[0]
  const nextVariable = detail.labels[0] ?? topicKey

  appliedFilterStateMap[navKey] = normalizeFilterState({
    ...appliedFilterStateMap[navKey],
    variable: detail.labels.includes(appliedFilterStateMap[navKey].variable)
      ? appliedFilterStateMap[navKey].variable
      : nextVariable,
  })

  draftFilterStateMap[navKey] = normalizeFilterState({
    ...draftFilterStateMap[navKey],
    variable: detail.labels.includes(draftFilterStateMap[navKey].variable)
      ? draftFilterStateMap[navKey].variable
      : nextVariable,
  })
}

function normalizeFilterState(state: FilterState): FilterState {
  const minValue = Number.isFinite(Number(state.minValue)) ? Number(state.minValue) : 0
  const maxValueRaw = Number.isFinite(Number(state.maxValue)) ? Number(state.maxValue) : minValue + 1
  const maxValue = Math.max(minValue + 0.01, maxValueRaw)
  const startPeriod = state.startPeriod || '1900-01'
  const endPeriod = state.endPeriod || state.period || '2024-12'

  return {
    ...state,
    startPeriod,
    endPeriod,
    period: endPeriod,
    intensity: Math.max(0, Math.min(100, Math.round(Number(state.intensity) || 0))),
    minValue: Number(minValue.toFixed(2)),
    maxValue: Number(maxValue.toFixed(2)),
  }
}

function clampScale(value: number) {
  return Number(Math.min(MAX_SCALE, Math.max(MIN_SCALE, value)).toFixed(2))
}

function resolveTrendUnit(variable: string, fallbackUnit: string) {
  if (['Uo', 'Vo', '风速', '风向'].includes(variable)) {
    return 'm/s'
  }

  if (['温度', '海温'].includes(variable)) {
    return '°C'
  }

  if (['盐度', '密度'].includes(variable)) {
    return 'PSU'
  }

  if (['pH', '总碱度'].includes(variable)) {
    return 'pH'
  }

  if (['叶绿素', '生物量'].includes(variable)) {
    return 'mg/m³'
  }

  if (['潮位', '振幅'].includes(variable)) {
    return 'm'
  }

  if (['覆盖率', '在线率', '命中率', '置信度', '云量', '通过率'].includes(variable)) {
    return '%'
  }

  if (['漂移距离', '锋面长度'].includes(variable)) {
    return 'km'
  }

  return fallbackUnit
}
</script>

<style scoped lang="scss">
.dashboard-view {
  min-width: 1440px;
  height: 100vh;
  display: grid;
  grid-template-rows: 118px minmax(0, 1fr);
  background: linear-gradient(180deg, #1b245c 0%, #182055 100%);
  overflow: hidden;
}

.dashboard-view__shell {
  display: grid;
  grid-template-columns: 158px minmax(0, 1fr);
  gap: 10px;
  min-height: 0;
  padding: 8px 10px 10px;
}

.dashboard-view__shell.is-stage-focus {
  grid-template-columns: 142px minmax(0, 1fr);
}

.dashboard-view__sidebar {
  display: grid;
  align-content: start;
  min-height: 0;
}

.dashboard-view__stage-wrap {
  position: relative;
  min-height: 0;
  border: 1px solid rgba(240, 214, 124, 0.75);
  border-radius: 10px;
  background: #020918;
  overflow: hidden;
}

.dashboard-view__toolbar,
.dashboard-view__filter,
.dashboard-view__trend,
.dashboard-view__legend,
.dashboard-view__mini-map {
  position: absolute;
  z-index: 6;
}

.dashboard-view__toolbar {
  top: 10px;
  left: 10px;
}

.dashboard-view__filter {
  top: 60px;
  left: 10px;
  bottom: 112px;
  display: flex;
}

.dashboard-view__trend {
  top: 10px;
  right: 10px;
}

.dashboard-view__legend {
  left: 10px;
  bottom: 10px;
}

.dashboard-view__mini-map {
  right: 12px;
  bottom: 10px;
}
</style>
