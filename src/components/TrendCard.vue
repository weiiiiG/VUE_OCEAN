<template>
  <section class="trend">
    <header class="trend__header">
      <div class="trend__title">{{ title }}</div>
    </header>
    <div ref="chartRef" class="trend__chart"></div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { TrendPoint } from '../types/dashboard'

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer])

const props = defineProps<{
  title: string
  points: TrendPoint[]
  unit: string
  accentColor?: string
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

function renderChart() {
  if (!chartRef.value) {
    return
  }

  if (!chart) {
    chart = echarts.init(chartRef.value)
  }

  const color = props.accentColor ?? '#6da6ff'

  chart.setOption({
    animationDuration: 420,
    grid: { left: 12, right: 18, top: 18, bottom: 18, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(3, 6, 20, 0.92)',
      borderColor: 'rgba(132, 167, 255, 0.35)',
      textStyle: { color: '#f2f7ff' },
      valueFormatter: (value: number) => `${value}${props.unit}`,
    },
    xAxis: {
      type: 'category',
      data: props.points.map((point) => point.time),
      boundaryGap: false,
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.18)' } },
      axisTick: { show: false },
      axisLabel: { color: 'rgba(226, 235, 255, 0.6)', fontSize: 10 },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: 'rgba(226, 235, 255, 0.5)', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.08)' } },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        data: props.points.map((point) => point.value),
        lineStyle: {
          width: 2,
          color,
          shadowBlur: 16,
          shadowColor: `${color}55`,
        },
        itemStyle: {
          color: '#c3d5ff',
          borderColor: color,
          borderWidth: 2,
        },
      },
    ],
  })
}

onMounted(() => {
  renderChart()

  if (chartRef.value) {
    resizeObserver = new ResizeObserver(() => chart?.resize())
    resizeObserver.observe(chartRef.value)
  }
})

watch(
  () => [props.points, props.unit, props.title, props.accentColor],
  () => renderChart(),
  { deep: true },
)

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  chart?.dispose()
  resizeObserver = null
  chart = null
})
</script>

<style scoped lang="scss">
.trend {
  width: 360px;
  min-height: 146px;
  padding: 10px 12px 8px;
  border-radius: 12px;
  background: rgba(7, 10, 25, 0.72);
  backdrop-filter: blur(6px);
  box-shadow: 0 16px 32px rgba(1, 7, 22, 0.38);
}

.trend__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.trend__title {
  color: rgba(240, 247, 255, 0.92);
  font-size: 13px;
  font-weight: 700;
}

.trend__chart {
  height: 116px;
}
</style>
