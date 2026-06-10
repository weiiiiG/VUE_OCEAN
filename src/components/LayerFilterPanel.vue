<template>
  <section :class="['filter', { 'is-collapsed': collapsed }]">
    <button class="filter__collapse" type="button" @click="collapsed = !collapsed">
      <span class="filter__collapse-track"></span>
      <span :class="['filter__collapse-arrow', { 'is-collapsed': collapsed }]"></span>
    </button>

    <div class="filter__body">
      <div class="filter__time-row">
        <el-date-picker
          class="filter__time-picker"
          type="month"
          format="YYYY-MM"
          value-format="YYYY-MM"
          placement="bottom-start"
          popper-class="filter-month-popper filter-month-popper--start"
          :clearable="false"
          :editable="false"
          :model-value="state.startPeriod"
          @update:model-value="updatePeriod('startPeriod', $event)"
        />
        <span class="filter__time-arrow">→</span>
        <el-date-picker
          class="filter__time-picker"
          type="month"
          format="YYYY-MM"
          value-format="YYYY-MM"
          placement="bottom-end"
          popper-class="filter-month-popper filter-month-popper--end"
          :clearable="false"
          :editable="false"
          :model-value="state.endPeriod"
          @update:model-value="updatePeriod('endPeriod', $event)"
        />
        <span class="filter__time-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M7 3v3M17 3v3M4 8h16M6 5h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
          </svg>
        </span>
      </div>

      <div class="filter__title-bar">{{ title }}</div>

      <div class="filter__scroll">
        <div class="filter__meta-row">
          <div class="filter__meta-title">变量</div>
          <div class="filter__switch-wrap">
            <span>廓线点:</span>
            <el-switch :model-value="state.showProfilePoints" @update:model-value="update('showProfilePoints', $event)" />
          </div>
        </div>

        <div class="filter__tags">
          <button
            v-for="option in variableOptions"
            :key="option"
            :class="['filter__tag', { 'is-active': option === state.variable }]"
            type="button"
            @click="update('variable', option)"
          >
            {{ option }}
          </button>
        </div>

        <div class="filter__section-title">色带</div>
        <div class="filter__gradient-wrap">
          <div class="filter__gradient"></div>
          <span class="filter__gradient-arrow">▾</span>
        </div>
        <div class="filter__ticks">
          <span v-for="tick in ticks" :key="tick">{{ tick }}</span>
        </div>

        <div class="filter__minmax-row">
          <label>
            <span>最小值</span>
            <el-input
              :model-value="String(state.minValue)"
              size="small"
              @update:model-value="updateNumeric('minValue', $event)"
            />
          </label>
          <label>
            <span>最大值</span>
            <el-input
              :model-value="String(state.maxValue)"
              size="small"
              @update:model-value="updateNumeric('maxValue', $event)"
            />
          </label>
        </div>

        <div class="filter__section-title">深度</div>
        <div class="filter__row filter__row--top">
          <el-select :model-value="state.depth" size="small" @update:model-value="update('depth', $event)">
            <el-option label="表层" value="表层" />
            <el-option label="50m" value="50m" />
            <el-option label="100m" value="100m" />
          </el-select>
          <el-select :model-value="state.period" size="small" @update:model-value="update('period', $event)">
            <el-option label="2024-12" value="2024-12" />
            <el-option label="2024-06" value="2024-06" />
            <el-option label="2023-12" value="2023-12" />
          </el-select>
        </div>

        <div class="filter__switch-row">
          <span>洋流</span>
          <el-switch :model-value="state.showCurrent" @update:model-value="update('showCurrent', $event)" />
          <span>风场</span>
          <el-switch :model-value="state.showWindField" @update:model-value="update('showWindField', $event)" />
        </div>

        <div class="filter__slider-label">
          <span>强度</span>
          <strong class="metric-value">{{ state.intensity }}</strong>
        </div>
        <el-slider :min="0" :max="100" :model-value="state.intensity" @update:model-value="update('intensity', $event)" />

        <div class="filter__footer">
          <button type="button" @click="$emit('confirm')">显示</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { FilterState } from '../types/dashboard'

const props = defineProps<{
  title: string
  state: FilterState
  variableOptions: string[]
}>()

const emit = defineEmits<{
  change: [state: FilterState]
  confirm: []
}>()

const collapsed = ref(false)

const ticks = computed(() => {
  const start = Number(props.state.minValue)
  const end = Number(props.state.maxValue)
  const step = (end - start) / 6

  return Array.from({ length: 7 }, (_, index) => (start + step * index).toFixed(2))
})

function update<K extends keyof FilterState>(key: K, value: FilterState[K]) {
  emit('change', { ...props.state, [key]: value })
}

function updateNumeric<K extends 'minValue' | 'maxValue'>(key: K, value: string) {
  const numeric = Number(value)
  emit('change', {
    ...props.state,
    [key]: Number.isFinite(numeric) ? numeric : props.state[key],
  })
}

function updatePeriod(key: 'startPeriod' | 'endPeriod', value: string) {
  const nextState: FilterState = {
    ...props.state,
    [key]: value,
  }

  if (key === 'endPeriod') {
    nextState.period = value
  }

  emit('change', nextState)
}
</script>

<style scoped lang="scss">
.filter {
  position: relative;
  width: 236px;
  height: 100%;
  border-radius: 8px;
  background: rgba(92, 101, 105, 0.72);
  backdrop-filter: blur(8px);
  color: #eef7ff;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.22);
  transition: width 220ms ease, box-shadow 220ms ease;
}

.filter.is-collapsed {
  width: 18px;
  background: rgba(92, 101, 105, 0.46);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
}

.filter__body {
  position: relative;
  height: 100%;
  padding: 8px 18px 14px 8px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  transition: opacity 160ms ease;
}

.filter.is-collapsed .filter__body {
  opacity: 0;
  pointer-events: none;
}

.filter__collapse {
  position: absolute;
  top: 132px;
  right: 2px;
  width: 10px;
  height: 112px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: linear-gradient(180deg, rgba(202, 239, 255, 0.28), rgba(98, 126, 155, 0.34) 22%, rgba(36, 51, 83, 0.82) 100%);
  box-shadow:
    inset 1px 0 0 rgba(239, 249, 255, 0.18),
    inset 0 0 0 1px rgba(124, 180, 214, 0.18);
  cursor: pointer;
  z-index: 5;
}

.filter__collapse-track {
  position: absolute;
  inset: 6px 2px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(209, 242, 255, 0.24), rgba(93, 126, 161, 0.16) 20%, rgba(18, 28, 53, 0.68) 78%, rgba(10, 18, 38, 0.92) 100%);
}

.filter__collapse-arrow {
  position: relative;
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-right: 5px solid rgba(241, 250, 255, 0.95);
  filter: drop-shadow(0 0 4px rgba(143, 220, 255, 0.42));
}

.filter__collapse-arrow.is-collapsed {
  border-right: 0;
  border-left: 5px solid rgba(241, 250, 255, 0.95);
}

.filter__scroll {
  flex: 1;
  min-height: 0;
  margin-top: 6px;
  padding-right: 2px;
  padding-bottom: 8px;
  overflow-y: auto;
}

.filter__time-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 24px minmax(0, 1fr) 18px;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 12px;
  border-radius: 6px;
  background: rgba(53, 59, 70, 0.92);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.filter__time-arrow {
  justify-self: center;
  font-size: 13px;
  font-weight: 700;
  color: rgba(162, 168, 180, 0.82);
}

.filter__time-icon {
  width: 18px;
  height: 18px;
  display: inline-grid;
  place-items: center;
  color: rgba(132, 139, 152, 0.88);
}

.filter__time-icon svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.filter__time-picker {
  min-width: 0;
  width: 100%;
}

:deep(.filter__time-picker .el-input__wrapper) {
  padding: 0;
  background: transparent;
  box-shadow: none;
}

:deep(.filter__time-picker .el-input__inner) {
  font-size: 12px;
  font-weight: 700;
  color: rgba(241, 244, 250, 0.96);
  text-align: left;
  white-space: nowrap;
}

:deep(.filter__time-picker .el-input__prefix),
:deep(.filter__time-picker .el-input__suffix) {
  display: none;
}

:global(.filter-month-popper) {
  --el-datepicker-border-color: rgba(109, 167, 210, 0.54);
  --el-bg-color-overlay: rgba(29, 38, 56, 0.96);
  --el-text-color-primary: rgba(241, 247, 255, 0.96);
  --el-text-color-regular: rgba(214, 230, 243, 0.9);
  --el-fill-color-light: rgba(90, 129, 162, 0.2);
  --el-border-color-light: rgba(93, 143, 183, 0.32);
  border-radius: 10px;
  box-shadow: 0 16px 28px rgba(5, 10, 20, 0.34);
}

:global(.filter-month-popper .el-popper__arrow::before) {
  background: rgba(29, 38, 56, 0.96);
  border-color: rgba(109, 167, 210, 0.54);
}

:global(.filter-month-popper--start .el-popper__arrow) {
  left: 34px !important;
}

:global(.filter-month-popper--end .el-popper__arrow) {
  left: calc(100% - 34px) !important;
}

.filter__title-bar {
  margin-top: 6px;
  padding: 5px 8px;
  border-radius: 4px;
  background: rgba(123, 128, 122, 0.3);
  font-size: 12px;
  font-weight: 700;
}

.filter__meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2px 0 6px;
  font-size: 12px;
}

.filter__meta-title,
.filter__section-title {
  font-weight: 700;
}

.filter__switch-wrap {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.filter__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.filter__tag {
  min-width: 52px;
  height: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  background: rgba(118, 124, 129, 0.55);
  color: #fff;
  font-size: 11px;
  cursor: pointer;
}

.filter__tag.is-active {
  background: rgba(71, 76, 81, 0.9);
  box-shadow: inset 0 0 0 1px rgba(171, 232, 255, 0.36);
}

.filter__section-title,
.filter__slider-label,
.filter__minmax-row span {
  margin-bottom: 6px;
  font-size: 12px;
}

.filter__gradient-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  padding: 0 6px;
  margin-bottom: 6px;
  border-radius: 4px;
  background: rgba(58, 64, 73, 0.74);
}

.filter__gradient {
  flex: 1;
  height: 12px;
  border-radius: 2px;
  background: linear-gradient(90deg, #2232ff 0%, #3ca8ff 22%, #19bf7c 52%, #d9d94b 74%, #ef3127 100%);
}

.filter__gradient-arrow {
  font-size: 11px;
}

.filter__ticks {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.82);
}

.filter__minmax-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 10px;
}

.filter__minmax-row label {
  display: grid;
  gap: 4px;
}

.filter__row {
  display: grid;
  gap: 8px;
}

.filter__row--top {
  grid-template-columns: 1fr 1fr;
  margin-bottom: 8px;
}

.filter__switch-row {
  display: grid;
  grid-template-columns: auto auto auto auto;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
}

.filter__slider-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter__footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 6px;
}

.filter__footer button {
  min-width: 52px;
  height: 28px;
  border: 0;
  border-radius: 4px;
  background: rgba(18, 24, 53, 0.88);
  color: #fff;
  cursor: pointer;
}

:deep(.el-select__wrapper),
:deep(.el-input__wrapper) {
  min-height: 28px;
  background: rgba(62, 66, 77, 0.7);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

:deep(.el-slider__runway) {
  margin: 10px 0 12px;
}

.filter__scroll::-webkit-scrollbar {
  width: 4px;
}

.filter__scroll::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(182, 226, 255, 0.42);
}
</style>
