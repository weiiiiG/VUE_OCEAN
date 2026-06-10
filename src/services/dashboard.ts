import { apiEndpoints, runtimeConfig } from '../config/runtime'
import { pageDataMap } from '../mock/dashboard'
import type { FilterState, PageData } from '../types/dashboard'
import type { ApiPlaceholderResult } from '../types/app'

function delay<T>(value: T, ms = runtimeConfig.requestDelayMs) {
  return new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), ms)
  })
}

function placeholder(endpoint: string, message: string): Promise<ApiPlaceholderResult> {
  return delay({
    ok: true,
    endpoint: `${runtimeConfig.apiBaseUrl}${endpoint}`,
    message,
  })
}

export function fetchDashboardPage(navKey: string): Promise<PageData> {
  return delay(pageDataMap[navKey] ?? pageDataMap.home)
}

export function syncNavSelection(navKey: string) {
  return placeholder(apiEndpoints.interactionNav, `预留页面切换接口 ${navKey}`)
}

export function syncTopicSelection(navKey: string, topicKey: string) {
  return placeholder(apiEndpoints.interactionTopic, `预留专题切换接口 ${navKey}/${topicKey}`)
}

export function syncToolbarAction(navKey: string, actionKey: string) {
  return placeholder(apiEndpoints.interactionToolbar, `预留工具栏接口 ${navKey}/${actionKey}`)
}

export function syncFilterState(navKey: string, state: FilterState) {
  return placeholder(
    apiEndpoints.interactionFilter,
    `预留筛选条件接口 ${navKey}/${state.variable}/${state.period}`,
  )
}

export function openSystemManagement() {
  return placeholder(apiEndpoints.systemManage, '预留系统管理接口')
}
