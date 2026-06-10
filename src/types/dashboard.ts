export interface NavItem {
  key: string
  label: string
  description: string
}

export interface TopicItem {
  key: string
  label: string
  shortLabel: string
  status: 'active' | 'standby' | 'alert'
}

export interface ToolbarAction {
  key: string
  label: string
  icon: string
}

export interface LegendItem {
  label: string
  color: string
  description: string
}

export interface TrendPoint {
  time: string
  value: number
}

export interface TrendSeriesMap {
  [variable: string]: TrendPoint[]
}

export interface WeatherInfo {
  location: string
  condition: string
  temperature: string
  wind: string
  waveHeight: string
  tide: string
  updatedAt: string
}

export interface FilterState {
  depth: string
  startPeriod: string
  endPeriod: string
  period: string
  variable: string
  showCurrent: boolean
  showWindField: boolean
  showProfilePoints: boolean
  intensity: number
  minValue: number
  maxValue: number
}

export interface StatusMetric {
  label: string
  value: string
}

export interface TopicDetail {
  title: string
  subtitle: string
  coordinates: string
  satellite: string
  labels: string[]
  markers: string[]
  trendTitle: string
  trendSubtitle: string
  trendPeakLabel: string
  trendUnit: string
  mapAccent: string
}

export interface MapViewportState {
  scale: number
  offsetX: number
  offsetY: number
  showLegend: boolean
  isFullscreen: boolean
}

export interface PageData {
  navKey: string
  weather: WeatherInfo
  headerStats: StatusMetric[]
  topicItems: TopicItem[]
  toolbarActions: ToolbarAction[]
  legendItems: LegendItem[]
  trendPointsByTopic: Record<string, TrendSeriesMap>
  topicDetails: Record<string, TopicDetail>
  initialFilterState: FilterState
}

export interface UserProfile {
  name: string
  role: string
}
